// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ["docus"],
  modules: ["@nuxt/ui"],
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/css/main.css"],
  colorMode: {
    preference: "light",
    fallback: "light",
  },
  mdc: {
    highlight: {
      theme: "github-dark-default",
    },
  },
});
