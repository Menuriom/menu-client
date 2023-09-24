<template>
    <div class="sticky bottom-4 flex items-center gap-5 px-1 mt-4 h-12 rounded-full shadow-nr35" :style="`background-color: ${options.bgMainColor};`">
        <nuxt-link
            class="flex items-center justify-center w-10 h-10 rounded-full group"
            :style="`background-color: ${options.bgSecondaryColor};`"
            :to="localePath(`/${route.params.brand_id}/server-call`)"
        >
            <Icon
                class="w-7 h-7 shrink-0 transition-all group-hover:scale-125 group-hover:rotate-6"
                :style="`background-color: ${options.textColor};`"
                name="bell-ringing.svg"
                folder="icons/tabler"
                size="28px"
            />
        </nuxt-link>
        <nuxt-link
            class="flex items-center justify-center rounded-full group"
            :class="[border ? 'w-16 h-16 border-4' : 'w-14 h-14']"
            :style="`background-color: ${options.bgSecondaryColor}; border-color: ${options.bgMainColor};`"
            :to="localePath(`/${route.params.brand_id}/store-info`)"
        >
            <Icon
                class="w-7 h-7 shrink-0 transition-all group-hover:scale-125 group-hover:-rotate-6"
                :style="`background-color: ${options.primaryColor};`"
                name="building-store.svg"
                folder="icons/tabler"
                size="28px"
            />
        </nuxt-link>
        <nuxt-link
            class="relative flex items-center justify-center w-10 h-10 rounded-full group"
            :style="`background-color: ${options.bgSecondaryColor};`"
            :to="localePath(`/${route.params.brand_id}/orders`)"
        >
            <Icon
                class="w-7 h-7 shrink-0 transition-all group-hover:scale-125 group-hover:rotate-6"
                :style="`background-color: ${options.textColor};`"
                name="receipt-2.svg"
                folder="icons/tabler"
                size="28px"
            />
            <span class="absolute top-0 -start-1 flex items-center justify-center w-4 h-4 bg-rose-500 text-white rounded-full text-xxs shadow-nr15">
                {{ Intl.NumberFormat(locale).format(ordersStore.orderItems.size) }}
            </span>
        </nuxt-link>
    </div>
</template>

<script setup>
import { useOrdersStore } from "@/stores/orders";

const props = defineProps({
    options: { type: Object },
    border: { type: Boolean, default: true },
});

const { locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const ordersStore = useOrdersStore();
</script>
