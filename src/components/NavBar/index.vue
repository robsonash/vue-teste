<template>
  <div>
    <v-app-bar color="black accent-4" dark elevation="0">
      <v-img
        src="@/assets/images/logo.png"
        max-height="50"
        max-width="70"
      ></v-img>

      <v-spacer></v-spacer>

      <v-menu left bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-app-bar-nav-icon></v-app-bar-nav-icon>
          </v-btn>
        </template>
        <v-list flat>
          <v-subheader>PÁGINAS</v-subheader>
          <v-list-item-group v-model="selectedItem" color="primary">
            <v-list-item
              class="c-list-item"
              v-for="item in items"
              :key="item.id"
              @click="tolink(item.link)"
            >
              <span :class="['icones', item.icon]"></span>
              <v-list-item-content>
                <span class="v-list-item-title">{{ item.text }}</span>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "NavBar",
  props: {
    items: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      selectedItem: "",
    };
  },
  methods: {
    tolink(route) {
      if (route !== this.$route.path) {
        this.$router.push(route);
      }
    },
  },
};
</script>

<style src="./styles.scss" scoped lang="scss" />
