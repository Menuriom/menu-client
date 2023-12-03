<style scoped></style>

<template>
    <component
        :is="frames[styles.itemsDialogStyleOptions?.frameComponent]"
        :baseColors="styles.baseColors"
        :options="styles.itemsDialogStyleOptions"
        :actionLock="actionLock"
    >
        <Head>
            <Title>{{ item.translation?.[locale]?.name || item.name }}</Title>
        </Head>
        <div class="flex flex-col items-center gap-4 p-6 w-full" :style="`color: ${styles.itemsDialogStyleOptions.textColor}`">
            <h1 class="font-bold text-lg">{{ $t("Customers Comments") }}</h1>
            <div
                class="relative flex flex-wrap items-center gap-2 w-full p-4 border border-neutral-500 border-opacity-20 overflow-hidden isolate"
                :style="`border-radius: ${styles.itemsDialogStyleOptions.cornerRadius}px;`"
            >
                <span class="absolute inset-0 rounded-lg -z-10 opacity-10" :style="`background-color: ${styles.baseColors.primaryColor};`"></span>
                <div class="relative p-1 isolate">
                    <span class="absolute inset-0 rounded-lg -z-10 opacity-40" :style="`background-color: ${styles.baseColors.bgSecondaryColor};`"></span>
                    <img class="w-16" :src="item.images[0]" width="64" height="64" alt="" />
                </div>
                <h3 class="grow">{{ item.translation?.[locale]?.name || item.name }}</h3>
                <div class="flex flex-col gap-1 text-base/none">
                    <div class="flex flex-wrap items-center gap-1.5" :style="`color: ${styles.baseColors.textColor};`" v-if="item.discountActive">
                        <small class="line-through line">
                            {{ Intl.NumberFormat(locale).format(item.price) }}
                        </small>
                        <span class="text-xs bg-rose-400 bg-opacity-75 px-1 rounded-md">{{ item.discountPercentage }}%</span>
                    </div>
                    <div class="flex flex-wrap items-end gap-1">
                        <b class="f-inter text-xl/none" :style="`color: ${styles.baseColors.accentColor};`">
                            {{ Intl.NumberFormat(locale).format(item.price * (1 - (item.discountActive ? item.discountPercentage : 0) / 100)) }}
                        </b>
                        <span class="text-xs opacity-75" :style="`color: ${styles.baseColors.textColor};`">
                            {{ restaurantInfo.brand.currency }}
                        </span>
                    </div>
                </div>
            </div>
            <ul class="flex flex-col gap-6 w-full overflow-auto select-none pe-4" style="max-height: calc(100vh - 18rem)" @scroll="scrolling($event)">
                <li class="flex flex-col gap-2 w-full rounded-md" v-for="comment in sampleComments">
                    <div class="flex flex-wrap items-center justify-between gap-2 w-full">
                        <h4 class="text-sm p-1 px-2 rounded-md bg-white bg-opacity-10">{{ comment.name }}</h4>
                        <span class="w-0.5 h-0.5 opacity-20 grow" :style="`background-color: ${styles.baseColors.primaryColor};`"></span>
                        <span class="text-xs">{{ new Date(comment.date).toLocaleString(locale, { dateStyle: "long" }) }}</span>
                    </div>
                    <p class="text-sm opacity-75">{{ comment.text }}</p>
                </li>
            </ul>
        </div>
    </component>
</template>

<script setup>
import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { useItemsStore } from "@/stores/items";
import { storeToRefs } from "pinia";

const { locale } = useI18n();
const route = useRoute();

const frames = {
    Frame1: defineAsyncComponent(() => import("@/components/FloatDialog.vue")),
    Frame2: defineAsyncComponent(() => import("@/components/DrawerDialog.vue")),
};

const sampleComments = ref([
    {
        name: "John Doe",
        text: "This product is amazing! I highly recommend it.",
        date: "2022-01-15T00:00:00.000Z",
    },
    {
        name: "Jane Smith",
        text: "I had some issues with the delivery, but the customer support was helpful and resolved it quickly.",
        date: "2022-02-28T00:00:00.000Z",
    },
    {
        name: "David Johnson",
        text: "The quality of this item is top-notch. I'm really impressed.",
        date: "2022-03-07T00:00:00.000Z",
    },
    {
        name: "Emily Davis",
        text: "I've been using this product for a month now, and it has exceeded my expectations.",
        date: "2022-04-12T00:00:00.000Z",
    },
    {
        name: "Michael Wilson",
        text: "The price is a bit high, but the features justify it. Worth the investment.",
        date: "2022-05-06T00:00:00.000Z",
    },
    {
        name: "Olivia Taylor",
        text: "The user interface is intuitive and easy to navigate. Great job!",
        date: "2022-06-19T00:00:00.000Z",
    },
    {
        name: "Daniel Anderson",
        text: "I had some compatibility issues with my device, but the support team helped me troubleshoot and resolve them.",
        date: "2022-07-02T00:00:00.000Z",
    },
    {
        name: "Sophia Martinez",
        text: "The product arrived in perfect condition, and the packaging was impressive.",
        date: "2022-08-14T00:00:00.000Z",
    },
    {
        name: "William Taylor",
        text: "I'm really satisfied with the performance of this product. It has made my life much easier.",
        date: "2022-09-25T00:00:00.000Z",
    },
    {
        name: "Ava Jackson",
        text: "The customer service was fantastic. They were attentive and resolved my issue promptly.",
        date: "2022-10-30T00:00:00.000Z",
    },
    {
        name: "James Thomas",
        text: "I've recommended this product to all my friends. It's that good!",
        date: "2022-11-17T00:00:00.000Z",
    },
    {
        name: "Mia Anderson",
        text: "The product exceeded my expectations. It's definitely worth the price.",
        date: "2022-12-29T00:00:00.000Z",
    },
    {
        name: "Benjamin Thompson",
        text: "I had some concerns before purchasing, but the customer reviews convinced me, and I'm glad I bought it.",
        date: "2023-01-08T00:00:00.000Z",
    },
    {
        name: "Charlotte Davis",
        text: "The shipping was fast, and the product arrived earlier than expected. Very impressed!",
        date: "2023-02-21T00:00:00.000Z",
    },
    {
        name: "Alexander Wilson",
        text: "I'm a long-time customer, and this brand never disappoints. Great quality as always.",
        date: "2023-03-15T00:00:00.000Z",
    },
    {
        name: "Sofia Lewis",
        text: "The product description was accurate, and it functions exactly as described.",
        date: "2023-04-27T00:00:00.000Z",
    },
    {
        name: "Joseph White",
        text: "I had some technical difficulties initially, but the support team guided me through the troubleshooting process.",
        date: "2023-05-11T00:00:00.000Z",
    },
    {
        name: "Amelia Harris",
        text: "The product is lightweight and portable, which makes it perfect for my needs.",
        date: "2023-06-23T00:00:00.000Z",
    },
]);

const stylesStore = useStylesStore();
const { styles } = storeToRefs(stylesStore);

const infoStore = useInfoStore();
const { restaurantInfo } = storeToRefs(infoStore);

const itemsStore = useItemsStore();
const { menuItems } = storeToRefs(itemsStore);

// get the item --------------------------------------------
const item = ref();
if (process.client && !item.value) {
    try {
        item.value = JSON.parse(localStorage.getItem("item"));
    } catch {}
}
if (!item.value) {
    const getMenuItem = await useFetch(`/api/v1/menu-info/menu-item/${route.query.i}`, {
        headers: { brand: route.params.brand_username },
        lazy: process.client,
        immediate: true,
    });
    if (getMenuItem.error.value) console.error(getMenuItem.error.value);
    if (getMenuItem.data.value) item.value = getMenuItem.data.value;
}
// -------------------------------------------------

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
