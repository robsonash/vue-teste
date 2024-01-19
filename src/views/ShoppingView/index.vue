<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="page-product" class="c-container">
    <div class="c-container-table">
      <div class="c-add-user">
        <div class="c-container-icone">
          <span class="c-icone mdi mdi-shopping-search-outline"></span>
          <span class="c-container-icone-text">Compras</span>
        </div>
        <div :class="[{ disabled: listRequestDisabled }, 'c-button']">
          <v-btn
            class="c-container-button-cart"
            elevation="0"
            @click="cartView"
            :disabled="listRequestDisabled"
          >
            <span class="c-cart mdi mdi-cart-check"></span>
            <span class="cart-item-count">{{ cartItemCount }}</span>
          </v-btn>
        </div>
      </div>
      <Card :items="products.items" @clickCard="clickCard" />
    </div>
    <DefaultModal
      ref="ModalAddProduct"
      maxWidth="700"
      :title="modalAddProduct.title"
      :nameSendButton="modalAddProduct.nameSendButton"
      nameCancelButton="Cancelar"
      :loading="modalAddProduct.loading"
      :disabled="modalAddProduct.disabled"
      @cancel="resetForm"
      @send="sendProductCart"
      @clickOutside="resetForm"
    >
      <FormAddProduct
        ref="CFormAddProduct"
        class="c-shopping-body"
        :productItem="productSelect"
      />
    </DefaultModal>
    <DefaultModal
      ref="ModalListRequest"
      maxWidth="800"
      :title="modalListRequest.title"
      :nameSendButton="modalListRequest.nameSendButton"
      nameCancelButton="Cancelar"
      :loading="modalListRequest.loading"
      :disabled="modalListRequest.disabled"
      @cancel="closeModalListRequests"
      @send="addRequest"
      @clickOutside="closeModalListRequests"
    >
      <ListRequests
        ref="ListRequests"
        :cartItems="cart"
        @closeModalListRequests="closeModalListRequests"
      />
    </DefaultModal>
  </div>
</template>

<script>
import { getPersonById } from "@/services/People";
import { createRequest } from "@/services/Requests";
import { getAllProducts } from "@/services/Products";
import Card from "@/views/ShoppingView/Partials/Card/index";

import FormAddProduct from "@/views/ShoppingView/Partials/FormAddProduct/index";
import ListRequests from "@/views/ShoppingView/Partials/ListRequests/index";

import DefaultModal from "@/components/DefaultModal/DefaultModal";
export default {
  name: "ShoppingView",
  components: {
    DefaultModal,
    FormAddProduct,
    Card,
    ListRequests,
  },
  data() {
    return {
      cart: {
        headers: [],
        items: [],
      },
      products: {
        headers: [],
        items: [],
      },
      formProduct: false,
      modalAddProduct: {
        title: "",
        nameSendButton: "",
        loading: false,
        disabled: false,
      },

      modalListRequest: {
        title: "Carrinho de compras",
        nameSendButton: "Confirmar Compra",
        nameCancelButton: "",
        loading: false,
        disabled: false,
      },
      productSelect: {},
      tableLoading: false,
    };
  },
  mounted() {
    this.fetchData();
    this.$store.dispatch("cart/resetCart");
  },
  computed: {
    listRequestDisabled() {
      const itemCount = this.$store.getters["cart/cartItems"].length;
      return itemCount > 0 ? false : true;
    },
    cartItemCount() {
      const cartItems = this.$store.getters["cart/cartItems"];
      return cartItems.reduce((total, item) => {
        return total + item.quantidade;
      }, 0);
    },
    listRequests() {
      return this.$store.getters["cart/cartItems"];
    },
  },
  methods: {
    async fetchData() {
      try {
        this.tableLoading = true;
        const { data } = await getAllProducts();
        this.products.items = data;
        if (data.length > 0) {
          this.products.headers = this.formatHeaders(
            Object.keys(this.products.items[0])
          );
        }
        this.addActionsButtons();
        this.tableLoading = false;
      } catch (error) {
        this.tableLoading = false;
      }
    },
    formatHeaders(keys) {
      return keys.map((key) => ({
        text: this.formatHeaderText(key),
        value: key,
      }));
    },
    formatHeaderText(key) {
      const words = key.split(/(?=[A-Z])/);
      return words
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },

    addActionsButtons() {
      this.products.headers.push({
        text: "Ações",
        value: "acoes",
      });

      this.products.items.forEach((item) => {
        item.acoes = [
          { text: "Editar", action: () => this.editUser(item) },
          { text: "Excluir", action: () => this.deleteUser(item) },
        ];
      });
    },
    resetForm() {
      this.productSelect = {};
      this.$refs.ModalAddProduct.dialog = false;
    },
    clickCard(product) {
      this.modalAddProduct.title = "Adicionar produto ao carrinho";
      this.modalAddProduct.nameSendButton = "Adicionar";
      this.$refs.ModalAddProduct.dialog = true;
      this.$nextTick(() => {
        this.$set(this, "productSelect", product);
      });
    },
    cartView() {
      this.$refs.ModalListRequest.dialog = true;
    },
    closeModalListRequests() {
      this.$refs.ModalListRequest.dialog = false;
    },

    sendProductCart() {
      const amont = this.$refs.CFormAddProduct.amont;
      const { nome, descricao, valorUnitario, id } = this.productSelect;
      const subTotal = amont * valorUnitario;
      const payload = {
        id: id,
        nome: nome,
        descricao: descricao,
        valorUnitario: valorUnitario,
        quantidade: amont,
        subTotal: subTotal,
      };

      const existingItemIndex = this.$store.getters["cart/cartItems"].findIndex(
        (item) => {
          return item.nome === nome;
        }
      );

      if (existingItemIndex !== -1) {
        const existingItem =
          this.$store.getters["cart/cartItems"][existingItemIndex];
        existingItem.quantidade += amont;
        existingItem.subTotal += subTotal;
        this.$store.commit("cart/updateItemInCart", {
          index: existingItemIndex,
          item: existingItem,
        });
      } else {
        this.$store.dispatch("cart/addItemToCart", payload);
      }
      this.formatedListRequest();
      this.$refs.ModalAddProduct.dialog = false;
    },

    formatedListRequest() {
      this.cart.items = this.$store.getters["cart/cartItems"];

      if (this.cart.items.length > 0) {
        this.cart.headers = this.formatHeaders(Object.keys(this.cart.items[0]));
      }
    },
    async addRequest() {
      try {
        this.loadingDisabledRequest(true);

        const userId = this.$route.params.userId;
        const user = await getPersonById(userId);

        const pedido = {
          cliente: {
            id: user.data.id,
            nome: user.data.nome,
          },
          dataEmissao: this.getCurrentDate(),
          valorTotal: this.calculateTotalValue(),
          itens: this.cart.items.map((item, index) => ({
            id: index + 1,
            produto: {
              id: item.id,
              nome: item.nome,
            },
            valor: item.valorUnitario,
            quantidade: item.quantidade,
            subtotal: item.subTotal,
          })),
        };

        const response = await createRequest(pedido);
        if (response) {
          this.$toast.success("Pedido cadastrado com sucesso!", "Sucesso:", {
            position: "topRight",
          });
        }

        this.resetCart();
        this.loadingDisabledRequest(false);
      } catch (error) {
        this.$toast.error(error, "Erro:", {
          position: "topRight",
        });
        this.loadingDisabledRequest(false);
        this.resetCart();
      }
    },

    calculateTotalValue() {
      return this.cart.items.reduce((total, item) => {
        return total + item.subTotal;
      }, 0);
    },
    getCurrentDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // +1 porque janeiro é 0
      const day = String(today.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      return formattedDate;
    },
    resetCart() {
      this.$store.dispatch("cart/resetCart");
      this.$refs.ModalListRequest.dialog = false;
    },

    loadingDisabled(value) {
      this.modalAddProduct.loading = value;
      this.modalAddProduct.disabled = value;
    },
    loadingDisabledRequest(value) {
      this.modalListRequest.loading = value;
      this.modalListRequest.disabled = value;
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
