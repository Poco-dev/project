import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // <-- этот импорт должен работать

createApp(App).use(router).mount("#app");
