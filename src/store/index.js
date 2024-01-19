import Vue from "vue";
import Vuex from "vuex";
import utils from "./utils";
import cart from "./cart";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    utils,
    cart,
  },
});
