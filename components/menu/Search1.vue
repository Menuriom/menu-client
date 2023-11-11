<template>
    <div class="sticky top-0 flex items-center gap-2 w-full p-2" :style="`background-color: ${baseColors.bgMainColor};`" v-if="options.active">
        <nuxt-link
            class="flex items-center justify-center p-2.5 border border-neutral-500 border-opacity-20 rounded-lg shadow-mr25"
            title="Show All Categories"
            :style="`background-color: ${options.bgMainColor};`"
            :to="localePath(`/${route.params.brand_username}/categories`)"
        >
            <Icon class="w-5 h-5 shrink-0" :style="`background-color: ${options.textColor};`" name="layout-2.svg" folder="icons/tabler" size="20px" />
        </nuxt-link>
        <form
            class="flex items-center gap-1 w-full p-2.5 rounded-lg"
            :style="`background-color: ${options.bgSecondaryColor};`"
            @submit.prevent="search()"
        >
            <button class="p-0.5">
                <Icon class="w-5 h-5 shrink-0" :style="`background-color: ${options.textColor};`" name="search.svg" folder="icons/tabler" size="20px" />
            </button>
            <input
                class="w-full p-0.5 text-sm outline-none"
                :style="`background-color: ${options.bgSecondaryColor}; color: ${options.textColor};`"
                :placeholder="$t('Search')"
                v-model="searchQuery"
                inputmode="search"
            />
            <button class="flex items-center justify-center p-1 rounded-lg bg-white bg-opacity-20" type="button" @click="clear()" v-if="searchQuery">
                <Icon class="w-4 h-4 rotate-45" :style="`background-color: ${options.textColor};`" name="plus.svg" folder="icons/tabler" size="16px" />
            </button>
        </form>
    </div>
</template>

<script setup>
import { useItemsFilterStore } from "@/stores/itemsFilter";

const props = defineProps({
    restaurantInfo: { type: Object },
    baseColors: { type: Object },
    options: { type: Object },
});

const emit = defineEmits(["filter:items"]);

const route = useRoute();
const localePath = useLocalePath();
const itemsFilterStore = useItemsFilterStore();

const searchQuery = ref("");

const search = () => {
    itemsFilterStore.searchQuery = searchQuery.value;
    itemsFilterStore.filter();
};
const clear = () => {
    itemsFilterStore.searchQuery = searchQuery.value = "";
    itemsFilterStore.filter();
};
</script>
