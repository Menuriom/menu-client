<style scoped>
.splash-screen.active {
    animation-name: v-bind("transitionAnimation");
    animation-duration: 2s;
    animation-timing-function: ease;
}
</style>

<template>
    <div
        class="splash-screen fixed inset-0 flex flex-col items-center justify-center gap-4 w-full h-screen overflow-hidden isolate"
        :class="{ active: doTheAnimation }"
        :style="`background-color: ${options.bgMainColor};`"
        v-if="showSplashScreen"
    >
        <div
            class="bg-repeat absolute -z-10 w-[210%] aspect-square pointer-events-none"
            :style="`
            background-image: url('${options.bgImage}');
            background-size: clamp(50px, ${options.bgImageSize}%, 400px);
            background-color: ${options.bgMainColor};
            opacity: ${options.bgImageOpacity}%;
            rotate: ${options.bgImageRotation}deg;`"
            v-if="options.withPattern"
        ></div>

        <div
            class="flex items-center justify-center w-36 h-36 p-6 shadow-nr25"
            :style="`background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
        >
            <img class="w-full h-full object-contain shadow-nr15" :style="`border-radius: ${options.cornerRadius - 10}px;`" :src="brand.logo" alt="" />
        </div>
        <div class="flex flex-col items-center">
            <h3 class="rounded font-bold text-2xl" :style="`color: ${options.textColor};`">{{ brand.name }}</h3>
            <small class="opacity-75 text-xs" :style="`color: ${options.textColor};`">{{ brand.slogan }}</small>
        </div>

        <LineScroll class="absolute start-0 top-1/2 -z-10 -mt-16 opacity-40" :options="options" v-if="options.withLine" />
    </div>
</template>

<script setup>
// import { useStylesStore } from "@/stores/styles";

const props = defineProps({
    showSplashScreen: { type: Boolean },
    doTheAnimation: { type: Boolean },
    options: { type: Object },
    brand: { type: Object },
});

const transitionAnimation = ref(`SPLASH_${props.options?.transition || "slide-up"}`);
</script>
