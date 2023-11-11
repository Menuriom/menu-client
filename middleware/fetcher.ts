import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { useItemsStore } from "@/stores/items";
import { useItemsFilterStore } from "@/stores/itemsFilter";
import { useOrdersStore } from "@/stores/orders";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const stylesStore = useStylesStore();
    const infoStore = useInfoStore();
    const itemsStore = useItemsStore();
    const itemsFilterStore = useItemsFilterStore();
    const ordersStore = useOrdersStore();
    const nuxtApp = useNuxtApp();
    const { locale, setLocale, setLocaleCookie, defaultLocale } = nuxtApp.$i18n;

    let getStyles = false,
        getInfo = false,
        getItems = false;

    if (!stylesStore.dataIsLoaded) getStyles = true;
    if (!infoStore.dataIsLoaded) getInfo = true;
    if (!itemsStore.dataIsLoaded) getItems = true;

    const promiseResults = await Promise.allSettled([
        getStyles ? stylesStore.getMenuStyles(to.params.brand_username.toString()) : null,
        getInfo ? infoStore.getRestaurantInfo(to.params.brand_username.toString()) : null,
        getItems ? itemsStore.getMenuItems(to.params.brand_username.toString()) : null,
    ]);

    if (promiseResults[1].status == "fulfilled") itemsFilterStore.selectedBranch = infoStore.restaurantInfo?.branches?.[0] || {};
    else if (process.server) console.error({ err: promiseResults[1].reason });

    if (promiseResults[2].status == "fulfilled") itemsFilterStore.menuItemsOG = itemsStore.menuItems;
    else if (process.server) console.error({ err: promiseResults[2].reason });

    // ----

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
