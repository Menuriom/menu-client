<style scoped></style>

<template>
    <DrawerDialog :baseColors="styles.baseColors" :options="styles.itemsDialogStyleOptions" :actionLock="actionLock">
        <div class="flex flex-col items-center gap-2 p-2 pt-6 w-full" :style="`color: ${styles.itemsDialogStyleOptions.textColor}`">
            <h1 class="font-bold">{{ $t("Select a different branch") }}</h1>
            <ul class="flex flex-col gap-4 w-full p-4 pt-2 overflow-auto select-none" style="max-height: calc(100vh - 14rem)" @scroll="scrolling($event)">
                <li
                    class="flex items-center gap-4 w-full p-3 md:p-4 border border-neutral-500 border-opacity-10 cursor-pointer shadow-mr25"
                    :style="`background-color: ${
                        itemsFilterStore.selectedBranch._id == branch._id
                            ? styles.mainMenuStyleOptions?.categoriesOptions?.primaryColor
                            : styles.mainMenuStyleOptions?.categoriesOptions?.bgMainColor
                    };
                    border-radius: ${styles.mainMenuStyleOptions?.categoriesOptions?.cornerRadius}px;`"
                    v-for="(branch, i) in restaurantInfo.branches"
                    @click="selectOption(branch, i)"
                >
                    <span
                        class="flex items-center justify-center w-20 h-20 border border-neutral-500 border-opacity-25 shrink-0"
                        :style="`background-color: ${styles.mainMenuStyleOptions?.categoriesOptions?.bgMainColor};
                        border-radius: ${styles.mainMenuStyleOptions?.categoriesOptions?.cornerRadius - 4}px;`"
                    >
                        <img
                            class="w-full aspect-square object-cover"
                            :src="branch.gallery[0]"
                            :style="`background-color: ${styles.mainMenuStyleOptions?.categoriesOptions?.bgMainColor};
                            border-radius: ${styles.mainMenuStyleOptions?.categoriesOptions?.cornerRadius - 8}px;`"
                            v-if="branch.gallery[0]"
                        />
                        <Icon class="w-10 h-10 bg-red-400 opacity-80" name="map-pin-filled.svg" folder="icons/tabler" size="40px" v-else />
                    </span>
                    <div class="flex flex-col gap-1.5">
                        <h2 class="rounded-full text-base/none font-bold" :style="`color: ${styles.mainMenuStyleOptions?.categoriesOptions?.textColor};`">
                            {{ branch.translation?.[locale]?.name || branch.name }}
                        </h2>
                        <p class="text-xs opacity-75">{{ branch.translation?.[locale]?.address || branch.address }}</p>
                    </div>
                </li>
            </ul>
        </div>
    </DrawerDialog>
</template>

<script setup>
import DrawerDialog from "@/components/DrawerDialog.vue";
import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { useItemsFilterStore } from "@/stores/itemsFilter";
import { storeToRefs } from "pinia";

useHead({ title: `All Branches` }); // TODO : change this

const stylesStore = useStylesStore();
const infoStore = useInfoStore();
const itemsFilterStore = useItemsFilterStore();

const { styles } = storeToRefs(stylesStore);
const { restaurantInfo } = storeToRefs(infoStore);

const { locale } = useI18n();
const router = useRouter();

const selectOption = (branch, index) => {
    itemsFilterStore.selectedBranch = branch;
    itemsFilterStore.filter();
    setTimeout(() => router.back(), 200);
};

const actionLock = ref(false);
let actionLockTimeout;
const updateActionLock = (lck) => {
    actionLock.value = lck;
    clearTimeout(actionLockTimeout);
    actionLockTimeout = setTimeout(() => (actionLock.value = false), 800);
};
const scrolling = (e) => {
    if (e.target.scrollTop < 5) updateActionLock(false);
    else updateActionLock(true);
};
</script>
