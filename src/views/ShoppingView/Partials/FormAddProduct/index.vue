<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div id="add-product">
    <div class="c-container-product-cart">
      <div class=""><span class="c-img-product"></span></div>
      <div class="c-list-product">
        <div class="c-list-title">{{ productItem.nome }}</div>
        <div class="c-list-description">
          {{ productItem.descricao }}
        </div>
        <div class="c-list-price-amont">
          <div class="c-list-price">
            <span>Preço:</span>
            <span>{{ formatCurrency(productItem.valorUnitario) }}</span>
            <span>por unidade</span>
          </div>
          <div class="c-list-amont">
            <div class="c-list-amont-button">
              <AmontButton @input="updateAmont" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AmontButton from "@/components/AmontButton/AmontButton.vue";
import { formatCurrency } from "@/utils/FormatCurrency";
export default {
  name: "FormAddProduct",
  props: {
    productItem: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    AmontButton,
  },
  data() {
    return {
      amont: 1,
    };
  },

  methods: {
    resetForm() {
      this.editMode = false;
    },
    formatCurrency,
    updateAmont(value) {
      this.amont = value;
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
