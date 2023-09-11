<template>
    <div class="flex flex-col items-center w-full">
        <ul class="grid gap-4 w-full" style="grid-template-columns: repeat(auto-fill, minmax(305px, 1fr))">
            <li
                class="relative flex items-center gap-3 w-full p-3 rounded-lg border border-neutral-500 border-opacity-10 shadow-nr15"
                :class="[options.zigzag && i % 2 == 0 ? 'flex-row-reverse' : 'flex-row', item.soldOut ? 'opacity-70' : '']"
                :style="`margin-top: ${options.imageMargin / 8}rem; background-color: ${options.bgMainColor}; border-radius: ${options.cornerRadius}px;`"
                v-for="(item, i) in items"
                @click="openMenuDetails(item)"
            >
                <span
                    class="relative w-28 aspect-square rounded-lg shrink-0"
                    :style="`margin-top: -${options.imageMargin / 4}rem;
                    background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
                >
                    <img
                        class="w-full aspect-square object-cover"
                        :style="`border-radius: ${options.cornerRadius}px;`"
                        :src="item.images[0]"
                        alt=""
                        loading="lazy"
                        v-if="item.images[0]"
                    />
                    <div
                        id="sold-out"
                        class="absolute start-3 top-9 -rotate-45 p-2 px-3 rounded-md opacity-75"
                        :style="`background-color: ${options.textColor}; color: ${options.bgMainColor};`"
                        v-if="item.soldOut"
                    >
                        {{ $t("Sold Out") }}
                    </div>
                </span>
                <div class="flex flex-col gap-2 w-full h-full grow">
                    <div class="flex items-center gap-1 opacity-75">
                        <span
                            class="p-0.5 px-2 text-xs border border-neutral-500 border-opacity-20 shadow-nr10"
                            :style="`background-color: ${options.accentColor}; color: ${options.textColor}; border-radius: ${options.cornerRadius}px;`"
                            v-if="item.showAsNew"
                        >
                            {{ $t("NEW") }}
                        </span>
                        <span
                            class="p-0.5 px-2 text-xs border border-neutral-500 border-opacity-20 shadow-nr10"
                            :style="`background-color: ${options.accentColor}; color: ${options.textColor}; border-radius: ${options.cornerRadius}px;`"
                            v-if="item.specialDaysList?.includes(weekday[today])"
                        >
                            {{ $t("Today's Special") }}
                        </span>
                    </div>
                    <h3 class="text-base font-semibold" :style="`color: ${options.textColor};`">
                        {{ item.translation?.[locale]?.name || item.name }}
                    </h3>
                    <p class="text-xs opacity-75 grow" :style="`color: ${options.textColor};`">
                        {{ item.translation?.[locale]?.description || item.description }}
                    </p>
                    <hr class="w-full opacity-20 mt-auto" :style="`border-color: ${options.textColor};`" />
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <div class="flex items-end gap-1 text-base/none">
                            <div class="flex flex-col gap-1.5">
                                <div class="relative flex flex-wrap items-center" v-if="item.discountActive">
                                    <small class="line-through line" :style="`color: ${options.textColor};`">
                                        {{ Intl.NumberFormat(locale).format(item.price) }}
                                    </small>
                                    <span class="absolute -end-7 text-xs bg-rose-400 bg-opacity-75 px-1 rounded-md">{{ item.discountPercentage }} %</span>
                                </div>
                                <b class="text-xl/none" :style="`color: ${options.accentColor};`">
                                    {{ Intl.NumberFormat(locale).format(item.price * (1 - (item.discountActive ? item.discountPercentage : 0) / 100)) }}
                                </b>
                            </div>
                            <span class="text-xs opacity-75" :style="`color: ${options.textColor};`">
                                {{ restaurantInfo.brand.currency }}
                            </span>
                        </div>
                        <button
                            class="flex items-center justify-center w-7 h-7 p-1 rounded-full shadow-nr15 transition-all hover:scale-125 shrink-0"
                            :style="`background-color: ${options.primaryColor};`"
                        >
                            <Icon
                                class="w-5 h-5 shrink-0"
                                :style="`background-color: ${options.bgMainColor};`"
                                name="plus.svg"
                                folder="icons/tabler"
                                size="18px"
                            />
                        </button>
                    </div>
                </div>
            </li>
        </ul>
        <p
            class="p-0.5 px-4 text-sm shadow-mr5"
            :style="`background-color: ${options.bgSecondaryColor}; color: ${options.accentColor}; border-radius: ${options.cornerRadius}px;`"
            v-if="items.length === 0"
        >
            {{ $t("This category has no items yet") }}!
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    restaurantInfo: { type: Object },
    options: { type: Object },
    items: { type: Object },
});

const { locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const router = useRouter();

const today = new Date().getDay();
const weekday = ["sundays", "mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays"];

const openMenuDetails = (item) => {
    localStorage.setItem("item", JSON.stringify(item));
    router.push(localePath(`/${route.params.brand_id}/item-details?i=${item._id}`));
};
</script>
