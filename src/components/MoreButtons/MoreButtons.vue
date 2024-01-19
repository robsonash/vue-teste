<template>
  <div>
    <v-menu
      v-model="menu"
      :close-on-content-click="false"
      open-on-hover
      :close-delay="10"
    >
      <template v-slot:activator="{ props }">
        <v-btn fab small text @click="openMenu" v-bind="props">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          v-for="(action, index) in acoes"
          :key="index"
          @click="performAction(action)"
        >
          {{ action.text }}
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "MoreButtons",
  props: {
    acoes: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      menu: false,
    };
  },
  methods: {
    openMenu() {
      this.menu = true;
    },
    performAction(action) {
      action.action(); // Executa a ação correspondente
      this.menu = false; // Feche o menu após a seleção
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
