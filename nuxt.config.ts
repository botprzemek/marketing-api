import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2026-02-23",
    devtools: {
        enabled: true,

        timeline: {
            enabled: true,
        },
    },

    app: {
        rootTag: "main",
        rootAttrs: {
            id: "form",
        },
        head: {
            title: "Formularz zgłoszeniowy - SPIE ENERGOTEST Sp. z o.o.",
            htmlAttrs: {
                lang: "pl-PL",
            },
        },
    },

    runtimeConfig: {
        zammadUrl: "",
        zammadToken: "",
        zammadGroup: "",
        zammadAgent: "",
    },

    modules: ["@nuxt/fonts"],

    fonts: {
        defaults: {
            weights: [400, 600],
        },
    },

    vite: {
        // @ts-ignore
        plugins: [tailwindcss()],
    },

    css: ["./app/assets/css/main.css"],
});
