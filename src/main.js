import Vue from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import "@/plugins/axios";
import router from "./router";
import { api } from "@/plugins/axios.js";

import { VueMaskDirective } from "v-mask";
import store from "./store";
import VueIziToast from "vue-izitoast";
import "izitoast/dist/css/iziToast.css";

Vue.directive("mask", VueMaskDirective);

Vue.use(VueIziToast, { position: "topRight" });

Vue.config.productionTip = false;
Vue.prototype.$api = api;

new Vue({
  vuetify,
  render: (h) => h(App),
  store,
  router,
}).$mount("#app");
