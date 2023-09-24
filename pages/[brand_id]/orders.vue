<style scoped></style>

<template>
    <DrawerDialog :baseColors="styles.baseColors" :options="styles.itemsDialogStyleOptions" :actionLock="actionLock">
        <div
            class="flex flex-col items-center gap-4 p-6 w-full overflow-auto"
            :style="`color: ${styles.itemsDialogStyleOptions.textColor}`"
            @scroll="scrolling($event)"
        >
            <header class="flex flex-wrap items-center justify-between gap-2 w-full">
                <h1 class="font-bold">{{ $t("Orders List") }}</h1>
                <button class="text-xxs underline underline-offset-2 opacity-75">
                    {{ $t("Clear list") }}
                </button>
            </header>
            <ul class="flex flex-col gap-2 w-full" :class="{ 'pe-1.5': orderItems.size > 2 }">
                <li
                    class="relative flex items-start gap-3 w-full p-3 rounded-lg border border-neutral-500 border-opacity-10 shadow-nr15"
                    :style="`margin-top: ${styles.mainMenuStyleOptions?.itemListOptions.imageMargin / 8}rem;
                    background-color: ${styles.mainMenuStyleOptions?.itemListOptions.bgMainColor};
                    border-radius: ${styles.mainMenuStyleOptions?.itemListOptions.cornerRadius}px;`"
                    v-for="([, { item, variant, sideItems }], i) in orderItems"
                >
                    <span
                        class="relative w-16 aspect-square rounded-lg shrink-0"
                        :style="`margin-top: -${styles.mainMenuStyleOptions?.itemListOptions.imageMargin / 4}rem;
                        background-color: ${styles.mainMenuStyleOptions?.itemListOptions.bgSecondaryColor};
                        border-radius: ${styles.mainMenuStyleOptions?.itemListOptions.cornerRadius}px;`"
                    >
                        <img
                            class="w-full aspect-square object-cover"
                            :style="`border-radius: ${styles.mainMenuStyleOptions?.itemListOptions.cornerRadius}px;`"
                            :src="item.images[0]"
                            alt=""
                            loading="lazy"
                            v-if="item.images[0]"
                        />
                    </span>
                    <div class="flex flex-col gap-3 w-full min-h-[4rem]">
                        <div class="flex flex-wrap items-center gap-2 w-full text-sm grow">
                            <h3 class="font-semibold" :style="`color: ${styles.mainMenuStyleOptions?.itemListOptions.textColor};`">
                                {{ item.translation?.[locale]?.name || item.name }}
                            </h3>
                            <span
                                class="w-0.5 h-0.5 opacity-10 grow"
                                :style="`background-color: ${styles.mainMenuStyleOptions?.itemListOptions.textColor};`"
                            ></span>
                            <small
                                class="px-2 border border-neutral-500 border-opacity-25"
                                :style="`background-color: ${styles.mainMenuStyleOptions?.itemListOptions.accentColor}; border-radius: ${styles.mainMenuStyleOptions?.itemListOptions.cornerRadius}px;`"
                                v-if="variant"
                            >
                                {{ variant.translation?.[locale]?.name || variant.name }}
                            </small>
                            <!-- <p
                                class="text-xxs opacity-75 max-h-8 overflow-hidden text-ellipsis grow"
                                :style="`color: ${styles.mainMenuStyleOptions?.itemListOptions.textColor};`"
                            >
                                {{ item.translation?.[locale]?.description || item.description }}
                            </p> -->
                        </div>
                        <ul class="flex flex-wrap items-start gap-2 -mt-1.5" v-if="sideItems && sideItems.size > 0">
                            <li class="text-xs opacity-80" v-for="(sideItem, i) in sideItems">
                                <b
                                    class="inline-block w-2 h-2 rounded-full"
                                    :style="`background-color: ${styles.mainMenuStyleOptions?.itemListOptions.accentColor};`"
                                ></b>
                                {{ sideItem.translation?.[locale]?.name || sideItem.name }}
                            </li>
                        </ul>
                        <div class="flex flex-wrap items-end justify-between gap-2 grow">
                            <button
                                class="flex items-center justify-center w-7 h-5 p-1 rounded-full shadow-nr15 transition-all hover:scale-125 shrink-0"
                                :style="`background-color: ${styles.mainMenuStyleOptions?.itemListOptions.primaryColor};`"
                            >
                                <Icon
                                    class="w-4 h-4 shrink-0"
                                    :style="`background-color: ${styles.mainMenuStyleOptions?.itemListOptions.bgMainColor};`"
                                    name="plus.svg"
                                    folder="icons/tabler"
                                    size="16px"
                                />
                            </button>
                            <div class="flex items-end gap-1 text-base/none">
                                <div class="flex flex-col gap-1.5">
                                    <div class="relative flex flex-wrap items-center" v-if="item.discountActive">
                                        <small class="line-through line" :style="`color: ${styles.mainMenuStyleOptions?.itemListOptions.textColor};`">
                                            {{ Intl.NumberFormat(locale).format(item.price) }}
                                        </small>
                                        <b class="absolute -end-7 text-xs bg-rose-400 bg-opacity-75 px-1 rounded-md">{{ item.discountPercentage }} %</b>
                                    </div>
                                    <b class="text-lg/none" :style="`color: ${styles.mainMenuStyleOptions?.itemListOptions.accentColor};`">
                                        {{ Intl.NumberFormat(locale).format(item.price * (1 - (item.discountActive ? item.discountPercentage : 0) / 100)) }}
                                    </b>
                                </div>
                                <span class="text-xs opacity-75" :style="`color: ${styles.mainMenuStyleOptions?.itemListOptions.textColor};`">
                                    {{ restaurantInfo.brand.currency }}
                                </span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>

            <hr class="w-full border-0 border-b-2 border-dashed border-neutral-500 bg-opacity-25" />
        </div>
    </DrawerDialog>
</template>

<script setup>
import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { useOrdersStore } from "@/stores/orders";
import { storeToRefs } from "pinia";

const { locale } = useI18n();
const stylesStore = useStylesStore();
const infoStore = useInfoStore();
const ordersStore = useOrdersStore();

const { styles } = storeToRefs(stylesStore);
const { restaurantInfo } = storeToRefs(infoStore);
const { orderItems } = storeToRefs(ordersStore);

// TODO : sold out items can not have add item button (they should show the sold out tag)
// TODO : orders must be saved in local-storage base on the brand name (users may visit other places) (this must be time based for like 24 hours thing)
// TODO : upon changing branches.. the items that are in orders and not in that branch must be deleted
// TODO : placeholder for empty cart
// TODO : total price calculation

const actionLock = ref(false);
let actionLockTimeout;
const updateActionLock = (lck) => {
    actionLock.value = lck;
    clearTimeout(actionLockTimeout);
    actionLockTimeout = setTimeout(() => (actionLock.value = false), 800);
};
const scrolling = (e) => {
    if (e.target.scrollTop < 5) updateActionLock(false);
    else updateActionLock(true);
};
</script>
