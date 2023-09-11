<style scoped></style>

<template>
    <div
        :style="`mask: url('/${folder}/${name}') no-repeat center; -webkit-mask: url('/${folder}/${name}') no-repeat center; mask-size:${size}; -webkit-mask-size:${size};`"
    ></div>
</template>

<script setup>
const props = defineProps({
    name: { type: String },
    folder: { type: String },
    size: { type: String, default: "24px" },
});
</script>
