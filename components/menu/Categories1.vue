<style scoped>
.swiper {
    overflow: initial;
}
.swiper-wrapper {
    height: auto !important;
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
</style>

<template>
    <div
        class="sticky flex flex-col gap-2 p-2 pt-1 w-full bg-opacity-75 backdrop-blur-sm select-none overflow-hidden shrink-0"
        :style="`background-color: ${baseColors.bgMainColor};`"
    >
        <h2 class="flex items-center gap-2 font-bold" v-if="!notOnTop">
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
                class="flex items-center justify-center gap-3 border border-neutral-500 border-opacity-10 cursor-pointer overflow-hidden shadow-nr10 me-2 shrink-0"
                :class="[options.orientation === 'col' ? 'flex-col p-3' : 'flex-row p-2']"
                :style="`max-width: ${options.orientation === 'col' && options.withIcon ? '4.5rem' : 'none'};
                background-color: ${selectedCategory == i ? options.primaryColor : options.bgMainColor}; border-radius: ${options.cornerRadius}px;`"
                v-for="(category, i) in menuItems"
                @click="scrollTo(i, category.name)"
            >
                <span
                    class="flex items-center justify-center w-11 h-11 p-1 rounded-full shrink-0"
                    :style="`background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
                    v-if="options.withIcon"
                >
                    <img class="w-full aspect-square object-contain" :src="category.icon" />
                </span>
                <h3
                    class="rounded-full text-xs/none text-center whitespace-nowrap"
                    :class="{ [`text-pass-${localeProperties.dir}`]: shouldUseTextPass(category.translation?.[locale]?.name || category.name) }"
                    :style="`color: ${options.textColor};`"
                >
                    {{ category.translation?.[locale]?.name || category.name }}
                </h3>
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
let observer;
let listItems;
const threshold = 0.7;
const scrollTo = (i, to) => {
    const elmnt = document.getElementById(to);
    observer.disconnect();
    elmnt.scrollIntoView({ behavior: "smooth", block: "start" });
    selectedCategory.value = i;
    setTimeout(() => _observeElements(), 700);
};
const _observeElements = () => {
    for (const item of listItems) observer.observe(item);
};

onMounted(() => {
    window.addEventListener("scroll", () => (notOnTop.value = window.scrollY > 200));

    listItems = document.querySelectorAll("section[title='menu-item']");
    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                if (entry.intersectionRatio <= threshold) continue;
                selectedCategory.value = entry.target.getAttribute("number");
                swiperInstance.value.slideTo(entry.target.getAttribute("number"), 200);
                return;
            }
        },
        { threshold: threshold }
    );
    _observeElements();
});
</script>
