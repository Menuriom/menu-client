<style scoped></style>

<template>
    <FloatDialog :baseColors="styles.baseColors" :options="styles.itemsDialogStyleOptions">
        <section class="flex flex-col items-center justify-center gap-4 p-2 my-6" :style="`color: ${styles.itemsDialogStyleOptions.textColor};`">
            <h1 class="text-2xl font-bold">{{ $t("Call The Waiter") }}</h1>
            <div
                class="w-28 p-4 border border-neutral-500 border-opacity-20 shadow-inner"
                :style="`border-radius: ${styles.itemsDialogStyleOptions.cornerRadius}px;`"
            >
                <img class="w-full aspect-square object-contain drop-shadow-sm" src="~/assets/images/bell.png" alt="bell" />
            </div>
            <p class="text-sm opacity-75 max-w-xs text-center">{{ $t("Enter your table number in order to call the waiter") }}</p>
            <div class="flex flex-wrap items-center gap-2">
                <input
                    class="p-3 outline-none text-center w-40"
                    :style="`border-radius: ${styles.itemsDialogStyleOptions.cornerRadius - 10}px;
                    background-color: ${styles.mainMenuStyleOptions?.searchOptions?.bgSecondaryColor};`"
                    type="text"
                    name="table"
                    :placeholder="$t('Table Number')"
                    inputmode="numeric"
                />
                <button
                    class="p-3 shadow-nr25"
                    :style="`border-radius: ${styles.itemsDialogStyleOptions.cornerRadius - 10}px; background-color: ${styles.baseColors.primaryColor};`"
                >
                    <Icon
                        class="w-5 h-5 shrink-0"
                        :style="`background-color: ${styles.itemsDialogStyleOptions.textColor};`"
                        name="bell-ringing.svg"
                        folder="icons/tabler"
                        size="20px"
                    />
                </button>
            </div>
        </section>
    </FloatDialog>
</template>

<script setup>
import { useStylesStore } from "@/stores/styles";
import { useInfoStore } from "@/stores/info";
import { storeToRefs } from "pinia";

useHead({ title: `Login And Register` });

const stylesStore = useStylesStore();
const infoStore = useInfoStore();

const { styles } = storeToRefs(stylesStore);
</script>
