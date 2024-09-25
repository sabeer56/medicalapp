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
            type="bar"
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
          type: 'bar',
          events: {
            click: function(chart, w, e) {
              console.log(chart, w, e); // Handle chart click event if needed
            }
          }
        },
        colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFCC', '#CC33FF', '#FFFF33', '#FF5733'], // Customize colors
        plotOptions: {
          bar: {
            columnWidth: '45%',
            distributed: true, // Distribute colors among different bars
            borderRadius: 10, // Add border radius for better visual
          }
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val; // Display the value on top of the bar
          },
          offsetY: -20,
          style: {
            fontSize: '12px',
            colors: ['#304758'],
          },
        },
        xaxis: {
          categories: [], // To be filled with biller names
          labels: {
            style: {
              colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#33FFCC', '#CC33FF', '#FFFF33', '#FF5733'],
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          title: {
            text: 'Sales Amount',
            style: {
              color: '#444',
              fontSize: '14px'
            }
          }
        },
        title: {
          text: "Monthly Sales Data by Billers",
          align: "center",
          style: {
            color: "#444",
            fontSize: '16px',
            fontWeight: 'bold'
          },
        },
      },
      chartSeries: [
        {
          name: 'Sales Amount',
          data: [] // To be filled with sales data
        }
      ],
    };
  },
  created() {
    this.fetchSalesData();
  },
  methods: {
    fetchSalesData() {
      Eventservices.todaysales("")
        .then(response => {
          console.log("API Response:", response);

          // Initialize empty arrays
          const billerNames = [];
          const totalSales = [];

          // Manually extract biller names and total sales
          for (let i = 0; i < response.data.monthlysales.length; i++) {
            const item = response.data.monthlysales[i];
            if (item.login_id && item.monthlytotalsale != null) { // Check for valid data
              billerNames.push(item.login_id.split('@')[0]);
              totalSales.push(item.monthlytotalsale);
            }
          }

          // Log extracted data for debugging
          console.log("Biller Names:", billerNames);
          console.log("Total Sales:", totalSales);

          // Update chart data
          for(var i=0;i<billerNames.length;i++){
            this.chartOptions.xaxis.categories.push(billerNames[i])
          }
          this.chartSeries = [{ name: 'Sales Amount', data: totalSales }];

          // Log updated chart options and series for debugging
          console.log("Updated Chart Options:", this.chartOptions);
          console.log("Updated Chart Series:", this.chartSeries);
        })
        .catch(err => {
          console.error("Error fetching sales data:", err);
        });
    }
  },
};
</script>
