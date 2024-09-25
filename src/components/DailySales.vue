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
          <!-- Bind chart options -->
          <!-- Bind chart data series -->
          <!-- Set chart type to bar -->
          <strong>  Daily Sales
         </strong>
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
      dailyArr: [],
      chartOptions: {
        chart: {
          height: 350,
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: "top",
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val) {
            return val + "%";
          },
          offsetY: -20,
          style: {
            fontSize: "12px",
            colors: ["#304758"],
          },
        },
        xaxis: {
          categories: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ],
          position: "top",
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          crosshairs: {
            fill: {
              type: "gradient",
              gradient: {
                colorFrom: "#D8E3F0",
                colorTo: "#BED1E6",
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            show: false,
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        title: {
          text: "",
          floating: true,
          offsetY: 330,
          align: "center",
          style: {
            color: "#444",
          },
        },
      },
      chartSeries: [
        {
          name: "Inflation",
          data: [],
        },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      Eventservices.monthlyapi()
        .then(response => {
          console.log(response);

          // Update dailyArr with the API response
          this.dailyArr = response.data.dayarr.map(item => item.daily);
          console.log(this.dailyArr);

          // Update chartSeries with the new data
          this.chartSeries = [
            {
              name: "Inflation",
              data: this.dailyArr,
            },
          ];
        })
        .catch(err => {
          console.error(err);
        });
    },
  },
};
</script>
