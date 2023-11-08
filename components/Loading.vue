<style scoped>
.loader {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: inline-block;
    position: relative;
    border: 3px solid;
    border-color: #ddd9 #ddd9 transparent transparent;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
    content: "";
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border: 3px solid;
    border-color: transparent transparent #71b3ffb4 #71b3ffb4;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    box-sizing: border-box;
    animation: rotationBack 0.5s linear infinite;
    transform-origin: center center;
}
.loader::before {
    width: 4px;
    height: 4px;
    border-color: #555b #555b transparent transparent;
    animation: rotation 1.5s linear infinite;
}

@keyframes rotation {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
@keyframes rotationBack {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(-360deg);
    }
}
</style>

<template>
    <div class="flex items-center justify-center" :class="[size]">
        <div class="loader"></div>
    </div>
</template>

<script setup>
defineProps({
    size: { type: String, default: "h-5" },
});
</script>
