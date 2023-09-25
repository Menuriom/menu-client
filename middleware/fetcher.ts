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

    if (!stylesStore.dataIsLoaded) {
        await stylesStore.getMenuStyles(to.params.brand_id.toString()).catch((err) => {
            if (process.server) console.error({ err });
        });
    }

    if (!infoStore.dataIsLoaded) {
        await infoStore.getRestaurantInfo(to.params.brand_id.toString()).catch((err) => {
            if (process.server) console.error({ err });
        });
        itemsFilterStore.selectedBranch = infoStore.restaurantInfo?.branches?.[0] || {};
    }

    if (!itemsStore.dataIsLoaded) {
        await itemsStore.getMenuItems(to.params.brand_id.toString()).catch((err) => {
            if (process.server) console.error({ err });
        });
        itemsFilterStore.menuItemsOG = itemsStore.menuItems;
    }

    if (!ordersStore.dataIsLoaded && process.client) {
        ordersStore.dataIsLoaded = true;
        const storedOrders: any = JSON.parse(localStorage.getItem(`orders`) || `{}`);
        ordersStore.orderItems = new Map(storedOrders[to.params.brand_id.toString()] || []);
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
