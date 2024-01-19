import Vue from "vue";
import VueRouter from "vue-router";
import HomeView from "./views/HomeView/index.vue";
import ProductsView from "./views/ProductsView/index.vue";
import ShoppingView from "./views/ShoppingView/index.vue";
import RequestsView from "./views/RequestsView/index.vue";
Vue.use(VueRouter);

const routes = [
  { path: "/", component: HomeView },
  { path: "/produtos", component: ProductsView },
  { path: "/pedidos", component: RequestsView },
  { path: "/:userId/compras", component: ShoppingView },
];

const router = new VueRouter({
  mode: "history", // Define o modo de histórico de navegação
  routes,
});

export default router;
