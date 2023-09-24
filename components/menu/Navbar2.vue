<template>
    <div
        class="sticky bottom-2 flex items-center gap-8 py-3 px-6 rounded-lg shadow-nr35"
        :style="`background-color: ${options.bgMainColor}; border-radius: ${options.radius}px;`"
    >
        <nuxt-link
            class="flex flex-col items-center justify-center gap-1 rounded-full transition-all hover:scale-125 hover:rotate-6"
            :to="localePath(`/${route.params.brand_id}/server-call`)"
        >
            <Icon class="w-7 h-7 shrink-0" :style="`background-color: ${options.textColor};`" name="bell-ringing.svg" folder="icons/tabler" size="28px" />
            <small class="text-xxs opacity-75 -mb-1" :style="`color: ${options.textColor};`" v-if="options.withText">{{ $t("Waiter") }}</small>
        </nuxt-link>
        <nuxt-link
            class="flex flex-col items-center justify-center gap-1 rounded-full transition-all hover:scale-125 hover:-rotate-6"
            :to="localePath(`/${route.params.brand_id}/store-info`)"
        >
            <Icon class="w-7 h-7 shrink-0" :style="`background-color: ${options.primaryColor};`" name="building-store.svg" folder="icons/tabler" size="28px" />
            <small class="text-xxs opacity-75 -mb-1" :style="`color: ${options.textColor};`" v-if="options.withText">{{ $t("Store Info") }}</small>
        </nuxt-link>
        <nuxt-link
            class="relative flex flex-col items-center justify-center gap-1 rounded-full transition-all hover:scale-125 hover:rotate-6"
            :to="localePath(`/${route.params.brand_id}/orders`)"
        >
            <Icon class="w-7 h-7 shrink-0" :style="`background-color: ${options.textColor};`" name="receipt-2.svg" folder="icons/tabler" size="28px" />
            <small class="text-xxs opacity-75 -mb-1" :style="`color: ${options.textColor};`" v-if="options.withText">{{ $t("Orders") }}</small>
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
});

const { locale } = useI18n();
const route = useRoute();
const localePath = useLocalePath();
const ordersStore = useOrdersStore();
</script>
