<style scoped>
.dialog {
    z-index: 100;
    background: transparent;
}
.dialog > .box {
    max-height: calc(100vh - 2rem);
    max-height: calc(100svh - 2rem);
    min-height: 20%;
    z-index: 2;
}

.drawer-slide {
    display: flex;
    align-items: flex-end;
    justify-content: center;
}

.fill-screen {
    height: 100vh;
    height: 100dvh;
}
</style>

<template>
    <dialog
        aria-modal="true"
        class="dialog fixed inset-0 flex items-end justify-center w-full fill-screen"
        @mousedown="grab"
        @mousemove="move"
        @touchstart="grab"
        @touchmove="move"
        ref="drawer"
    >
        <Transition name="fade" appear>
            <div class="backdrop fixed inset-0 bg-neutral-800 bg-opacity-50" @click="close()" v-if="open"></div>
        </Transition>
        <Transition name="slide-down" appear>
            <div
                class="box relative flex flex-col items-center gap-4 shadow-mr15 w-full max-w-lg"
                :style="`margin-top: ${options.imageMargin / 4}rem;
                background-color: ${options.bgMainColor}; border-radius: ${options.cornerRadius}px;`"
                v-show="open"
                ref="drawerBox"
            >
                <span
                    class="handle w-4/12 h-1.5 mt-4 -mb-4 rounded-full bg-neutral-300 bg-opacity-75 mix-blend-difference shrink-0"
                    v-if="options.imageMargin == '0'"
                ></span>
                <slot />
            </div>
        </Transition>
    </dialog>
</template>

<script setup>
const props = defineProps({
    options: { type: Object },
    actionLock: { type: Boolean, default: false },
});

const router = useRouter();
const open = ref(true);

let closing = false;
const close = () => {
    if (closing) return;
    closing = true;
    open.value = false;
    setTimeout(() => router.back(), 200);
};

const drawer = ref(); // Dom Ref
const drawerBox = ref(); // Dom Ref
const grabbed = ref(false);
const threshold = 120;
let startingY = 0;
let movingStartingY = 0;
let delta = 0;

// TODO : make sure that if starting point is super low then dont reset it so that a almost fully lowered box closes no matter the timing

const grab = (e) => {
    if (props.actionLock) return;
    grabbed.value = true;
    startingY = e.changedTouches?.[0].pageY || e.y;
    movingStartingY = e.changedTouches?.[0].pageY || e.y;
    // console.log({ dd: drawerBox.value.clientHeight });
};
const move = (e) => {
    if (!grabbed.value || props.actionLock) return;
    const currentY = e.changedTouches?.[0].pageY || e.y;
    delta = currentY - startingY > 0 ? currentY - startingY : 0;
    drawer.value.style.top = `${delta}px`;
    setTimeout(() => (movingStartingY = e.changedTouches?.[0].pageY || e.y), 100);
};
const release = (e) => {
    if (props.actionLock) return;
    grabbed.value = false;

    const currentY = e.changedTouches?.[0].pageY || e.y;
    const pos = currentY - movingStartingY > 0 ? currentY - movingStartingY : 0;

    try {
        drawer.value.style.transition = "all .2s ease-out";
        if (pos > threshold) {
            drawer.value.style.top = `100%`;
            close();
        } else {
            drawer.value.style.top = `0px`;
            setTimeout(() => {
                if (!drawer.value) return;
                drawer.value.style.transition = "";
            }, 200);
        }
    } catch (e) {}
};

onMounted(() => {
    drawer.value.addEventListener("mouseup", release);
    drawer.value.addEventListener("touchstart", grab);
    drawer.value.addEventListener("touchmove", move);
    drawer.value.addEventListener("touchend", release);
    drawer.value.addEventListener("touchcancel", release);

    const body = document.querySelector("body");
    body.style.overscrollBehavior = "none";
    body.style.overflowY = "hidden";
});
onBeforeUnmount(() => {
    drawer.value.removeEventListener("mouseup", release);
    drawer.value.removeEventListener("touchstart", grab);
    drawer.value.removeEventListener("touchmove", move);
    drawer.value.removeEventListener("touchend", release);
    drawer.value.removeEventListener("touchcancel", release);

    const body = document.querySelector("body");
    body.style.overscrollBehavior = "initial";
    body.style.overflowY = "initial";
});
</script>
