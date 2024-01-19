<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="c-container-card">
    <div v-for="item in items" :key="item.id">
      <v-card class="mx-auto" max-width="344" outlined>
        <v-list-item three-line>
          <v-list-item-content>
            <div class="text-overline mb-4">PRODUTO</div>
            <v-list-item-title class="text-h5 mb-1">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <span v-on="on">{{ item.nome }}</span>
                </template>
                <span> {{ item.nome }}</span>
              </v-tooltip>
            </v-list-item-title>
            <v-list-item-subtitle>{{ item.descricao }}</v-list-item-subtitle>
          </v-list-item-content>

          <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
        </v-list-item>

        <v-card-actions>
          <v-btn @click="clickCard(item)" outlined rounded text>
            Adicionar ao carrinho
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
    },
  },
  data() {
    return {
      loading: false,
      selection: 1,
    };
  },

  methods: {
    clickCard(item) {
      this.$emit("clickCard", item);
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
