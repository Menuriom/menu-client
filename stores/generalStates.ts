import { defineStore } from "pinia";

export const useGeneralStore = defineStore("generalStates", () => {
    const popUpOpened: Ref<String> = ref("");

    const resetInfo = () => {
        popUpOpened.value = "";
    };

    const openPopUp = (title: string) => (popUpOpened.value = title);
    const closePopUp = () => (popUpOpened.value = "");

    return {
        popUpOpened,
        resetInfo,
        openPopUp,
        closePopUp,
    };
});
