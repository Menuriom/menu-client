<template>
    <div class="flex flex-col gap-2 w-full">
        <header class="flex items-center gap-2 w-full">
            <span
                class="flex items-center justify-center w-8 h-8 p-1 rounded-full shadow-nr35 shrink-0"
                :style="`background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
                v-if="options.withIcon"
            >
                <img class="w-10 h-10 object-contain" :src="category.icon" />
            </span>
            <h3 class="rounded-full opacity-90 text-sm shrink-0" :style="`color: ${options.textColor};`">
                {{ category.translation?.[locale]?.name || category.name }}
            </h3>
            <hr class="opacity-10 w-1 border grow" :style="`border-color: ${options.textColor};`" />
        </header>
        <h5
            class="flex flex-col gap-1 w-full p-2 rounded-md border border-neutral-500 border-opacity-20 text-xs shadow-nr15"
            :style="`background-color: ${options.bgMainColor}; border-radius: ${options.cornerRadius}px;`"
            v-if="category.description"
        >
            <span class="text-xs" :style="`color: ${options.accentColor};`">
                {{ category.translation?.[locale]?.description || category.description }}
            </span>
        </h5>
    </div>
</template>

<script setup>
const props = defineProps({
    options: { type: Object },
    category: { type: Object },
});

const { locale } = useI18n();
</script>
