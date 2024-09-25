<template>
  <div>
    <!-- Display sales total with a directional arrow based on comparison -->
    <!-- If today's sales are less than or equal to the previous day's sales, show a downward arrow -->
    <h2 v-if="todaySales <= prevDaySales">
      Today's Sales Total: {{ Math.round(todaySales) }}
      <span class="mdi mdi-arrow-down"></span>
      <!-- Downward arrow icon -->
    </h2>
    <!-- If today's sales are greater than the previous day's sales, show an upward arrow -->
    <h2 v-else>
      Today's Sales Total: {{ Math.round(todaySales) }}
      <span class="mdi mdi-arrow-up"></span>
      <!-- Upward arrow icon -->
    </h2>
  </div>
</template>

<script>
// Import service to fetch sales data
import Eventservices from "../server/Eventservices";

export default {
  name: "TodaySales",
  data() {
    return {
      todaySales: 0,
      prevDaySales: 0,
    };
  },
  created() {
    // Fetch sales data when the component is created
    this.fetchTodaySalesData();
    this.fetchPrevDaySalesData();
  },
  methods: {
    //fetch today sales data
    fetchTodaySalesData() {
      const today = this.formatDateForComparison();

      Eventservices.todaysales(today)
        .then((response) => {
          console.log(response.data.totalSale);
          for(var i=0;i<response.data.totalSale.length;i++){
            this.todaySales+=response.data.totalSale[i].todaytotalsale
          }
          console.log("Today's Sales:", this.todaySales);
          
          // No need to fetch previous day's sales here
        })
        .catch((err) => {
          console.error("Error fetching today's sales data:", err);
        });
    },
    //fetch previous sales data
    fetchPrevDaySalesData() {
      const prevDay = this.getPreviousDate();

      Eventservices.todaysales(prevDay)
        .then((response) => {
          console.log(response);
         
          for(var i=0;i<response.data.totalSale.length;i++){
            this.prevDaySales+=response.data.totalSale[i].todaytotalsale
          }
          console.log("Previous Day's Sales:", this.prevDaySales);
        })
        .catch((err) => {
          console.error("Error fetching previous day's sales data:", err);
        });
    },
    // Method to format today's date in YYYY-MM-DD format
    formatDateForComparison() {
      const today = new Date();
      const day = today.getDate().toString().padStart(2, "0");
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const year = today.getFullYear();
      return `${year}-${month}-${day}`; // Use YYYY-MM-DD format
    },
    // Method to get the previous day's date in YYYY-MM-DD format
    getPreviousDate() {
      const previousDay = new Date();
      previousDay.setDate(previousDay.getDate() - 1); // Get previous day
      const day = previousDay.getDate().toString().padStart(2, "0");
      const month = (previousDay.getMonth() + 1).toString().padStart(2, "0");
      const year = previousDay.getFullYear();
      return `${year}-${month}-${day}`; // Use YYYY-MM-DD format
    },
  },
};
</script>
