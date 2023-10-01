const cacheAge = 60 * 60 * 24 * 365; // 1 year

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

    nitro: {
        compressPublicAssets: true,
        routeRules: {
            "/flags/**": { headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
            "/icons/**": { headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
            "/patterns/**": { headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
            "/_nuxt/**": { headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
        },
    },

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
