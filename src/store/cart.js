export default {
  namespaced: true,
  state: {
    items: [],
    totalItems: 0,
  },
  mutations: {
    addToCart(state, payload) {
      state.items.push(payload);
    },
    removeFromCart(state, index) {
      state.items.splice(index, 1);
    },
    resetCart(state) {
      state.items = [];
      state.totalItems = 0;
    },
  },
  actions: {
    addItemToCart({ commit }, payload) {
      commit("addToCart", payload);
    },
    removeItemFromCart({ commit }, index) {
      commit("removeFromCart", index);
    },
    resetCart({ commit }) {
      commit("resetCart");
    },
  },
  getters: {
    cartItems(state) {
      return state.items;
    },
  },
};
