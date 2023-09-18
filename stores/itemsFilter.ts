import { defineStore, storeToRefs } from "pinia";
import { useItemsStore, MenuItemsInterface } from "@/stores/items";

export const useItemsFilterStore = defineStore("itemsFilter", () => {
    const nuxtApp = useNuxtApp();
    const itemsStore = useItemsStore();
    const { menuItems } = storeToRefs(itemsStore);

    let branchFilteredItems: MenuItemsInterface[] = [];
    const menuItemsOG: Ref<MenuItemsInterface[]> = ref([]);
    const searchQuery: Ref<String> = ref("");
    const selectedBranch: Ref<{
        _id?: String;
        name?: String;
        address?: String;
        telephoneNumbers?: String[];
        gallery?: String[];
        translation?: any;
    }> = ref({});

    const filteredBySearch: Ref<Boolean> = ref(false);
    const filteredByBranch: Ref<Boolean> = ref(false);

    const clearFiltering = () => {
        searchQuery.value = "";
        selectedBranch.value = {};
        filter();
    };
    const clearSearch = () => {
        if (!filteredBySearch.value) return;

        for (let i = 0; i < branchFilteredItems.length; i++) menuItems.value[i].items = branchFilteredItems[i].items.filter(() => true);
        filteredBySearch.value = false;
        searchQuery.value = "";
    };

    const filter = () => {
        branchFilteredItems = _branchFilter();

        if (searchQuery.value) _searchFilter();
        else clearSearch();
    };

    const _searchFilter = () => {
        const locale = nuxtApp.$i18n.locale;

        for (let i = 0; i < branchFilteredItems.length; i++) {
            menuItems.value[i].items = branchFilteredItems[i].items.filter((item) => {
                const name = (item.translation?.[locale.value]?.name || item.name || "").toLowerCase();
                const description = (item.translation?.[locale.value]?.description || item.description || "").toLowerCase();
                return name.includes(searchQuery.value.toLowerCase()) || description.includes(searchQuery.value.toLowerCase());
            });
        }
        filteredBySearch.value = true;
    };

    const _branchFilter = (): MenuItemsInterface[] => {
        const branchId = selectedBranch.value._id?.toString() || "";
        const og = structuredClone(toRaw(menuItemsOG.value));

        const newMenuItems = og.filter((category) => {
            return category.branches.length == 0 || category.branches.includes(branchId);
        });
        for (let i = 0; i < newMenuItems.length; i++) {
            newMenuItems[i].items = newMenuItems[i].items.filter((item) => {
                return item.branches.length == 0 || item.branches.includes(branchId);
            });
        }

        itemsStore.menuItems = newMenuItems;
        return structuredClone(newMenuItems);
    };

    return {
        menuItemsOG,
        searchQuery,
        selectedBranch,
        filteredBySearch,
        filteredByBranch,
        clearFiltering,
        clearSearch,
        filter,
    };
});
