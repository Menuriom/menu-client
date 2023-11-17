import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { useItemsStore } from "@/stores/items";
import { useItemsFilterStore } from "@/stores/itemsFilter";
import { useOrdersStore } from "@/stores/orders";
import { H3Event, getHeaders } from "h3";
import axios from "axios";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const stylesStore = useStylesStore();
    const infoStore = useInfoStore();
    const itemsStore = useItemsStore();
    const itemsFilterStore = useItemsFilterStore();
    const ordersStore = useOrdersStore();
    const nuxtApp = useNuxtApp();
    const { locale, setLocale, setLocaleCookie, defaultLocale } = nuxtApp.$i18n;

    let results;
    if (!stylesStore.dataIsLoaded || !infoStore.dataIsLoaded || !itemsStore.dataIsLoaded) {
        results = await getData(nuxtApp.ssrContext?.event || null, to.params.brand_username.toString()).catch((e) => {
            if (process.server) console.error({ e });
        });
    }

    if (results) {
        if (!stylesStore.dataIsLoaded) {
            stylesStore.handleData(results.data);
        }
        if (!infoStore.dataIsLoaded) {
            infoStore.handleData({ brand: results.data.brand, branches: results.data.branches, workingHours: results.data.workingHours });
            itemsFilterStore.selectedBranch = infoStore.restaurantInfo?.branches?.[0] || {};
        }
        if (!itemsStore.dataIsLoaded) {
            itemsStore.handleData(results.data.menuCategories);
            itemsFilterStore.menuItemsOG = itemsStore.menuItems;
        }
    }

    // load order data for client
    if (!ordersStore.dataIsLoaded && process.client) {
        ordersStore.dataIsLoaded = true;
        const storedOrders: any = JSON.parse(localStorage.getItem(`orders`) || `{}`);
        ordersStore.orderItems = new Map(storedOrders[to.params.brand_username.toString()] || []);
        for (const [k, v] of ordersStore.orderItems.entries()) {
            ordersStore.orderItems.set(k, { ...v, sideItems: new Set(v.sideItems || []) });
        }
    }

    // check if locale is one of brand languages... if not then set the locale the first item of brand's languages
    if (!infoStore.restaurantInfo.brand?.languages.includes(locale.value)) {
        const defaultBrandLocale = infoStore.restaurantInfo.brand?.languages[0] || defaultLocale;
        setLocale(defaultBrandLocale);
        setLocaleCookie(defaultBrandLocale);
    }
});

const getData = async (h3Event: H3Event | null, brandId: string): Promise<{ data: any; pending: boolean }> => {
    let headers: any = {};
    let url = `/api/v1/menu-info`;
    if (process.server && h3Event) {
        headers = getHeaders(h3Event);
        delete headers["content-length"];
        delete headers["host"];
        url = `${process.env.API_BASE_URL}${url}`.replace("/api/v1/", "/");
        headers.serversecret = process.env.SERVER_SECRET;
        headers.tt = Date.now();

        let data = {};
        await axios
            .get(url, { headers: { ...headers, brand: brandId, serversecret: process.env.SERVER_SECRET, tt: Date.now() } })
            .then((response) => (data = response.data))
            .catch((err) => {
                throw err;
            });
        return { data, pending: false };
    } else {
        const { data, error, pending } = await useFetch(url, { lazy: process.client, headers: { ...headers, brand: brandId } });
        if (error.value) throw error.value;

        return { data: data.value, pending: pending.value };
    }
};
