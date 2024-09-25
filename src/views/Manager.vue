<template>
  <div class="manager-dashboard">
    <!-- Include ManagerDashBoard Component -->
    <Man />

    <!-- Main container -->
    <v-container>
      <!-- Welcome Card -->
      <v-layout row wrap>
        <v-flex xs12 md8>
          <v-card class="elevation-3">
            <v-card-title class="headline green darken-1 white--text">
              Welcome Manager
            </v-card-title>
            <!-- Additional content goes here if needed -->
          </v-card>
        </v-flex>
      </v-layout>

      <!-- Today Sales & Current Inventory Value -->
      <v-layout row wrap class="my-4">
        <v-flex  lg6 md7 xs12 sm12>
          <br> <br> <br>
          <TodaySales />
        </v-flex>
        <v-flex lg6 md7 xs12 sm12>
          
          <CurrentInventryVal />
        </v-flex>
      </v-layout>

      <!-- Sales Performance -->
      <v-layout row wrap class="my-4">
        <v-flex lg6 md7 xs12 sm12>
          <TodaySalesPerformance />
        </v-flex>
        <v-flex lg6 md7 xs12 sm12>
          <DailySales />
        </v-flex>
      </v-layout>

      <!-- Monthly Sales -->
      <v-layout row wrap>
        <v-flex lg6 md7 xs12 sm12>
          <MonthlySales />
        </v-flex>
        <v-flex lg6 md7 xs12 sm12>
          <MSalesPerformanse />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import Eventservices from "../server/Eventservices";
import MSalesPerformanse from "../components/MSalesPerformanse.vue";
import TodaySales from "../components/TodaySales.vue";
import CurrentInventryVal from "../components/CurrentInventryVal.vue";
import Man from "../components/Man.vue";
import TodaySalesPerformance from "../components/TodaySalesPerformance.vue";
import DailySales from "../components/DailySales.vue";
import MonthlySales from "../components/MonthlySales.vue";

export default {
  name: "Manager",
  components: {
    MSalesPerformanse,
    Man,
    CurrentInventryVal,
    TodaySales,
    DailySales,
    MonthlySales,
    TodaySalesPerformance,
  },
  created() {
    const user = this.$store.state.CurrentUser;
    if (user == null) {
      Eventservices.updateuserloghistory()
        .then((response) => {
          console.log(response);
        })
        .catch((res) => {
          console.log(res);
        });
      this.$router.push('/'); // Redirect to home if user is logged out
    }
  },
};
</script>
