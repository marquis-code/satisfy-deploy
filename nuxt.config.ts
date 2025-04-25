export default {
  ssr: false,
  target: "static",
  app: {
    head: {
      title: "Satisfy",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.svg" },
        { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/driver.js/dist/driver.min.css' }
      ],
      script: [
        {
          src: "https://newwebpay.qa.interswitchng.com/inline-checkout.js",
          defer: true,
        },

      ]
    },
  },
  modules: ["@nuxtjs/tailwindcss"],
  css: ["/assets/css/main.css"],

  tailwindcss: {
    cssPath: "@/assets/css/main.css",
  },
  build: {
    transpile: ["@pdftron/webviewer", 'vee-validate'],
  },
  axios: {
    timeout: 10000, // Example: set timeout to 10 seconds
    // Axios options here
  },

  plugins: [],

  vite: {
    optimizeDeps: {
      include: ['fast-deep-equal']
    },
    server: {
      port: 3001
      // fs: {
      //   allow: ["public/lib"],
      // },
    },
  },


  compatibilityDate: "2024-09-30"
};
