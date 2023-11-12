<style scoped></style>

<template>
    <component
        :is="frames[styles.itemsDialogStyleOptions?.frameComponent]"
        :baseColors="styles.baseColors"
        :options="styles.itemsDialogStyleOptions"
        :actionLock="actionLock"
    >
        <component
            :is="bodies[styles.itemsDialogStyleOptions?.bodyComponent]"
            :options="styles.itemsDialogStyleOptions"
            :item="item"
            v-model:liked="liked"
            :restaurantInfo="restaurantInfo"
            @innerAction="updateActionLock($event)"
        />
    </component>
</template>

<script setup>
import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { useItemsStore } from "@/stores/items";
import { storeToRefs } from "pinia";

useHead({ title: `menu title here` }); // TODO : change this

// TODO : items add button should have branch check on it - and only can be added if user is on that branch

const route = useRoute();

const frames = {
    Frame1: defineAsyncComponent(() => import("@/components/FloatDialog.vue")),
    Frame2: defineAsyncComponent(() => import("@/components/DrawerDialog.vue")),
};
const bodies = {
    Body1: defineAsyncComponent(() => import("@/components/menu/item-details/Body1.vue")),
    Body2: defineAsyncComponent(() => import("@/components/menu/item-details/Body2.vue")),
};

const stylesStore = useStylesStore();
const { styles } = storeToRefs(stylesStore);

const infoStore = useInfoStore();
const { restaurantInfo } = storeToRefs(infoStore);

const itemsStore = useItemsStore();
const { menuItems } = storeToRefs(itemsStore);

const item = ref();
if (process.client && !item.value) {
    try {
        item.value = JSON.parse(localStorage.getItem("item"));
    } catch {}
}
if (!item.value) {
    const getMenuItem = await useFetch(`/api/v1/menu-info/menu-item/${route.query.i}`, {
        headers: { brand: route.params.brand_username },
        lazy: process.client,
        immediate: true,
    });
    if (getMenuItem.error.value) console.error(getMenuItem.error.value);
    if (getMenuItem.data.value) item.value = getMenuItem.data.value;
}

// send a request to check if this user is like this item or not ------------------
const handleError_getLikeResults = (err) => {
    if (!err) return;
    if (process.server) console.log(err);
};
const handleData_getLikeResults = (data) => {
    if (!data) return;
    liked.value = data.liked;
};
const liked = ref(false);
const getLikeResults = await useFetch(`/api/v1/menu/like/${route.query.i}`, { lazy: process.client });
handleError_getLikeResults(getLikeResults.error.value);
handleData_getLikeResults(getLikeResults.data.value);
watch(getLikeResults.data, (data) => handleData_getLikeResults(data));
// ---------------------------------------------

const actionLock = ref(false);
let actionLockTimeout;
const updateActionLock = (lck) => {
    actionLock.value = lck;
    clearTimeout(actionLockTimeout);
    actionLockTimeout = setTimeout(() => (actionLock.value = false), 800);
};
</script>
