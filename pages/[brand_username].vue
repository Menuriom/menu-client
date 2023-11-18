<style scoped>
.bg-pattern {
    mask: linear-gradient(0deg, #000f 0%, #0000 100%);
}

.main {
    min-height: 100vh;
    min-height: 100dvh;
}
</style>

<template>
    <div
        class="relative flex items-center justify-center w-screen isolate"
        :style="`background-color: ${styles.baseColors?.bgMainColor}; color: ${styles.baseColors?.textColor};`"
    >
        <SplashScreen
            class="z-50"
            :showSplashScreen="showSplashScreen"
            :doTheAnimation="doTheAnimation"
            :options="styles.splashScreenOptions"
            :brand="restaurantInfo.brand"
        />

        <div
            class="bg-pattern absolute bottom-0 flex items-center justify-center w-full -z-10 overflow-hidden"
            :style="`height: 75%; background-color: ${styles.baseColors?.bgMainColor};`"
        >
            <div
                class="absolute w-[120%] h-full aspect-square bg-repeat"
                :style="`background-image: url('${styles.mainMenuStyleOptions?.itemListOptions?.bgImage}'); background-size: clamp(50px, ${styles.mainMenuStyleOptions?.itemListOptions?.bgImageSize}%, 360px); background-color: ${styles.baseColors?.bgMainColor}; opacity: ${styles.mainMenuStyleOptions?.itemListOptions?.bgImageOpacity}%; rotate: ${styles.mainMenuStyleOptions?.itemListOptions?.bgImageRotation}deg;`"
                v-if="styles.mainMenuStyleOptions?.itemListOptions?.withPattern"
            ></div>
        </div>

        <section class="main flex flex-col gap-2 items-center w-full max-w-screen-lg overflow-clip" :title="restaurantInfo.brand?.name" id="list">
            <component
                name="header"
                :is="headers[styles.mainMenuStyleOptions?.headerOptions?.component]"
                :restaurantInfo="restaurantInfo"
                :options="styles.mainMenuStyleOptions?.headerOptions"
            />
            <!-- TODO : we can add restaurant details here -->
            <component
                name="suggestions"
                class="-mb-4"
                :is="suggestions[styles.mainMenuStyleOptions?.suggestionsOptions?.component]"
                :restaurantInfo="restaurantInfo"
                :baseColors="styles.baseColors"
                :options="styles.mainMenuStyleOptions?.suggestionsOptions"
            />
            <component
                name="search"
                class="z-2 mt-4"
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
                class="mb-4 mt-auto"
                :is="navbars[styles.mainMenuStyleOptions?.navbarOptions?.component]"
                :restaurantInfo="restaurantInfo"
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
import { useItemsFilterStore } from "@/stores/itemsFilter";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();
const stylesStore = useStylesStore();
const infoStore = useInfoStore();
const itemsStore = useItemsStore();
const itemsFilterStore = useItemsFilterStore();

useHead({ title: `${infoStore.restaurantInfo?.brand?.name}` }); // TODO : change this
definePageMeta({ middleware: ["fetcher"] });

// TODO : add limitation of the brand into the menu
// TODO : add user like and comment functinality
// TODO : any user must get a id as cookie when they open any menu... so that we know who they are

const headers = {
    Header1: defineAsyncComponent(() => import("@/components/menu/Header1.vue")),
    Header2: defineAsyncComponent(() => import("@/components/menu/Header2.vue")),
};
const suggestions = {
    Suggestions1: defineAsyncComponent(() => import("@/components/menu/Suggestions1.vue")),
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

const { styles } = storeToRefs(stylesStore);
const { restaurantInfo } = storeToRefs(infoStore);
const { menuItems } = storeToRefs(itemsStore);

itemsFilterStore.filter();

const _initialCategorySelector = (queryC) => {
    if (queryC && !isNaN(queryC)) {
        const item = document.querySelector(`section[title='menu-item'][number='${queryC}']`);
        if (!item) return;
        item.scrollIntoView({ behavior: "smooth", block: "start" });
        router.replace({ query: null });
    }
};

const showSplashScreen = ref(true);
const doTheAnimation = ref(false);

onMounted(() => {
    _initialCategorySelector(route.query.c);

    setTimeout(() => (doTheAnimation.value = true), 100);
    setTimeout(() => (showSplashScreen.value = false), 2100);
});
onBeforeRouteUpdate((to, from, next) => {
    _initialCategorySelector(to.query.c);
    next();
});
</script>
