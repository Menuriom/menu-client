<style scoped></style>

<template>
    <DrawerDialog :baseColors="styles.baseColors" :options="styles.itemsDialogStyleOptions">
        <div class="flex flex-col gap-4 p-6" :style="`color: ${styles.itemsDialogStyleOptions.textColor}`">
            <h1 class="text-lg font-bold">{{ $t("Select from available languages") }}</h1>
            <ul class="flex flex-wrap items-center justify-center gap-6 select-none">
                <li
                    class="flex flex-wrap items-center gap-2 border-2 p-1 px-2 rounded-xl shadow-mr15"
                    :style="`background-color: ${locale == language.code ? styles.baseColors.bgSecondaryColor : 'transparent'};
                    border-color: ${locale == language.code ? styles.baseColors.primaryColor : '#8883'};`"
                    v-for="language in availableLocales"
                    @click="selectOption(language.code)"
                >
                    <img class="w-8" :src="`/flags/${language.code}.png`" :alt="language.code" draggable="false" />
                    <span class="text-sm">{{ language.name }}</span>
                </li>
            </ul>
        </div>
    </DrawerDialog>
</template>

<script setup>
import DrawerDialog from "@/components/DrawerDialog.vue";
import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { storeToRefs } from "pinia";

useHead({ title: `Language Switch` });

const stylesStore = useStylesStore();
const { styles } = storeToRefs(stylesStore);

const infoStore = useInfoStore();
const { restaurantInfo } = storeToRefs(infoStore);

const { locale, locales, setLocale, setLocaleCookie } = useI18n();
const router = useRouter();
const switchLocalePath = useSwitchLocalePath();

const availableLocales = computed(() => locales.value.filter((i) => restaurantInfo.value.brand?.languages.includes(i.code)));
const selectOption = (code) => {
    if (locale.value === code) return;
    setLocale(code);
    setLocaleCookie(code);
    switchLocalePath(code);
    router.back();
};
</script>
