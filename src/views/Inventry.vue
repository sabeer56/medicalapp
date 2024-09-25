<template>
  <div>
    <!-- Top toolbar with tabs -->
    <!--include InventryDashBoard Component-->
    <In />

    <v-container fluid>
      <!-- Main content area -->
      <v-layout row justify-center>
        <v-flex xs12 md8>
          <v-card class="elevation-3">
            <v-card-title class="headline green darken-1 white--text">
              Welcome Inventory
            </v-card-title>
            <!-- Additional content goes here if needed -->
          </v-card>
        </v-flex>
      </v-layout>
      <!--include CurrentInventryVal Component-->
      <CurrentInventryVal />
    </v-container>
  </div>
</template>

<script>
import Eventservices from "../server/Eventservices";
import In from "../components/In.vue";
import CurrentInventryVal from "../components/CurrentInventryVal.vue";
export default {
  name: "Inventory",
  components: {
    CurrentInventryVal,
    In,
  },
  created() {
    // Redirect if user is already logged in
    const user = this.$store.state.CurrentUser;
    if (user==null) {
      Eventservices.updateuserloghistory()
        .then((response) => {
          // Handling the response from the API
          console.log(response); // Log the response for debugging
          // Additional code can be added here for further actions on successful logout, e.g., redirecting to login page
        })
        .catch((res) => {
          // Handling errors from the API call
          console.log(res); // Log the error response for debugging
          // Additional error handling can be added here
        });
      this.$router.push('/'); // Corrected: Always redirect to home if user is logged in
    }
  },
};
</script>
