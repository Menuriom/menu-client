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
// definePageMeta({ middleware: ["fetcher"] });

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
    const getMenuItem = await useFetch(`/api/v1/menu-info/menu-item/${route.query.i}`, { headers: { brand: route.params.brand_id }, immediate: true });
    if (getMenuItem.error.value) console.error(getMenuItem.error.value);
    if (getMenuItem.data.value) item.value = getMenuItem.data.value;
}

const actionLock = ref(false);
let actionLockTimeout;
const updateActionLock = (lck) => {
    actionLock.value = lck;
    clearTimeout(actionLockTimeout);
    actionLockTimeout = setTimeout(() => (actionLock.value = false), 800);
};
</script>
