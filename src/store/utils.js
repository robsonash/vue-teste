export default {
  namespaced: true,
  state: {
    navBarItems: [
      { id: 1, text: "Usuários", icon: "mdi mdi-home-account", link: "/" },
      {
        id: 2,
        text: "Produtos",
        icon: "mdi mdi-package-variant-closed",
        link: "/produtos",
      },
      { id: 3, text: "Pedidos", icon: "mdi mdi-list-status", link: "/pedidos" },
    ],
  },
};
