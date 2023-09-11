// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devServer: { port: 3002 },
    devtools: { enabled: false },

    app: {
        head: {},
        pageTransition: { name: "page", mode: "out-in", type: "transition", appear: true },
        layoutTransition: { name: "page", mode: "out-in", type: "transition", appear: true },
    },

    css: [
        // "vue-toastification/dist/index.css",
        "~/assets/css/styles.css",
    ],

    i18n: {
        strategy: "no_prefix",
        baseUrl: process.env.BASE_URL,
        defaultLocale: "fa",
        defaultDirection: "ltr",
        lazy: true,
        langDir: "locale",
        detectBrowserLanguage: {
            cookieKey: "i18n_redirected",
            redirectOn: "root",
            fallbackLocale: "fa",
        },
        locales: [
            { code: "fa", name: "فارسی", iso: "fa-IR", files: ["fa.ts"], dir: "rtl" },
            { code: "en", name: "English", iso: "en-US", files: ["en.ts"], dir: "ltr" },
        ],
        vueI18n: "./i18n.config.ts",
    },

    modules: [
        // ...
        "@nuxtjs/tailwindcss",
        "@nuxtjs/i18n",
        "nuxt-swiper",
        "@pinia/nuxt",
    ],
});
