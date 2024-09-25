<template>
  <div>
    <!--include system component-->
    <System />

    <v-container fluid>
      <!-- Main content area -->
      <v-layout row justify-center>
        <v-flex xs12 md8>
          <v-card class="elevation-3">
            <v-card-title class="headline grey lighten-2">
              Welcome System Admin
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import System from "../components/System.vue";
export default {
  name: "SystemAdmin",
  components: {
    System,
  },
};
</script>
<style></style>
