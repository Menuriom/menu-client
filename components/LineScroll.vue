<style scoped>
*::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
* {
    scrollbar-width: none;
}

.scroll-text-right {
    animation: scroll-text v-bind("seconds") infinite linear alternate;
}
.scroll-text-left {
    animation: scroll-text v-bind("seconds") infinite linear alternate-reverse;
}
@keyframes scroll-text {
    0% {
        transform-origin: center center;
        transform: translate(-20%);
    }
    100% {
        transform-origin: center center;
        transform: translate(20%);
        /* transform: translate(v-bind("percent")); */
    }
}
</style>

<template>
    <div class="flex flex-col items-center justify-center w-full" :style="`rotate:${options.lineRotation}deg;`">
        <span class="w-[180%] h-2" :style="`background-color: ${options.primaryColor};`"></span>
        <div class="scroll-text-right flex items-center gap-2 whitespace-nowrap px-2" dir="ltr">
            <span class="flex items-center gap-2" :style="`color: ${options.textColor};`" v-for="i in 4" :key="i">
                {{ options.lineText }}
                <Icon class="w-5 h-5 shrink-0" :style="`background-color: ${options.textColor};`" name="north-star.svg" folder="icons/tabler" size="20px" />
            </span>
        </div>
        <div class="scroll-text-left flex items-center gap-2 whitespace-nowrap px-2" dir="ltr">
            <span class="flex items-center gap-2" :style="`color: ${options.textColor};`" v-for="i in 4" :key="i">
                {{ options.lineText }}
                <Icon class="w-5 h-5 shrink-0" :style="`background-color: ${options.textColor};`" name="north-star.svg" folder="icons/tabler" size="20px" />
            </span>
        </div>
        <span class="w-[180%] h-2" :style="`background-color: ${options.primaryColor};`"></span>
    </div>
</template>

<script setup>
const props = defineProps({
    options: { type: Object },
});

// const percent = computed(() => `-${props.options.lineText.length * 5}%`);
const seconds = computed(() => `${props.options.lineText.length / 5}s`);
</script>
