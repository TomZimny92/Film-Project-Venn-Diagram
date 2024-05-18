// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  runtimeConfig: {
    accessToken: process.env.MOVIE_DB_ACCESS_TOKEN,
    apiKey: process.env.MOVIE_DB_API_KEY,
    baseUrl: process.env.MOVIE_DB_BASE_URL,
    imageBaseUrl: process.env.MOVIE_DB_IMAGE_BASE_URL
  },
  modules: ['@nuxtjs/tailwindcss'],

  tailwindcss: {
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: "first" }],
    configPath: 'tailwind.config.js',
    exposeConfig: {
      level: 2
    },
    config: {},
    viewer: true,
}
})
