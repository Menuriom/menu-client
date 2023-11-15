import { defineStore } from "pinia";

export const useStylesStore = defineStore("styles", () => {
    const dataIsLoaded: Ref<Boolean> = ref(false);
    const loading: Ref<Boolean> = ref(false);
    const styles: Ref<{
        baseColors?: any;
        mainMenuStyleOptions?: any;
        itemsDialogStyleOptions?: any;
        restaurantDetailsPageOptions?: any;
        splashScreenOptions?: any;
    }> = ref({});

    const resetInfo = () => {
        styles.value = {};
    };

    const getMenuStyles = async (brandId: string) => {
        if (loading.value) return;
        loading.value = true;

        const { data, error, pending } = await useFetch("/api/v1/getMenuStyles", { lazy: process.client, headers: { brand: brandId } });

        if (pending.value !== null && pending.value !== undefined) loading.value = pending.value;
        watch(pending, (pend) => (loading.value = pend));

        if (error.value) throw error.value;
        watch(error, (err) => {
            if (!err) return;
            throw err;
        });

        handleData(data.value);
        watch(data, (data) => handleData(data));
    };

    const handleData = (data: any) => {
        if (!data) return;
        styles.value = data.menuStyles;
        dataIsLoaded.value = true;
    };

    return {
        styles,
        dataIsLoaded,
        loading,
        handleData,
        resetInfo,
        getMenuStyles,
    };
});
