import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { useItemsStore } from "@/stores/items";

export default defineNuxtRouteMiddleware(async (to, from) => {
    const stylesStore = useStylesStore();
    if (!stylesStore.dataIsLoaded) {
        await stylesStore.getMenuStyles(to.params.brand_id.toString()).catch((err) => {
            if (process.server) console.error({ err });
        });
    }

    const infoStore = useInfoStore();
    if (!infoStore.dataIsLoaded) {
        await infoStore.getRestaurantInfo(to.params.brand_id.toString()).catch((err) => {
            if (process.server) console.error({ err });
        });
    }

    const itemsStore = useItemsStore();
    if (!itemsStore.dataIsLoaded) {
        await itemsStore.getMenuItems(to.params.brand_id.toString()).catch((err) => {
            if (process.server) console.error({ err });
        });
    }

    // check if locale is one of brand languages... if not then set the locale the first item of brand's languages
    const nuxtApp = useNuxtApp();
    const { locale, setLocale, setLocaleCookie, defaultLocale } = nuxtApp.$i18n;
    if (!infoStore.restaurantInfo.brand?.languages.includes(locale.value)) {
        const defaultBrandLocale = infoStore.restaurantInfo.brand?.languages[0] || defaultLocale;
        setLocale(defaultBrandLocale);
        setLocaleCookie(defaultBrandLocale);
    }
});
