<template>
  <v-app>
    <NavBar :items="navBarItems" />
    <v-main class="main">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>
<script>
import NavBar from "@/components/NavBar/index";
import { mapState } from "vuex";
export default {
  name: "App",
  components: {
    NavBar,
  },
  data() {
    return {
      items: [],
    };
  },
  computed: {
    ...mapState("utils", ["navBarItems"]),
  },
};
</script>
<style scoped>
.main {
  background-color: #fbfbfb;
}
</style>
