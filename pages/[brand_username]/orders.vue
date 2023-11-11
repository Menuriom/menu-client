<style scoped></style>

<template>
    <DrawerDialog :baseColors="styles.baseColors" :options="styles.itemsDialogStyleOptions" :actionLock="actionLock">
        <div
            class="flex flex-col items-center gap-4 p-6 w-full overflow-auto"
            :style="`color: ${styles.itemsDialogStyleOptions.textColor}`"
            @scroll="scrolling($event)"
        >
            <header class="flex flex-wrap items-center justify-between gap-2 w-full" v-if="orderItems.size">
                <h1 class="font-bold">{{ $t("Orders List") }}</h1>
                <button class="text-xxs underline underline-offset-2 opacity-75" @click="clearList()">
                    {{ $t("Clear list") }}
                </button>
            </header>
            <ul class="flex flex-col gap-2 w-full" :class="{ 'pe-1.5': orderItems.size > 2 }" v-if="orderItems.size">
                <li
                    class="relative flex items-start gap-3 w-full p-3 rounded-lg border border-neutral-500 border-opacity-10 shadow-nr15"
                    :style="`margin-top: ${styles.mainMenuStyleOptions?.itemListOptions.imageMargin / 8}rem;
                    background-color: ${styles.mainMenuStyleOptions?.itemListOptions.bgMainColor};
                    border-radius: ${styles.mainMenuStyleOptions?.itemListOptions.cornerRadius}px;`"
                    v-for="([, { item, variant, sideItems, count }], i) in orderItems"
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
                            <div class="flex items-center gap-2">
                                <button
                                    class="flex items-center justify-center w-7 h-7 p-1 rounded-full shadow-nr15 transition-all hover:scale-125 shrink-0"
                                    :style="`background-color: ${styles.mainMenuStyleOptions?.itemListOptions.primaryColor};`"
                                    @click="addItem(item, variant, sideItems)"
                                >
                                    <Icon
                                        class="w-4 h-4 shrink-0"
                                        :style="`background-color: ${styles.mainMenuStyleOptions?.itemListOptions.textColor};`"
                                        name="plus.svg"
                                        folder="icons/tabler"
                                        size="16px"
                                    />
                                </button>
                                <span class="text-lg w-3 text-center" :style="`color: ${styles.mainMenuStyleOptions?.itemListOptions.textColor};`">
                                    {{ Intl.NumberFormat(locale).format(count) }}
                                </span>
                                <button
                                    class="flex items-center justify-center w-7 h-7 p-1 rounded-full shadow-nr15 transition-all hover:scale-125 shrink-0"
                                    :style="`background-color: ${styles.mainMenuStyleOptions?.itemListOptions.primaryColor};`"
                                    @click="subItem(item)"
                                >
                                    <Icon
                                        class="w-4 h-4 shrink-0"
                                        :style="`background-color: ${styles.mainMenuStyleOptions?.itemListOptions.textColor};`"
                                        :name="`${count > 1 ? 'minus' : 'trash'}.svg`"
                                        folder="icons/tabler"
                                        size="16px"
                                    />
                                </button>
                            </div>
                            <div class="flex items-end gap-1 text-base/none">
                                <div class="flex flex-col gap-1.5">
                                    <div class="relative flex flex-wrap items-center" v-if="item.discountActive">
                                        <small class="line-through line" :style="`color: ${styles.mainMenuStyleOptions?.itemListOptions.textColor};`">
                                            {{ Intl.NumberFormat(locale).format(itemPrice(item, variant, sideItems) * count) }}
                                        </small>
                                        <b class="absolute -end-7 text-xs bg-rose-400 bg-opacity-75 px-1 rounded-md">{{ item.discountPercentage }} %</b>
                                    </div>
                                    <b class="text-lg/none" :style="`color: ${styles.mainMenuStyleOptions?.itemListOptions.accentColor};`">
                                        {{
                                            Intl.NumberFormat(locale).format(
                                                itemPrice(item, variant, sideItems) * count * (1 - (item.discountActive ? item.discountPercentage : 0) / 100)
                                            )
                                        }}
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

            <div class="flex flex-col items-center gap-3 w-full" v-if="orderItems.size">
                <hr class="w-full border-0 border-b-2 border-dashed border-neutral-500 border-opacity-50" />
                <div class="flex flex-col gap-2 w-full">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-xs opacity-75">{{ $t("Total") }}</span>
                        <div class="flex items-baseline gap-1">
                            <b class="text-sm opacity-80">{{ Intl.NumberFormat(locale).format(pricePack.total) }}</b>
                            <span class="text-xs opacity-75" :style="`color: ${styles.baseColors?.textColor};`">
                                {{ restaurantInfo.brand.currency }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-xs opacity-75">{{ $t("Discount") }}</span>
                        <div class="flex items-baseline gap-1">
                            <b class="text-sm opacity-80">{{ Intl.NumberFormat(locale).format(pricePack.discount) }}</b>
                            <span class="text-xs opacity-75" :style="`color: ${styles.baseColors?.textColor};`">
                                {{ restaurantInfo.brand.currency }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-xs opacity-75">{{ $t("Tax and fees") }}</span>
                        <div class="flex items-baseline gap-1">
                            <b class="text-sm opacity-80">{{ Intl.NumberFormat(locale).format(taxAndFees) }}</b>
                            <span class="text-xs opacity-75" :style="`color: ${styles.baseColors?.textColor};`">
                                {{ restaurantInfo.brand.currency }}
                            </span>
                        </div>
                    </div>
                    <hr class="w-full mt-1 border border-neutral-500 border-opacity-20" />
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span>{{ $t("Payable Total") }}</span>
                        <div class="flex items-baseline gap-1">
                            <b class="text-lg" :style="`color: ${styles.mainMenuStyleOptions?.itemListOptions.accentColor};`">
                                {{ Intl.NumberFormat(locale).format(pricePack.total + taxAndFees - pricePack.discount) }}
                            </b>
                            <span class="text-xs opacity-75" :style="`color: ${styles.baseColors?.textColor};`">
                                {{ restaurantInfo.brand.currency }}
                            </span>
                        </div>
                    </div>
                </div>
                <hr class="w-full border-0 border-b-2 border-dashed border-neutral-500 border-opacity-50" />
                <h3>{{ $t("Ordering online coming soon") }}...</h3>
            </div>

            <div class="relative flex items-center justify-center flex-col gap-4 w-full my-6" v-if="!orderItems.size">
                <img class="absolute w-60 mix-blend-difference opacity-10" src="~/assets/images/bg.svg" alt="" />
                <img class="w-32 opacity-80" src="~/assets/images/note2.png" alt="" />
                <p class="text-xl/none opacity-50 font-bold">{{ $t("The List Is Empty") }}</p>
            </div>
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

// TODO : upon changing branches.. the items that are in orders and not in that branch must be deleted

const itemPrice = (item, variant = {}, toppings = new Set()) => {
    let itemPrice = variant.price ?? item.price;
    for (const topping of toppings) itemPrice += topping.price || 0;
    return itemPrice;
};

const pricePack = computed(() => {
    return ordersStore.calculateTotal();
});
const taxAndFees = computed(() => {
    return ordersStore.getTaxAndFees();
});

const addItem = (item, variant, sideItems) => {
    ordersStore.addOrderItem({ item: item, variant: variant, sideItems: sideItems });
};
const subItem = (item) => {
    ordersStore.removeOrderItem({ item: item });
};
const clearList = () => {
    ordersStore.resetOrders();
};

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
