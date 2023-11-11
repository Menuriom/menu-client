<style scoped>
/* *::-webkit-scrollbar {
    width: 0px;
    height: 0px;
}
* {
    scrollbar-width: none;
} */

.swiper-slide {
    width: auto;
    /* max-width: 4.5rem; */
    display: flex !important;
}

.insta-gradient {
    background-image: linear-gradient(87.28deg, #e2d55a -2.39%, #cb30e5 36.32%, rgba(248, 65, 163, 0.88) 75.04%, rgba(235, 97, 97, 0.94) 109.79%);
    background-image: linear-gradient(60deg, rgba(180, 119, 221, 1) 0%, rgba(224, 57, 57, 1) 55%, rgba(250, 202, 135, 1) 100%);

    background: radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #6328eb 90%);
}
</style>

<template>
    <div class="flex flex-col items-center justify-start gap-8 w-full h-full overflow-auto p-6 mt-6 isolate" @scroll="scrolling">
        <div class="absolute bottom-0 w-[110%] max-w-lg h-full overflow-hidden">
            <div
                class="pattern-bg absolute bottom-0 -z-10 w-full aspect-square pointer-events-none"
                :style="`
                    background-image: url('${options.bgImage}');
                    background-size: clamp(50px, ${options.bgImageSize}%, 360px);
                    background-color: ${options.bgMainColor};
                    opacity: ${options.bgImageOpacity / (options.frameComponent == 'Frame1' ? 5 : 1)}%; rotate: ${options.bgImageRotation}deg;`"
                v-if="options.withPattern"
            ></div>
        </div>

        <div class="flex flex-col items-center gap-4">
            <div
                class="flex items-center justify-center w-28 h-28 p-4 shadow-mr25"
                :style="`background-color: ${options.bgSecondaryColor}; border-radius: ${options.cornerRadius}px;`"
            >
                <img
                    class="w-full h-full object-contain shadow-mr15"
                    :style="`border-radius: ${options.cornerRadius}px;`"
                    :src="restaurantInfo.brand?.logo"
                    alt=""
                />
            </div>
            <div class="flex flex-col items-center gap-0.5">
                <h3 class="font-bold text-xl" :style="`color: ${options.textColor};`">
                    {{ restaurantInfo.brand?.translation?.[locale]?.name || restaurantInfo.brand?.name }}
                </h3>
                <small class="opacity-60 text-xxs" :style="`color: ${options.textColor};`">
                    {{ restaurantInfo.brand?.translation?.[locale]?.slogan || restaurantInfo.brand?.slogan }}
                </small>
            </div>
        </div>

        <Swiper class="w-auto max-w-full h-auto shrink-0" wrapper-tag="ul" :auto-height="true" slides-per-view="auto" :dir="localeProperties.dir">
            <SwiperSlide
                tag="li"
                class="flex items-center gap-1 p-2 mx-1.5 shadow-nr15 border-2 rounded-md"
                :style="`background-color: ${selectedBranch == i ? '#fff2' : options.bgMainColor}; border-radius: ${options.cornerRadius}px;
                border-color:${selectedBranch == i ? options.primaryColor : '#9994'}`"
                v-for="(branch, i) in restaurantInfo.branches"
                @click="selectedBranch = i"
            >
                <Icon class="w-4 h-4 shrink-0 bg-red-400" name="map-pin-filled.svg" folder="icons/tabler" size="16px" />
                <span class="text-xs opacity-90 me-1" :style="`color: ${options.textColor};`">
                    {{ branch.translation?.[locale]?.name || branch.name }}
                </span>
            </SwiperSlide>
        </Swiper>

        <div
            class="flex flex-col items-center gap-3 w-full max-w-sm p-2 rounded-lg border border-neutral-500 border-opacity-20 backdrop-blur-sm"
            :style="`border-radius: ${options.cornerRadius > 16 ? 16 : options.cornerRadius}px;`"
        >
            <h3 class="flex items-center gap-1 w-full">
                <span class="bg-white bg-opacity-20 w-0.5 h-0.5 grow"></span>
                <Icon class="w-5 h-5 shrink-0" :style="`background-color: ${options.textColor};`" name="building-store.svg" folder="icons/tabler" size="20px" />
                <span :style="`color: ${options.textColor};`">{{ $t("Working Hours") }}</span>
                <span class="bg-white bg-opacity-20 w-0.5 h-0.5 grow"></span>
            </h3>

            <!-- <span class="text-sm" :style="`color: ${options.textColor};`">
                <b :style="`color: ${options.bgSecondaryColor};`">Sunday</b>
                through
                <b :style="`color: ${options.bgSecondaryColor};`">Friday</b>
            </span>
            <span class="text-sm" :style="`color: ${options.textColor};`" dir="ltr">
                <b :style="`color: ${options.bgSecondaryColor};`">9:00</b> AM - <b :style="`color: ${options.bgSecondaryColor};`">12:00</b> PM
            </span> -->

            <div
                class="flex flex-col items-center gap-1 w-full p-2"
                :style="`background-color: ${options.primaryColor}; color: ${options.textColor};
                border-radius: ${options.cornerRadius > 10 ? 10 : options.cornerRadius}px;`"
                v-for="(group, i) in workingHours"
                :key="i"
                v-show="group.open"
            >
                <div class="flex flex-wrap items-center justify-center gap-1 text-xs">
                    <span class="bg-black bg-opacity-20 p-1 px-1.5 rounded-md" v-for="day in group.days">{{ $t(day) }}</span>
                </div>

                <div class="flex items-center justify-center gap-1 w-full font-bold" :style="`color: ${options.bgMainColor};`" dir="ltr" v-if="group.clock">
                    <i class="w-2.5 h-2.5 rounded-full" :style="`background-color: ${options.accentColor};`"></i>
                    {{ group.clock }}
                    <i class="w-2.5 h-2.5 rounded-full" :style="`background-color: ${options.accentColor};`"></i>
                </div>
            </div>
        </div>

        <p class="text-sm -mb-4 opacity-80" :style="`color: ${options.textColor};`">{{ restaurantInfo.branches[selectedBranch].address }}</p>

        <div class="flex flex-col items-center gap-2" :style="`color: ${options.textColor};`">
            <a class="text-lg/none" :href="`tel:${tel.trim()}`" dir="ltr" v-for="(tel, i) in restaurantInfo.branches[selectedBranch].telephoneNumbers">
                <span :style="`color: ${options.textColor};`">{{ tel }}</span>
            </a>
        </div>

        <div class="flex flex-wrap items-center gap-4">
            <a
                class="flex items-center gap-1 text-sm"
                :style="`color: ${options.textColor};`"
                :href="`${socialsBaseLinks[key]}${link}`"
                target="_blank"
                v-for="(link, key) in restaurantInfo.brand?.socials"
            >
                <!-- <img class="w-6 h-6" width="24px" src="/socials/instagram.png" alt="" /> -->
                <Icon
                    class="w-8 h-8 shrink-0"
                    :style="`background-color: ${options.accentColor};`"
                    :name="`brand-${key}.svg`"
                    folder="icons/tabler"
                    size="32px"
                />
            </a>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    restaurantInfo: { type: Object },
    options: { type: Object },
    // baseColors: { type: Object },
});

const emit = defineEmits(["innerAction"]);

const { locale, localeProperties } = useI18n();

// TODO edit these links to match/work
const socialsBaseLinks = ref({
    instagram: "https://instagram.com/",
    twitter: "https://twitter.com/",
    telegram: "https://t.me/",
    whatsapp: "https://whatsapp.com/",
});

const selectedBranch = ref(0);

const workingHours = ref(props.restaurantInfo.workingHours[props.restaurantInfo.branches[0]._id] || props.restaurantInfo.workingHours["all"]);
watch(selectedBranch, (branchIndex) => {
    workingHours.value = props.restaurantInfo.workingHours[props.restaurantInfo.branches[branchIndex]._id] || props.restaurantInfo.workingHours["all"];
});

const scrolling = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.target.scrollTop < 5) emit("innerAction", false);
    else emit("innerAction", true);
};
</script>
