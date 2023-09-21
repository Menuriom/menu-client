<style scoped></style>
<style>
.swiper-pagination {
    bottom: -2rem !important;
}
.swiper-pagination-bullet {
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    background-color: v-bind("options.textColor");
    opacity: 20%;
    border-radius: 99px;
}
.swiper-pagination-bullet-active {
    display: inline-block;
    width: 1rem;
    background-color: v-bind("options.primaryColor");
    opacity: 100%;
}
</style>

<template>
    <div class="flex flex-col items-center gap-4 w-full h-full mt-4 px-4 overflow-auto" @scroll="scrolling($event)">
        <div id="details" class="flex items-start gap-4 w-full">
            <div class="flex flex-col items-start gap-2 grow">
                <div class="flex items-center gap-2 opacity-90">
                    <span
                        class="p-1 px-3 text-xs border border-neutral-500 border-opacity-20 shadow-nr10"
                        :style="`background-color: ${options.accentColor}; color: ${options.textColor}; border-radius: ${options.cornerRadius}px;`"
                        v-if="item.showAsNew"
                    >
                        {{ $t("NEW") }}
                    </span>
                    <span
                        class="p-1 px-2 text-xs border border-neutral-500 border-opacity-20 shadow-nr10"
                        :style="`background-color: ${options.accentColor}; color: ${options.textColor}; border-radius: ${options.cornerRadius}px;`"
                        v-if="item.specialDaysList?.includes(weekday[today])"
                    >
                        {{ $t("Today's Special") }}
                    </span>
                </div>
                <h1 class="text-xl/tight font-semibold" :style="`color: ${options.textColor};`">
                    {{ item.translation?.[locale]?.name || item.name }}
                </h1>
                <p class="text-xs opacity-75 grow" :style="`color: ${options.textColor};`">
                    {{ item.translation?.[locale]?.description || item.description }}
                </p>
            </div>
            <div class="flex flex-col items-end gap-2">
                <button
                    class="flex flex-col items-center gap-1 p-2 border border-neutral-500 border-opacity-20 shadow-nr15"
                    :style="`background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
                >
                    <Icon class="w-5 h-5 bg-rose-400" name="heart.svg" folder="icons/tabler" size="20px" />
                    <small class="text-xs" :style="`color: ${options.textColor};`">{{ item.likes }}</small>
                </button>
                <button
                    class="flex flex-col items-center gap-1 p-2 border border-neutral-500 border-opacity-20 shadow-nr15"
                    :style="`background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
                >
                    <Icon class="w-5 h-5" :style="`background-color: ${options.textColor};`" name="message.svg" folder="icons/tabler" size="20px" />
                </button>
            </div>
        </div>

        <div id="images" class="flex w-full mb-6">
            <Swiper
                :modules="[Pagination]"
                class="w-full"
                style="overflow-y: visible"
                slides-per-view="auto"
                :centered-slides="true"
                space-between="20"
                :loop="item.images.length > 3"
                :pagination="{ clickable: true }"
            >
                <SwiperSlide
                    class="shadow-nr15"
                    :style="`width: auto; background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
                    v-for="(image, i) in item.images"
                >
                    <img class="w-64 aspect-square object-cover" :style="`border-radius: ${options.cornerRadius}px;`" :src="image" alt="" />
                </SwiperSlide>
            </Swiper>
        </div>

        <hr class="w-full border-neutral-500 opacity-25 -mb-1" v-if="item.variants.length" />
        <Swiper
            class="w-full pb-4 shrink-0"
            wrapper-class="ul"
            space-between="10"
            :auto-height="true"
            :free-mode="true"
            slides-per-view="auto"
            v-if="item.variants.length"
        >
            <SwiperSlide
                tag="li"
                class="flex flex-col gap-2 p-1.5 px-3 border border-neutral-500 border-opacity-20 cursor-pointer shadow-nr15"
                :style="`width: auto; background-color: ${selectedType == j ? options.primaryColor : options.bgMainColor};
                    border-radius: ${options.cornerRadius}px;`"
                v-for="(variant, j) in item.variants"
                @click="selectType(j)"
            >
                <h3 class="text-sm" :style="`color: ${selectedType == j ? options.bgMainColor : options.textColor}; border-radius: ${options.cornerRadius}px;`">
                    {{ variant.translation?.[locale]?.name || variant.name }}
                </h3>
            </SwiperSlide>
        </Swiper>
        <div
            class="flex flex-col gap-1 w-full -mt-2 p-2 px-3 border border-neutral-500 border-opacity-10 shadow-mr15"
            :style="`background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius - 10}px;`"
            v-for="(sideItem, i) in item.sideItems"
        >
            <div class="flex flex-wrap items-center gap-1" :style="`color: ${options.textColor};`">
                <h3 class="text-xs font-semibold" :style="`color: ${options.accentColor};`">{{ sideItem.translation?.[locale]?.name || sideItem.name }}</h3>
                <span :style="`color: ${options.textColor};`">-</span>
                <p class="opacity-75 text-xs">{{ sideItem.translation?.[locale]?.description || sideItem.description }}</p>
                <span
                    class="text-xxs opacity-75 border border-neutral-500 border-opacity-20 p-0.5 px-2"
                    :style="`border-radius: ${options.cornerRadius}px;`"
                    v-html="$t('toppingMaxCount', { n: `<b>${sideItem.maxNumberUserCanChoose}</b>` })"
                ></span>
            </div>
            <ul id="toppings" class="flex flex-col items-start gap-2 w-full">
                <li
                    class="flex items-center gap-2 w-full cursor-pointer"
                    v-for="(topping, j) in sideItem.items"
                    @click="selectedTopings.has(topping) ? selectedTopings.delete(topping) : selectedTopings.add(topping)"
                >
                    <span
                        class="rounded opacity-80 border-2"
                        :style="`
                            background-color: ${selectedTopings.has(topping) ? options.primaryColor : options.bgMainColor};
                            border-color: ${options.primaryColor};
                            `"
                    >
                        <Icon class="w-3.5 h-3.5" :style="`background-color: ${options.bgMainColor};`" name="check.svg" folder="icons/tabler" size="16px" />
                    </span>
                    <h3 class="text-xs" :style="`color: ${options.textColor};`">{{ topping.translation?.[locale]?.name || topping.name }}</h3>
                    <span class="ms-auto" :style="`color: ${options.textColor};`" v-if="topping.price > 0">
                        {{ Intl.NumberFormat(locale).format(topping.price) }}
                        <small class="text-xxs opacity-75" :style="`color: ${options.textColor};`">
                            {{ restaurantInfo.brand.currency }}
                        </small>
                    </span>
                    <span class="text-sm ms-auto" :style="`color: ${options.accentColor};`" v-else>{{ $t("Free") }}</span>
                </li>
            </ul>
        </div>

        <div
            id="price"
            class="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 md:gap-4 pb-4 w-full rounded-b-md"
            :style="`background-color: ${options.bgMainColor};`"
        >
            <hr class="w-full border-neutral-500 opacity-25" />
            <div class="flex flex-col gap-1 text-base/none">
                <div class="flex flex-wrap items-center gap-1.5" :style="`color: ${options.textColor};`" v-if="item.discountActive">
                    <small class="line-through line">
                        {{ Intl.NumberFormat(locale).format(price) }}
                    </small>
                    <span class="text-xs bg-rose-400 bg-opacity-75 px-1 rounded-md">{{ item.discountPercentage }}%</span>
                </div>
                <div class="flex flex-wrap items-end gap-1">
                    <b class="f-inter text-xl/none" :style="`color: ${options.accentColor};`">
                        {{ Intl.NumberFormat(locale).format(price * (1 - (item.discountActive ? item.discountPercentage : 0) / 100)) }}
                    </b>
                    <span class="text-xs opacity-75" :style="`color: ${options.textColor};`">
                        {{ restaurantInfo.brand.currency }}
                    </span>
                </div>
            </div>
            <button
                class="flex items-center justify-center gap-2 px-4 py-2 rounded-full shadow-nr35 shrink-0"
                :style="`background-color: ${options.primaryColor}; border-radius: ${options.cornerRadius - 10}px;`"
            >
                <span class="text-sm" :style="`color: ${options.bgMainColor};`">{{ $t("Add To Orders") }}</span>
                <Icon class="w-5 h-5 shrink-0" :style="`background-color: ${options.bgMainColor};`" name="plus.svg" folder="icons/tabler" size="24px" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { Pagination } from "swiper/modules";

const props = defineProps({
    options: { type: Object },
    item: { type: Object },
    restaurantInfo: { type: Object },
});

const emit = defineEmits(["innerAction"]);

const { locale } = useI18n();

const selectedType = ref(-1);
const selectedTopings = ref(new Set());

const today = new Date().getDay();
const weekday = ["sundays", "mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays"];

const selectType = (typeIndex) => (selectedType.value = selectedType.value === typeIndex ? -1 : typeIndex);

const price = computed(() => {
    let itemPrice = props.item.variants?.[selectedType.value]?.price ?? props.item.price;
    for (const topping of selectedTopings.value) itemPrice += topping.price;
    return itemPrice;
});

const scrolling = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.scrollTop < 5) emit("innerAction", false);
    else emit("innerAction", true);
};
</script>
