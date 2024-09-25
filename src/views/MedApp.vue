<template>
  <v-app>
    <!--include Login component-->
    <Login />
  </v-app>
</template>

<script>
import Login from "../components/Login.vue";
export default {
  name: "MedApp",
  components: {
    Login,
  },
};
</script>
