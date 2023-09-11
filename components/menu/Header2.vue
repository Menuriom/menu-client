<style scoped>
.pattern-bg {
    background-repeat: repeat;
    mix-blend-mode: darken;
}
</style>

<template>
    <header class="relative flex items-start justify-between gap-4 w-full px-2 pt-5 isolate shrink-0">
        <div class="absolute inset-0 w-full h-20 -z-10 overflow-hidden" :style="`background-color: ${options.primaryColor};`">
            <div
                class="pattern-bg absolute -top-1/2 w-full aspect-square"
                :style="`background-image: url('${options.bgImage}'); background-size: clamp(50px, ${options.bgImageSize}%, 360px); background-color: ${options.bgSecondaryColor}; opacity: ${options.bgImageOpacity}%; rotate: ${options.bgImageRotation}deg;`"
                v-if="options.withPattern"
            ></div>
        </div>
        <div class="flex items-center gap-2 w-full">
            <div
                class="flex items-center justify-center w-22 h-22 p-2 shadow-nr25 shrink-0"
                :style="`background-color: ${options.bgMainColor};  border-radius: ${options.logoRadius}px;`"
            >
                <img class="w-full h-full object-cover" :style="`border-radius: ${options.logoRadius - 6}px;`" :src="restaurantInfo.brand?.logo" alt="" />
            </div>
            <div class="flex flex-wrap items-start justify-between w-full">
                <div class="flex flex-col gap-0.5">
                    <h2 class="font-bold text-xl/none" :style="`color: ${options.textColor};`">{{ restaurantInfo.brand.name }}</h2>
                    <small class="opacity-80 text-xxs" :style="`color: ${options.textColor};`">{{ restaurantInfo.brand.slogan }}</small>
                </div>
                <div class="flex flex-wrap items-end justify-between gap-2 ms-auto mt-0 2sm:mt-3">
                    <div
                        class="flex items-center gap-1 p-2 shadow-nr10 border border-neutral-200 border-opacity-10 rounded-md"
                        :style="`background-color: ${options.bgMainColor};`"
                    >
                        <Icon class="w-4 h-4 shrink-0 bg-red-400" name="map-pin-filled.svg" folder="icons/tabler" size="16px" />
                        <span class="w-16 h-1 rounded" :style="`color: ${options.textColor};`"></span>
                    </div>
                    <nuxt-link
                        class="flex flex-col items-center p-1 px-1.5 shadow-nr10 border border-neutral-200 border-opacity-10 rounded-md"
                        :style="`background-color: ${options.bgMainColor};`"
                        :to="localePath(`/${route.params.brand_id}/language-switch`)"
                    >
                        <img class="w-4" :src="`/flags/${locale}.png`" :alt="locale" />
                        <span class="text-xs" :style="`color: ${options.textColor};`">{{ locale.toLocaleUpperCase() }}</span>
                    </nuxt-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
const props = defineProps({
    restaurantInfo: { type: Object },
    options: { type: Object },
});

const { locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
</script>
