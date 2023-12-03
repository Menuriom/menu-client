<style scoped>
.text-pass-rtl {
    animation: text-pass-rtl 3s infinite ease-in-out alternate;
}
.text-pass-ltr {
    animation: text-pass-ltr 3s infinite ease-in-out alternate;
}
</style>

<template>
    <DrawerDialog :baseColors="styles.baseColors" :options="styles.itemsDialogStyleOptions" :actionLock="actionLock">
        <div class="flex flex-col items-center gap-2 p-2 pt-6 w-full" :style="`color: ${styles.itemsDialogStyleOptions.textColor}`">
            <h1 class="font-bold">{{ $t("All Categories") }}</h1>
            <ul
                class="grid items-start gap-4 w-full p-4 pt-2 overflow-auto select-none"
                style="grid-template-columns: repeat(auto-fill, minmax(81px, 1fr)); max-height: calc(100vh - 14rem)"
                @scroll="scrolling($event)"
            >
                <li
                    class="flex flex-col items-center justify-center gap-2 p-2 border border-neutral-500 border-opacity-10 cursor-pointer overflow-hidden shadow-nr10"
                    :style="`background-color: ${styles.mainMenuStyleOptions?.categoriesOptions?.bgMainColor}; border-radius: ${styles.mainMenuStyleOptions?.categoriesOptions?.cornerRadius}px;`"
                    v-for="(category, i) in menuItems"
                    @click="selectOption(category, i)"
                >
                    <span
                        class="flex items-center justify-center w-11 h-11 p-1 rounded-full shrink-0"
                        :style="`background-color: ${styles.mainMenuStyleOptions?.categoriesOptions?.bgSecondaryColor}; border-radius: ${styles.mainMenuStyleOptions?.categoriesOptions?.cornerRadius}px;`"
                        v-if="styles.mainMenuStyleOptions?.categoriesOptions?.withIcon"
                    >
                        <img class="w-full aspect-square object-contain" :src="category.icon" />
                    </span>
                    <h3
                        class="rounded-full text-xs/none text-center whitespace-nowrap"
                        :class="{ [`text-pass-${localeProperties.dir}`]: shouldUseTextPass(category.translation?.[locale]?.name || category.name) }"
                        :style="`color: ${styles.mainMenuStyleOptions?.categoriesOptions?.textColor};`"
                    >
                        {{ category.translation?.[locale]?.name || category.name }}
                    </h3>
                </li>
            </ul>
        </div>
    </DrawerDialog>
</template>

<script setup>
import DrawerDialog from "@/components/DrawerDialog.vue";
import { useStylesStore } from "@/stores/styles";
import { useItemsStore } from "@/stores/items";
import { storeToRefs } from "pinia";

useHead({ title: `All Categories` });

const stylesStore = useStylesStore();
const { styles } = storeToRefs(stylesStore);

const itemStore = useItemsStore();
const { menuItems } = storeToRefs(itemStore);

const { locale, localeProperties } = useI18n();
const route = useRoute();
const router = useRouter();

const shouldUseTextPass = (text) => {
    return styles.mainMenuStyleOptions?.categoriesOptions?.withIcon && text.length > 9 && styles.mainMenuStyleOptions?.categoriesOptions?.orientation === "col";
};

const selectOption = (category, index) => {
    router.push(`/${route.params.brand_username}?c=${index}`);
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
