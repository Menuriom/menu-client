import { defineStore } from "pinia";

export const useInfoStore = defineStore("info", () => {
    const dataIsLoaded: Ref<Boolean> = ref(false);
    const loading: Ref<Boolean> = ref(false);
    const restaurantInfo: Ref<{
        brand?: {
            logo: String;
            username: String;
            name: String;
            slogan: String;
            socials: {
                instagram?: String;
                twitter?: String;
                telegram?: String;
                whatsapp?: String;
            };
            languages: String[];
            currency: String;
            translation: any;
        };
        branches?: {
            name: String;
            address: String;
            telephoneNumbers: String[];
            gallery: String[];
            translation: any;
        }[];
    }> = ref({});

    const resetInfo = () => {
        restaurantInfo.value = {};
    };

    const getRestaurantInfo = async (brandId: string) => {
        if (loading.value) return;
        loading.value = true;

        const { data, error, pending } = await useFetch("/api/v1/getRestaurantInfo", { lazy: process.client, headers: { brand: brandId } });

        if (error.value) throw error.value;
        watch(error, (err) => {
            if (!err) return;
            throw err;
        });

        handleData(data.value);
        watch(data, (data) => handleData(data));

        watch(pending, (pend) => (loading.value = pend));
    };

    const handleData = (data: any) => {
        if (!data) return;
        restaurantInfo.value = data;
        dataIsLoaded.value = true;
    };

    return {
        restaurantInfo,
        dataIsLoaded,
        loading,
        resetInfo,
        getRestaurantInfo,
    };
});
