import { defineStore } from "pinia";

export interface MenuCategoryInterface {
    branches: String[];
    icon: String;
    name: String;
    description: String;
    order: Number;
    showAsNew: Boolean;
    translation: Object;
    items: FoodItemInterface[];
}

export interface FoodItemInterface {
    _id: String;
    branches: String[];
    category: String;
    order: Number;
    images: String[];
    name: String;
    description: String;
    price: number;
    discountPercentage: number;
    discountActive: Boolean;
    variants: PojoItemInterface[];
    hidden: Boolean;
    pinned: Boolean;
    soldOut: Boolean;
    showAsNew: Boolean;
    specialDaysList: String[];
    specialDaysActive: Boolean;
    tags: String[];
    sideItems: SideItemInterface[];
    likes: Number;
    translation: any;
}

export interface SideItemInterface {
    name: String;
    description: String;
    items: PojoItemInterface[];
    maxNumberUserCanChoose: Number;
    translation: Object;
}

export interface PojoItemInterface {
    name: String;
    price: number;
    translation: Object;
}

export const useItemsStore = defineStore("items", () => {
    const dataIsLoaded: Ref<Boolean> = ref(false);
    const loading: Ref<Boolean> = ref(false);
    const menuItems: Ref<MenuCategoryInterface[]> = ref([]);

    const resetInfo = () => {
        menuItems.value = [];
    };

    const getMenuItems = async (brandId: string) => {
        if (loading.value) return;
        loading.value = true;

        const { data, error, pending } = await useFetch("/api/v1/getMenuItems", { lazy: process.client, headers: { brand: brandId } });

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
        menuItems.value = data;
        dataIsLoaded.value = true;
    };

    return {
        menuItems,
        dataIsLoaded,
        loading,
        handleData,
        resetInfo,
        getMenuItems,
    };
});
