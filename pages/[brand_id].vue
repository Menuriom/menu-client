<style scoped>
.bg-pattern {
    mask: linear-gradient(0deg, #000f 0%, #0000 100%);
}
</style>

<template>
    <div
        class="flex items-center justify-center w-screen isolate"
        :style="`background-color: ${styles.baseColors?.bgMainColor}; color: ${styles.baseColors?.textColor};`"
    >
        <div
            class="bg-pattern absolute bottom-0 flex items-center justify-center w-full -z-10 overflow-hidden"
            :style="`height: 65%; background-color: ${styles.baseColors?.bgMainColor};`"
        >
            <div
                class="absolute w-[120%] h-full aspect-square bg-repeat"
                :style="`background-image: url('${styles.mainMenuStyleOptions?.itemListOptions?.bgImage}'); background-size: clamp(50px, ${styles.mainMenuStyleOptions?.itemListOptions?.bgImageSize}%, 360px); background-color: ${styles.baseColors?.bgMainColor}; opacity: ${styles.mainMenuStyleOptions?.itemListOptions?.bgImageOpacity}%; rotate: ${styles.mainMenuStyleOptions?.itemListOptions?.bgImageRotation}deg;`"
                v-if="styles.mainMenuStyleOptions?.itemListOptions?.withPattern"
            ></div>
        </div>

        <section class="flex flex-col gap-2 items-center w-full max-w-screen-lg overflow-clip" :title="restaurantInfo.brand?.name" id="list">
            <component
                name="header"
                :is="headers[styles.mainMenuStyleOptions?.headerOptions?.component]"
                :restaurantInfo="restaurantInfo"
                :options="styles.mainMenuStyleOptions?.headerOptions"
            />
            <!-- TODO : we can add restaurant details here -->
            <!-- TODO : add a section title "our picks/suggestions" and list pinned items here and rename "pin item" as "mark as suggestions" -->
            <component
                name="search"
                class="z-2"
                :is="searches[styles.mainMenuStyleOptions?.searchOptions?.component]"
                :restaurantInfo="restaurantInfo"
                :baseColors="styles.baseColors"
                :options="styles.mainMenuStyleOptions?.searchOptions"
            />
            <component
                name="categories"
                class="z-2"
                :class="[styles.mainMenuStyleOptions?.searchOptions?.active ? 'top-14' : 'top-0']"
                :is="categories[styles.mainMenuStyleOptions?.categoriesOptions?.component]"
                :baseColors="styles.baseColors"
                :options="styles.mainMenuStyleOptions?.categoriesOptions"
            />
            <section
                class="flex flex-col gap-4 w-full p-2"
                :class="[styles.mainMenuStyleOptions?.categoriesOptions?.orientation === 'col' ? 'scroll-mt-36' : 'scroll-mt-28']"
                v-for="(itemGroup, i) in menuItems"
                title="menu-item"
                :id="itemGroup.name"
                :number="i"
            >
                <component
                    name="itemHeaders"
                    :is="itemHeaders[styles.mainMenuStyleOptions?.itemHeaderOptions?.component]"
                    :options="styles.mainMenuStyleOptions?.itemHeaderOptions"
                    :category="itemGroup"
                />
                <component
                    name="itemList"
                    :is="itemLists[styles.mainMenuStyleOptions?.itemListOptions?.component]"
                    :restaurantInfo="restaurantInfo"
                    :options="styles.mainMenuStyleOptions?.itemListOptions"
                    :items="itemGroup.items"
                />
            </section>
            <component
                name="navbar"
                :is="navbars[styles.mainMenuStyleOptions?.navbarOptions?.component]"
                :options="styles.mainMenuStyleOptions?.navbarOptions"
            />
        </section>

        <NuxtPage></NuxtPage>
    </div>
</template>

<script setup>
import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { useItemsStore } from "@/stores/items";
import { storeToRefs } from "pinia";

useHead({ title: `menu title here` }); // TODO : change this
definePageMeta({ middleware: ["fetcher"] });

const headers = {
    Header1: defineAsyncComponent(() => import("@/components/menu/Header1.vue")),
    Header2: defineAsyncComponent(() => import("@/components/menu/Header2.vue")),
};
const searches = {
    Search1: defineAsyncComponent(() => import("@/components/menu/Search1.vue")),
};
const categories = {
    Categories1: defineAsyncComponent(() => import("@/components/menu/Categories1.vue")),
};
const itemHeaders = {
    ItemHeader1: defineAsyncComponent(() => import("@/components/menu/ItemHeader1.vue")),
    ItemHeader2: defineAsyncComponent(() => import("@/components/menu/ItemHeader2.vue")),
};
const itemLists = {
    ItemList1: defineAsyncComponent(() => import("@/components/menu/ItemList1.vue")),
    ItemList2: defineAsyncComponent(() => import("@/components/menu/ItemList2.vue")),
    ItemList3: defineAsyncComponent(() => import("@/components/menu/ItemList3.vue")),
};
const navbars = {
    Navbar1: defineAsyncComponent(() => import("@/components/menu/Navbar1.vue")),
    Navbar2: defineAsyncComponent(() => import("@/components/menu/Navbar2.vue")),
    Navbar3: defineAsyncComponent(() => import("@/components/menu/Navbar3.vue")),
};

const route = useRoute();
const router = useRouter();

const stylesStore = useStylesStore();
const { styles } = storeToRefs(stylesStore);

const infoStore = useInfoStore();
const { restaurantInfo } = storeToRefs(infoStore);

const itemsStore = useItemsStore();
const { menuItems } = storeToRefs(itemsStore);

const _initialCategorySelector = (queryC) => {
    if (queryC && !isNaN(queryC)) {
        const item = document.querySelector(`section[title='menu-item'][number='${queryC}']`);
        if (!item) return;
        item.scrollIntoView({ behavior: "smooth", block: "start" });
        router.replace({ query: null });
    }
};

onMounted(() => {
    _initialCategorySelector(route.query.c);
});
onBeforeRouteUpdate((to, from, next) => {
    _initialCategorySelector(to.query.c);
    next();
});
</script>
