<template>
  <div>
    <div class="quantity-control">
      <button @click="decrementQuantity">-</button>
      <input type="number" v-model="quantity" @input="updateQuantity" />
      <button @click="incrementQuantity">+</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quantity: 1,
    };
  },
  methods: {
    incrementQuantity() {
      this.quantity++;
      this.$emit("input", this.quantity);
    },
    decrementQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
      this.$emit("input", this.quantity);
    },
    updateQuantity() {
      if (this.quantity < 1) {
        this.quantity = 1;
      }
      this.$emit("input", this.quantity);
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
