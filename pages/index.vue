<style scoped></style>

<template>
    <div class="p-16">
        <nuxt-link
            class="flex items-center justify-center p-2 px-6 rounded-md bg-green-300 shadow-mr10 hover:shadow-mr15 transition-all"
            :to="localePath('/RicosQuesos')"
        >
            menu
        </nuxt-link>
    </div>
</template>

<!-- TODO : note that this menu will be a sub-domain so there will be no need for /r/ in the qr code -->

<script setup>
const localePath = useLocalePath();
</script>
