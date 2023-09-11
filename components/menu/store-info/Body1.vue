<style scoped>
*::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
* {
    scrollbar-width: none;
}

.insta-gradient {
    background-image: linear-gradient(87.28deg, #e2d55a -2.39%, #cb30e5 36.32%, rgba(248, 65, 163, 0.88) 75.04%, rgba(235, 97, 97, 0.94) 109.79%);
    background-image: linear-gradient(60deg, rgba(180, 119, 221, 1) 0%, rgba(224, 57, 57, 1) 55%, rgba(250, 202, 135, 1) 100%);

    background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #6328eb 90%);
}
</style>

<template>
    <div class="flex flex-col items-center justify-evenly gap-8 w-full h-full">
        <span class="mt-2"></span>

        <div class="flex flex-col items-center gap-4">
            <div
                class="flex items-center justify-center w-28 h-28 p-4 shadow-nr25"
                :style="`background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
            >
                <img class="w-full h-full object-contain shadow-nr15" :style="`border-radius: ${options.cornerRadius}px;`" :src="brand.logo" alt="" />
            </div>
            <div class="flex flex-col items-center">
                <h3 class="font-bold text-xl" :style="`color: ${options.textColor};`">{{ brand.name }}</h3>
                <small class="opacity-60 text-xxs" :style="`color: ${options.textColor};`">{{ brand.slogan }}</small>
            </div>
        </div>

        <ul class="flex items-center gap-2 w-full overflow-auto">
            <li
                class="flex items-center gap-1 p-2 mt-1 shadow-nr15 border border-neutral-500 border-opacity-20 rounded-md"
                :style="`background-color: ${options.bgMainColor}; border-radius: ${options.cornerRadius}px;`"
                v-for="i in 4"
                :key="i"
            >
                <Icon class="w-4 h-4 shrink-0 bg-red-400" name="map-pin-filled.svg" folder="icons/tabler" size="16px" />
                <span class="w-16 h-1 opacity-90 rounded" :style="`background-color: ${options.textColor};`"></span>
            </li>
        </ul>

        <div
            class="flex flex-col items-center gap-1 p-4 rounded-lg border border-neutral-500 border-opacity-20 backdrop-blur-sm"
            :style="`background-color: ${options.primaryColor}; border-radius: ${options.cornerRadius > 16 ? 16 : options.cornerRadius}px;`"
        >
            <Icon
                class="w-7 h-7 shrink-0"
                :style="`background-color: ${options.bgSecondaryColor};`"
                name="building-store.svg"
                folder="icons/tabler"
                size="28px"
            />
            <span class="text-sm" :style="`color: ${options.textColor};`">
                <b :style="`color: ${options.bgSecondaryColor};`">Sunday</b>
                through
                <b :style="`color: ${options.bgSecondaryColor};`">Friday</b>
            </span>
            <span class="text-sm" :style="`color: ${options.textColor};`" dir="ltr">
                <b :style="`color: ${options.bgSecondaryColor};`">9:00</b> AM - <b :style="`color: ${options.bgSecondaryColor};`">12:00</b> PM
            </span>
        </div>

        <div class="flex flex-col items-center gap-2" :style="`color: ${options.textColor};`">
            <a class="text-lg/none" href="tel:0212345678" dir="ltr">
                021 <span class="inline-block w-24 h-3.5 rounded-sm" :style="`background-color: ${options.textColor};`"></span>
            </a>
            <a class="text-lg/none" href="tel:0212345678" dir="ltr">
                021 <span class="inline-block w-24 h-3.5 rounded-sm" :style="`background-color: ${options.textColor};`"></span>
            </a>
        </div>

        <div class="flex flex-wrap items-center gap-4">
            <a class="flex items-center gap-1 text-sm" :style="`color: ${options.textColor};`" href="" dir="ltr" v-for="(item, i) in socials" :key="i">
                <!-- <img class="w-6 h-6" width="24px" src="/socials/instagram.png" alt="" /> -->
                <Icon
                    class="w-8 h-8 shrink-0"
                    :style="`background-color: ${options.accentColor};`"
                    :name="`brand-${item}.svg`"
                    folder="icons/tabler"
                    size="32px"
                />
            </a>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    brand: { type: Object },
    options: { type: Object },
    // baseColors: { type: Object },
});

const socials = ref(["instagram", "twitter", "telegram", "whatsapp"]);
</script>
