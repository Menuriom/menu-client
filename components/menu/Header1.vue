<style scoped>
.pattern-bg {
    background-repeat: repeat;
    mix-blend-mode: darken;
}

.text-scroll-rtl {
    animation: text-scroll-rtl 5s infinite linear;
}
.text-scroll-ltr {
    animation: text-scroll-ltr 5s infinite linear;
}
</style>

<template>
    <header
        class="relative flex items-center justify-between gap-2 w-full p-2 lg:mt-2 shadow-nr15 isolate overflow-hidden shrink-0"
        :style="`background-color: ${options.primaryColor};`"
    >
        <div
            class="pattern-bg absolute -top-1/2 w-full aspect-square lg:rounded-md -z-10"
            :style="`background-image: url('${options.bgImage}'); background-size: clamp(50px, ${options.bgImageSize}%, 360px); background-color: ${options.bgSecondaryColor}; opacity: ${options.bgImageOpacity}%; rotate: ${options.bgImageRotation}deg;`"
            v-if="options.withPattern"
        ></div>
        <div class="flex items-center gap-1">
            <div
                class="flex items-center justify-center w-12 h-12 p-1.5 shadow-mr15 shrink-0 overflow-hidden"
                :style="`background-color: ${options.bgMainColor}; border-radius: ${options.logoRadius}px;`"
            >
                <img class="w-full h-full object-cover" :style="`border-radius: ${options.logoRadius - 6}px;`" :src="restaurantInfo.brand?.logo" alt="" />
            </div>
            <div class="flex flex-col gap-0.5">
                <h2 class="font-bold text-base/none" :style="`color: ${options.textColor};`">{{ restaurantInfo.brand.name }}</h2>
                <small class="opacity-80 text-xxs" :style="`color: ${options.textColor};`">{{ restaurantInfo.brand.slogan }}</small>
            </div>
        </div>
        <div class="flex items-center gap-1">
            <nuxt-link
                class="flex items-center gap-1 p-2 border border-neutral-200 border-opacity-10 rounded-md"
                :style="`background-color: ${options.bgMainColor};`"
                :to="localePath(`/${route.params.brand_username}/branches`)"
            >
                <Icon class="w-4 h-4 shrink-0 bg-red-400" name="map-pin-filled.svg" folder="icons/tabler" size="16px" />
                <div class="w-16 overflow-hidden" :style="`color: ${options.textColor};`">
                    <div
                        class="flex items-center text-xs whitespace-nowrap"
                        :class="{
                            [`text-scroll-${localeProperties.dir}`]: shouldUseTextPass(
                                itemsFilterStore.selectedBranch?.translation?.[locale]?.name || itemsFilterStore.selectedBranch?.name
                            ),
                        }"
                    >
                        {{ itemsFilterStore.selectedBranch?.translation?.[locale]?.name || itemsFilterStore.selectedBranch?.name }}
                        <div
                            class="flex items-center gap-1 whitespace-nowrap ps-1"
                            v-if="shouldUseTextPass(itemsFilterStore.selectedBranch?.translation?.[locale]?.name || itemsFilterStore.selectedBranch?.name)"
                        >
                            <span> {{ itemsFilterStore.selectedBranch?.translation?.[locale]?.name || itemsFilterStore.selectedBranch?.name }} </span>
                        </div>
                    </div>
                </div>
            </nuxt-link>
            <nuxt-link
                class="flex flex-col items-center p-1 px-1.5 border border-neutral-200 border-opacity-10 rounded-md"
                :style="`background-color: ${options.bgMainColor};`"
                :to="localePath(`/${route.params.brand_username}/language-switch`)"
            >
                <img class="w-4" :src="`/flags/${locale}.png`" :alt="locale" />
                <span class="text-xs" :style="`color: ${options.textColor};`">{{ locale.toLocaleUpperCase() }}</span>
            </nuxt-link>
        </div>
    </header>
</template>

<script setup>
import { useItemsFilterStore } from "@/stores/itemsFilter";

const props = defineProps({
    restaurantInfo: { type: Object },
    options: { type: Object },
});

const { locale, localeProperties } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const itemsFilterStore = useItemsFilterStore();

const shouldUseTextPass = (text) => text.length > 9;
</script>
