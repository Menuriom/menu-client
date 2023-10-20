<style scoped>
.swiper {
    overflow: initial;
}
.swiper-slide {
    width: auto;
    /* max-width: 4.5rem; */
    display: flex !important;
}

.bg-pattern {
    background-repeat: space;
    background-size: 2rem;
    filter: grayscale(1);
}
</style>
<style>
.swiper-pagination {
    bottom: -2px !important;
}
.swiper-pagination-bullet {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    background-color: v-bind("baseColors.textColor");
    opacity: 20%;
    border-radius: 99px;
}
.swiper-pagination-bullet-active {
    display: inline-block;
    width: 1rem;
    background-color: v-bind("baseColors.primaryColor");
    opacity: 100%;
}
</style>

<template>
    <div
        class="sticky flex flex-col gap-4 p-2 pt-1 w-full bg-opacity-75 backdrop-blur-sm select-none overflow-hidden shrink-0"
        :style="`background-color: ${baseColors.bgMainColor};`"
    >
        <h2 class="flex items-center gap-2 w-full font-bold overflow-hidden transition-all">
            {{ $t("Our Suggestions") }} <span class="w-0.5 h-0.5 opacity-5 grow" :style="`background-color: ${baseColors.textColor}`"></span>
        </h2>
        <Swiper
            :modules="[Pagination]"
            class="w-full h-auto"
            wrapper-tag="ul"
            :auto-height="true"
            slides-per-view="auto"
            :loop="suggestedItems.length > 3"
            :pagination="{ clickable: true }"
            :dir="localeProperties.dir"
            @swiper="getSwiper"
        >
            <!-- :style="`background: linear-gradient(180deg, ${baseColors.primaryColor} 0%, ${baseColors.accentColor} 100%);`" -->
            <SwiperSlide
                tag="li"
                class="relative flex items-center justify-center gap-4 max-w-full p-4 my-5 rounded-lg shadow-nr10 me-6 isolate shrink-0"
                :style="`background: ${baseColors.accentColor};`"
                v-for="(item, i) in suggestedItems"
            >
                <!-- <div class="absolute w-full h-full overflow-hidden rounded-lg -z-10">
                    <img class="absolute w-full h-full object-cover scale-150 blur-[2px] opacity-40" :src="item.images[0]" />
                </div> -->
                <div class="absolute flex items-center justify-center w-full h-full overflow-hidden rounded-lg -z-10">
                    <div class="bg-pattern w-screen h-screen -rotate-12 opacity-25" :style="`background-image:url(${item.categoryIcon})`"></div>
                </div>

                <div
                    class="absolute -top-4 end-2 flex items-center justify-center -rotate-12 p-0.5 px-3 rounded-full z-2 border-2 animate-pulse"
                    :style="`background-color: ${baseColors.primaryColor}; border-color: ${baseColors.textColor};`"
                    v-if="item.showAsNew"
                >
                    <small class="font-bold" :style="`color: ${baseColors.textColor};`">New</small>
                </div>
                <div class="absolute top-0 start-0 flex items-center justify-center z-2 isolate" v-if="item.discountActive">
                    <Icon class="absolute w-12 h-12 bg-rose-500 shadow-mr35 shadow-rose-600 -z-10" name="tag.svg" folder="." size="48px" />
                    <span class="font-extrabold text-white">{{ item.discountPercentage }}%</span>
                </div>
                <!-- TODO -->
                <!-- <div class="absolute top-0 start-0 flex items-center justify-center z-2 isolate" v-if="item.specialDaysActive">
                    <Icon class="absolute w-12 h-12 bg-rose-500 shadow-mr35 shadow-rose-600 -z-10" name="tag.svg" folder="." size="48px" />
                    <span class="font-extrabold text-white">{{ item.discountPercentage }}%</span>
                </div> -->
                <span class="flex items-center justify-center w-36 h-28 me-2 -ms-4 -mt-4 rounded-xl -rotate-[20deg] shrink-0">
                    <img class="w-full aspect-square rounded-xl object-cover shadow-nr15" :src="item.images[0]" />
                </span>
                <div class="flex flex-col items-start gap-2 w-full max-w-screen-2xs">
                    <h3 class="relative flex items-start rounded-full text-xl/tight font-bold" :style="`color: ${baseColors.textColor};`">
                        {{ item.translation?.[locale]?.name || item.name }}
                        <span class="absolute w-9/12 h-7 -mt-2 opacity-75 -z-10" :style="`background-color: ${baseColors.bgSecondaryColor};`"></span>
                    </h3>
                    <div class="flex items-start gap-1 p-1 px-3 border-4 border-dotted" :style="`border-color: ${baseColors.bgMainColor};`">
                        <div class="flex flex-col">
                            <!-- <span class="line-through line" :style="`color: ${baseColors.textColor};`" v-if="item.discountActive">
                                {{ Intl.NumberFormat(locale).format(item.price) }}
                            </span> -->
                            <b class="f-inter font-extrabold text-xl/none" :style="`color: ${baseColors.bgMainColor};`">
                                {{ Intl.NumberFormat(locale).format(item.price * (1 - (item.discountActive ? item.discountPercentage : 0) / 100)) }}
                            </b>
                        </div>
                        <span class="text-xs opacity-75" :style="`color: ${baseColors.textColor};`">
                            {{ restaurantInfo.brand.currency }}
                        </span>
                    </div>
                    <!-- TODO : add special of day tag -->
                    <!-- TODO : add variants -->
                </div>
            </SwiperSlide>
        </Swiper>
    </div>
</template>

<script setup>
import { Pagination } from "swiper/modules";
import { useItemsStore } from "@/stores/items";

const props = defineProps({
    restaurantInfo: { type: Object },
    baseColors: { type: Object },
});

const emit = defineEmits(["filter:items"]);

const { localeProperties, locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();

const itemsStore = useItemsStore();

const suggestedItems = computed(() => {
    const suggestions = [];
    for (const category of itemsStore.menuItems) {
        for (const item of category.items) {
            if (item.pinned) suggestions.push({ ...item, categoryIcon: category.icon });
        }
    }
    return suggestions;
});

const swiperInstance = ref();
const getSwiper = (swiper) => {
    swiperInstance.value = swiper;
    watch(localeProperties, (v) => {
        swiper.changeLanguageDirection(v.dir);
    });
};
</script>
