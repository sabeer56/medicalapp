<template>
  <!-- Container for the chart component -->
  <v-container>
    <!-- Add vertical spacing -->
    <br />
    <br />
    <!-- Create a row for layout -->
    <v-row>
      <!-- Center the chart horizontally within the row -->
      <v-layout justify-center>
        <!-- Flex container to adjust the chart's size -->
        <v-flex>
          <!-- ApexCharts component for rendering the chart -->
          <apexchart
            :options="chartOptions"
            :series="chartSeries"
            type="line"
            height="350"
          ></apexchart>
        </v-flex>
      </v-layout>
    </v-row>
  </v-container>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import Eventservices from "../server/Eventservices";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'  // Use 'smooth' for a smoother line curve
        },
        title: {
          text: 'Monthly Sales Data',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Updated month names
        }
      },
      chartSeries: []  // This will be updated with the API data
    };
  },
  created() {
    Eventservices.monthlyapi().then(response => {
      console.log(response);

      // Correctly extract month names and sales data
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const salesData = months.map(Month => {
        // Find the sale for the given month
        const MonthlySale = response.data.montharr.find(item => item.month === Month);
        return MonthlySale ? MonthlySale.monthlysale : 0; // Return 0 if month data is missing
      });

      // Update chartSeries with the API data
      this.chartSeries = [{
        name: "Monthly Sales",
        data: salesData
      }];
    }).catch(err => {
      console.log(err);
    });
  }
};
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>
