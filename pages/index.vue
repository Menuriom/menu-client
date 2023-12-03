<style scoped></style>

<template>
    <div class="p-16">
        <nuxt-link
            class="flex items-center justify-center p-2 px-6 rounded-md bg-green-300 shadow-mr10 hover:shadow-mr15 transition-all"
            :to="localePath('/Menuriom')"
        >
            menu
        </nuxt-link>
    </div>
</template>

<script setup>
const localePath = useLocalePath();
</script>
