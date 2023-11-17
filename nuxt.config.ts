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
            "/**/*.js": { swr: 60 * 60 * 12, isr: true, headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
            "/**/*.css": { swr: 60 * 60 * 12, isr: true, headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
            "/**/*.png": { swr: 60 * 60 * 12, isr: true, headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
            "/**/*.svg": { swr: 60 * 60 * 12, isr: true, headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
            "/**/*.jpg": { swr: 60 * 60 * 12, isr: true, headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
            "/**/*.webp": { swr: 60 * 60 * 12, isr: true, headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
            "/_nuxt/**": { swr: 60 * 60 * 12, isr: true, headers: { "cache-control": `public, max-age=${cacheAge}, s-maxage=${cacheAge}` } },
        },
    },

    routeRules: {},

    i18n: {
        strategy: "no_prefix",
        baseUrl: process.env.BASE_URL,
        defaultLocale: "fa",
        defaultDirection: "ltr",
        lazy: true,
        langDir: "locale",
        detectBrowserLanguage: false,
        // detectBrowserLanguage: {
        //     alwaysRedirect: false,
        //     cookieKey: "i18n_redirected",
        //     redirectOn: "root",
        //     fallbackLocale: "fa",
        // },
        locales: [
            { code: "fa", name: "فارسی", iso: "fa-IR", files: ["fa.ts"], dir: "rtl" },
            { code: "en", name: "English", iso: "en-US", files: ["en.ts"], dir: "ltr" },
        ],
        vueI18n: "./i18n.config.ts",
    },

    // delayHydration: {
    //     // enables nuxt-delay-hydration in dev mode for testing
    //     debug: process.env.NODE_ENV === "development",
    //     mode: "mount",
    // },

    modules: [
        // ...
        "@pinia/nuxt",
        "@nuxtjs/tailwindcss",
        "@nuxtjs/i18n",
        "nuxt-swiper",
        // "nuxt-delay-hydration",
    ],
});
