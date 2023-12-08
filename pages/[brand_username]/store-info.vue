<style scoped></style>

<template>
    <component
        :is="frames[styles.restaurantDetailsPageOptions?.frameComponent]"
        :baseColors="styles.baseColors"
        :options="styles.restaurantDetailsPageOptions"
        :actionLock="actionLock"
        :withX="styles.restaurantDetailsPageOptions?.frameComponent == 'Frame3'"
    >
        <Head>
            <Title>
                {{ restaurantInfo.brand?.translation?.[locale]?.name || restaurantInfo.brand?.name }} |
                {{ restaurantInfo.brand?.translation?.[locale]?.slogan || restaurantInfo.brand?.slogan }}
            </Title>
        </Head>
        <component
            :is="bodies[styles.restaurantDetailsPageOptions?.bodyComponent]"
            :options="styles.restaurantDetailsPageOptions"
            :restaurantInfo="restaurantInfo"
            @innerAction="updateActionLock($event)"
        />
    </component>
</template>

<script setup>
import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { storeToRefs } from "pinia";

const { locale } = useI18n();

const frames = {
    Frame1: defineAsyncComponent(() => import("@/components/FloatDialog.vue")),
    Frame2: defineAsyncComponent(() => import("@/components/DrawerDialog.vue")),
    Frame3: defineAsyncComponent(() => import("@/components/DrawerDialog.vue")),
};
const bodies = {
    Body1: defineAsyncComponent(() => import("@/components/menu/store-info/Body1.vue")),
};

const stylesStore = useStylesStore();
const { styles } = storeToRefs(stylesStore);

const infoStore = useInfoStore();
const { restaurantInfo } = storeToRefs(infoStore);

const actionLock = ref(false);
let actionLockTimeout;
const updateActionLock = (lck) => {
    actionLock.value = lck;
    clearTimeout(actionLockTimeout);
    actionLockTimeout = setTimeout(() => (actionLock.value = false), 800);
};
</script>
