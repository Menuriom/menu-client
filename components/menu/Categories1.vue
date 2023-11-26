<style scoped>
.swiper {
    overflow: initial;
}
.swiper-slide {
    width: auto;
    /* max-width: 4.5rem; */
    display: flex !important;
}

.text-pass-rtl {
    animation: text-pass-rtl 3s infinite ease-in-out alternate;
}
.text-pass-ltr {
    animation: text-pass-ltr 3s infinite ease-in-out alternate;
}

.text-scroll-rtl {
    animation: text-scroll-rtl 4s infinite linear;
}
.text-scroll-ltr {
    animation: text-scroll-ltr 4s infinite linear;
}
</style>

<template>
    <div
        class="sticky flex flex-col gap-2 p-2 pt-1 w-full bg-opacity-75 backdrop-blur-sm select-none overflow-hidden shrink-0"
        :style="`background-color: ${baseColors.bgMainColor};`"
    >
        <h2 class="flex items-center gap-2 w-full font-bold text-sm overflow-hidden transition-all" :class="[notOnTop ? 'h-0 -mt-2' : 'h-6']">
            {{ $t("Categories") }} <span class="w-0.5 h-0.5 opacity-5 grow" :style="`background-color: ${options.textColor}`"></span>
        </h2>
        <Swiper
            :modules="[FreeMode]"
            class="w-full h-auto"
            wrapper-tag="ul"
            :auto-height="true"
            :free-mode="true"
            slides-per-view="auto"
            :dir="localeProperties.dir"
            @swiper="getSwiper"
        >
            <SwiperSlide
                tag="li"
                class="relative border border-neutral-500 border-opacity-10 cursor-pointer shadow-nr10 me-2 shrink-0"
                :style="`max-width: ${options.orientation === 'col' && options.withIcon ? '4.5rem' : 'none'};
                background-color: ${selectedCategory == i ? options.primaryColor : options.bgMainColor}; border-radius: ${options.cornerRadius}px;`"
                v-for="(category, i) in menuItems"
                @click="scrollTo(i, category.name)"
            >
                <span
                    class="absolute start-1 -top-1 rotate-12 px-1.5 rounded text-xs font-extralight isolate"
                    :style="`background-color: ${options.accentColor}; color: ${options.textColor};`"
                    v-if="category.showAsNew"
                >
                    <span class="absolute inset-0 -z-10 rounded animate-ping opacity-50" :style="`background-color: ${options.accentColor};`"></span>
                    {{ $t("NEW") }}
                </span>
                <div
                    class="flex items-center justify-center gap-3 w-full overflow-hidden"
                    :class="[options.orientation === 'col' ? 'flex-col p-3' : 'flex-row p-2']"
                >
                    <span
                        class="flex items-center justify-center w-11 h-11 p-1 rounded-full shrink-0"
                        :style="`background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
                        v-if="options.withIcon"
                    >
                        <img class="w-full aspect-square object-contain" width="44px" height="44px" :src="category.icon" />
                    </span>
                    <h3
                        class="flex items-center rounded-full text-xs/none text-center whitespace-nowrap"
                        :class="{ [`text-scroll-${localeProperties.dir}`]: shouldUseTextPass(category.translation?.[locale]?.name || category.name) }"
                        :style="`color: ${options.textColor};`"
                    >
                        <span> {{ category.translation?.[locale]?.name || category.name }} </span>
                        <div
                            class="flex items-center gap-4 whitespace-nowrap ps-4"
                            v-if="shouldUseTextPass(category.translation?.[locale]?.name || category.name)"
                        >
                            <span> {{ category.translation?.[locale]?.name || category.name }} </span>
                            <span> {{ category.translation?.[locale]?.name || category.name }} </span>
                        </div>
                    </h3>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup>
import { FreeMode } from "swiper/modules";
import { useItemsStore } from "@/stores/items";
import { storeToRefs } from "pinia";

const props = defineProps({
    baseColors: { type: Object },
    options: { type: Object },
});

const { locale, localeProperties } = useI18n();
const route = useRoute();
const router = useRouter();

const selectedCategory = ref(0);
const shouldUseTextPass = (text) => props.options.withIcon && text.length > 9 && props.options.orientation === "col";

const itemsStore = useItemsStore();
const { menuItems } = storeToRefs(itemsStore);

const swiperInstance = ref();
const getSwiper = (swiper) => {
    swiperInstance.value = swiper;
    watch(localeProperties, (v) => {
        swiper.changeLanguageDirection(v.dir);
    });
};

const notOnTop = ref(0);
const threshold = 320;
let listItems;
let target;
let observeActive = true;
const scrollTo = (i, to) => {
    const elmnt = document.getElementById(to);
    observeActive = false;
    elmnt.scrollIntoView({ behavior: "smooth", block: "start" });
    selectedCategory.value = i;
    setTimeout(() => (observeActive = true), 600);
};
const _observeScroll = () => {
    if (!observeActive) return;
    for (const item of listItems) {
        if (window.scrollY + threshold >= item.offsetTop) target = item;
    }
    if (!target) return;
    selectedCategory.value = target.getAttribute("number");
    swiperInstance.value.slideTo(target.getAttribute("number"), 200);
};

onMounted(() => {
    listItems = document.querySelectorAll("section[title='menu-item']");
    window.addEventListener("scroll", () => {
        // notOnTop.value = window.scrollY >= 200;
        _observeScroll();
    });
});
</script>
