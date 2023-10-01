<style scoped>
.dialog {
    z-index: 100;
    background: transparent;
}
.dialog > .box {
    max-height: calc(100vh - 2rem);
    max-height: calc(100svh - 2rem);
    z-index: 2;
}
</style>

<template>
    <dialog aria-modal="true" class="dialog fixed inset-0 flex items-center justify-center w-full px-2 isolate">
        <div class="backdrop fixed inset-0 bg-neutral-800 bg-opacity-50 backdrop-blur-sm" @click="close()"></div>
        <div
            class="pattern-bg absolute -top-1/2 w-full max-w-screen-sm aspect-square pointer-events-none"
            :style="`background-image: url('${options.bgImage}'); background-size: clamp(50px, ${options.bgImageSize}%, 360px); background-color: ${options.bgMainColor}; opacity: ${options.bgImageOpacity}%; rotate: ${options.bgImageRotation}deg;`"
            v-if="options.withPattern"
        ></div>
        <Transition name="slide-down" appear>
            <div
                class="box flex flex-col items-center gap-4 shadow-mr25 w-full max-w-lg"
                :style="`margin-top: ${options.imageMargin / 4}rem; background-color: ${options.bgMainColor}; border-radius: ${options.cornerRadius}px;`"
                v-show="open"
            >
                <button
                    class="absolute -top-4 flex items-center justify-center p-2 rounded-full shadow-nr35 transition-all hover:scale-125 z-2"
                    :style="`background-color: ${options.textColor};`"
                    @click="close()"
                >
                    <Icon class="w-5 h-5 rotate-45" :style="`background-color: ${options.bgMainColor};`" name="plus.svg" folder="icons/tabler" size="20px" />
                </button>
                <slot />
            </div>
        </Transition>
    </dialog>
</template>

<script setup>
const props = defineProps({
    options: { type: Object },
});

const router = useRouter();
const open = ref(true);

const close = () => {
    open.value = false;
    setTimeout(() => router.back(), 200);
};

onMounted(() => {
    const body = document.querySelector("body");
    body.style.overflowY = "hidden";
});
onBeforeUnmount(() => {
    const body = document.querySelector("body");
    body.style.overflowY = "initial";
});
</script>
