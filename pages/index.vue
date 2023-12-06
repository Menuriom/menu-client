<style scoped></style>

<template>
    <div class="p-16">
        <nuxt-link
            class="flex items-center justify-center p-2 px-6 rounded-md bg-primary shadow-mr10 hover:shadow-mr15 transition-all"
            :to="localePath('/Menuriom')"
        >
            Sample Menu
        </nuxt-link>
    </div>
</template>

<script setup>
const localePath = useLocalePath();
</script>
