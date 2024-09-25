<template>
  <v-container>
    <div id="chart">
      <br> <br> <br>
      <apexchart
        type="pie"
        height="350"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </div>
  </v-container>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import Eventservices from "../server/Eventservices";

export default {
  name: "TodaySalesPerformance",
  components: {
    apexchart: VueApexCharts,
  },
  created() {
    this.fetchTodaySales();
  },
  data() {
    return {
      series: [],           // Data series for the chart
      chartOptions: {
        chart: {
          width: 380,
          type: "pie",
        },
        labels: [],         // Dynamic labels for the chart
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: 200,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },
  methods: {
    formatDateForComparison() {
      const today = new Date();
      const day = today.getDate().toString().padStart(2, "0");
      const month = (today.getMonth() + 1).toString().padStart(2, "0");
      const year = today.getFullYear();
      return `${year}-${month}-${day}`; // Use YYYY-MM-DD format
    },
    async fetchTodaySales() {
      const today = this.formatDateForComparison();
      try {
        const response = await Eventservices.todaysales(today);
        console.log("API Response:", response.data); // Debug: Check API response
        if (response.data && Array.isArray(response.data.totalSale)) {
          const billerNames = [];
          const salesValues = [];

          response.data.totalSale.forEach(sale => {
            if (sale.login_id && typeof sale.todaytotalsale === 'number') {
              billerNames.push(sale.login_id.split('@')[0]);
              salesValues.push(sale.todaytotalsale);
            }
          });

          console.log("Biller Names:", billerNames); // Debug: Check biller names
          console.log("Sales Values:", salesValues); // Debug: Check sales values

          // Update data reactively
          this.chartOptions = {
            ...this.chartOptions,
            labels: billerNames
          };
          this.series = salesValues;
        } else {
          console.warn("Response data is missing or incorrectly formatted:", response.data);
        }
      } catch (err) {
        console.error("Error fetching today's sales data:", err);
        alert("Failed to fetch today's sales data. Please try again later.");
      }
    }
  }
};
</script>
