import { defineStore } from "pinia";

export interface MenuItemsInterface {
    branches: String[];
    icon: String;
    name: String;
    description: String;
    order: Number;
    showAsNew: Boolean;
    translation: Object;
    items: {
        branches: String[];
        category: String;
        order: Number;
        images: String[];
        name: String;
        description: String;
        price: Number;
        discountPercentage: Number;
        discountActive: Boolean;
        variants: { name: String; price: Number; translation: Object }[];
        hidden: Boolean;
        pinned: Boolean;
        soldOut: Boolean;
        showAsNew: Boolean;
        specialDaysList: String[];
        specialDaysActive: Boolean;
        tags: String[];
        sideItems: {
            name: String;
            description: String;
            items: { name: String; price: Number; translation: Object }[];
            maxNumberUserCanChoose: Number;
            translation: Object;
        }[];
        likes: Number;
        translation: any;
    }[];
}

export const useItemsStore = defineStore("items", () => {
    const dataIsLoaded: Ref<Boolean> = ref(false);
    const loading: Ref<Boolean> = ref(false);
    const menuItems: Ref<MenuItemsInterface[]> = ref([]);

    const resetInfo = () => {
        menuItems.value = [];
    };

    const getMenuItems = async (brandId: string) => {
        if (loading.value) return;
        loading.value = true;

        const { data, error, pending } = await useFetch("/api/v1/getMenuItems", { lazy: process.client, headers: { brand: brandId } });

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
        menuItems.value = data;
        dataIsLoaded.value = true;
    };

    return {
        menuItems,
        dataIsLoaded,
        loading,
        resetInfo,
        getMenuItems,
    };
});
