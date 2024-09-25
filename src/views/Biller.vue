<template>
  <div>
    <!--Include Bill Component-->
    <Bill />
    <v-container fluid>
      <!-- Main content area -->
      <v-layout row justify-center>
        <v-flex xs12 md8>
          <v-card class="elevation-3">
            <v-card-title class="headline red darken-1 white--text">
              Welcome Biller
            </v-card-title>
            <!--Include TodaySales Component-->
            <TodayBillerSales />
            <!-- Assuming TodaySales component is used for manager's dashboard -->
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Bill from "../components/Bill.vue";
import Eventservices from "../server/Eventservices";
import TodayBillerSales from "../components/TodayBillerSales.vue";
export default {
  name: "Biller",
  components: {
    TodayBillerSales,
    Bill,

  },
  
  data() {
    return {
      tabs: null,
      tabsItems: [
        { id: 1, title: "Stock View", link: "/stock-view" },
        { id: 2, title: "Bill Entry", link: "/bill" },
      ],
    };
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
  methods: {},
};
</script>
