<template>
  <div>
    <DataTable
      :dense="false"
      :hideDefaultFooter="true"
      :disablePagination="true"
      :headers="formattedCartItems.headers"
      :items="formattedCartItems.items"
      :templateSearch="false"
      :showMoreButtons="true"
    />
  </div>
</template>

<script>
import DataTable from "@/components/DataTable/DataTable";
import { formatCurrency } from "@/utils/FormatCurrency";
export default {
  name: "ListRequests",
  components: {
    DataTable,
  },
  props: {
    cartItems: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    formattedCartItems() {
      const headers = this.cartItems.headers.map((headers) => {
        return {
          ...headers,
        };
      });
      const items = this.cartItems.items.map((itemsCart) => {
        return {
          ...itemsCart,
          subTotal: formatCurrency(itemsCart.subTotal),
          valorUnitario: formatCurrency(itemsCart.valorUnitario),
        };
      });

      headers.push({
        text: "Ação",
        value: "acoes",
      });

      items.forEach((item) => {
        item.acoes = [
          { text: "Excluir", action: () => this.deleteItemCart(item) },
        ];
      });

      return {
        headers,
        items,
      };
    },
  },
  methods: {
    formatCurrency,
    deleteItemCart(index) {
      this.$store.dispatch("cart/removeItemFromCart", index);

      const cartIsEmpty = this.$store.getters["cart/cartItems"].length === 0;

      if (cartIsEmpty) {
        this.closeModal();
      }
    },
    closeModal() {
      this.$emit("closeModalListRequests");
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
