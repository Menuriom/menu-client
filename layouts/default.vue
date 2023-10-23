<style scoped>
*::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
* {
    scrollbar-width: none;
}
main {
    width: 100%;
    height: 100vh;
    height: 100svh;
}
</style>

<template>
    <div class="flex flex-col items-center w-screen" :style="`background-color: ${stylesStore.styles?.baseColors?.bgMainColor}`" id="app">
        <Html :lang="localHead.htmlAttrs.lang" :dir="localHead.htmlAttrs.dir">
            <NuxtLoadingIndicator :color="`repeating-linear-gradient(to right, theme('colors.primary') 0%, theme('colors.secondary') 100%)`" />
            <main class="">
                <slot />
            </main>
        </Html>
    </div>
</template>

<script setup>
import { useStylesStore } from "@/stores/styles";

const stylesStore = useStylesStore();
const localHead = useLocaleHead({ addDirAttribute: true, identifierAttribute: "id", addSeoAttributes: true });
const i18n_redirected = useCookie("i18n_redirected");
i18n_redirected.value = "fa";

useHead({
    // title: t("layouts.title"),
    link: [...localHead.value.link],
    meta: [...localHead.value.meta],
});
</script>
