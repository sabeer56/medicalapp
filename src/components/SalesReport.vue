<template>
  <div class="sales-report">
    <!-- Header component with navigation and title -->
    <Man />

    <!-- Main content card for Sales Report -->
    <v-card>
      <!-- Card title with a back button -->
      <v-card-title class="headline blue darken-1 white--text">
        Sales Report
        <!-- Back button to navigate to the manager view -->
       
      </v-card-title>
      <v-card-text>
        <!-- Container for the date pickers and action buttons -->
        <v-container>
          <!-- Row for date pickers and buttons -->
          <v-row>
            <!-- From Date Picker -->
            <v-col cols="12" sm="6" md="3">
              <v-menu
                ref="menuFrom"
                v-model="menuFrom"
                :close-on-content-click="false"
                :return-value.sync="fromDate"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="fromDate"
                    label="From Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="fromDate"
                  no-title
                  scrollable
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuFrom.save(fromDate)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- To Date Picker -->
            <v-col cols="12" sm="6" md="3">
              <v-menu
                ref="menuTo"
                v-model="menuTo"
                :close-on-content-click="false"
                :return-value.sync="toDate"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="toDate"
                    label="To Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="toDate"
                  no-title
                  scrollable
                  :max="maxDate"
                >
                  <v-spacer />
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.menuTo.save(toDate)"
                  >
                    OK
                  </v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
            <!-- Search and Download Buttons -->
            <v-col cols="12" sm="6" md="3">
              <v-btn color="success" @click="fetchSalesData">Search</v-btn>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-btn color="warning" @click="exportToCSV">Download CSV</v-btn>
            </v-col>
          </v-row>

          <!-- Always visible Search Box -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="search"
                label="Search"
                outlined
                append-icon="mdi-magnify"
                hide-details
              />
            </v-col>
          </v-row>

          <!-- Display Sales Data -->
          <v-row v-if="filteredSalesData.length > 0">
            <v-col cols="12">
              <v-data-table
                :headers="tableHeaders"
                :items="filteredSalesData"
                hide-default-footer
              >
                <template v-slot:items="{ items }">
                  <tbody>
                    <tr v-for="item in items" :key="item.bill_no">
                      <td>{{ item.bill_no }}</td>
                      <td>{{ formatDate(item.bill_date) }}</td>
                      <td>{{ item.medicine_name }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.netprice }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-data-table>
            </v-col>
          </v-row>

          <!-- No Sales Data Message -->
          <v-row v-else>
            <v-col cols="12">
              <span>No sales data available.</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Eventservices from "../server/Eventservices";
import Man from "./Man.vue";

export default {
  name: "SalesReport",
  components: {
    Man,
  },
  data() {
    return {
      fromDate: "", // Holds the start date for the report
      toDate: "", // Holds the end date for the report
      salesData: [], // Array to store sales data
      tableHeaders: [
        { text: "Bill No", value: "Bill_No" },
        { text: "Bill Date", value: "Bill_Date" },
        { text: "Medicine Name", value: "Medicine_Name" },
        { text: "Quantity", value: "Quantity" },
        { text: "Amount", value: "netprice" },
      ], // Table column headers
      menuFrom: false, // Controls visibility of the From Date picker
      menuTo: false, // Controls visibility of the To Date picker
      search: "", // Holds the search term for filtering data
      snackbar: {
        visible: false,
        color: '',
        message: '',
      }, // Snackbar configuration
    };
  },
  computed: {
    filteredSalesData() {
      if (!Array.isArray(this.salesData)) {
        return [];
      }

      let filtered = this.salesData;
      if (this.search) {
        const searchText = this.search.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            (item.bill_no && item.bill_no.toLowerCase().includes(searchText)) ||
            (item.medicine_name && item.medicine_name.toLowerCase().includes(searchText))
        );
      }
      return filtered;
    },
    maxDate() {
      return new Date().toISOString().substr(0, 10);
    },
  },
  methods: {
    backClick() {
      // Method to navigate back to the manager view
      this.$router.push("/manager");
    },
    // Method to fetch sales data based on date range
    fetchSalesData() {
      if (!this.fromDate || !this.toDate) {
        this.snackbar.message = "Please select both From and To dates.";
        this.snackbar.color = "error";
        this.snackbar.visible = true;
        return;
      }
      const date1 = this.parseDate(this.fromDate);
      const date2 = this.parseDate(this.toDate);
      if (date1 > date2) {
        this.snackbar.message = "To date should be after From date.";
        this.snackbar.color = "error";
        this.snackbar.visible = true;
        return;
      }
      Eventservices.sales(this.fromDate, this.toDate)
        .then((response) => {
          console.log("API Response:", response); // Log full response
          if (response.data && Array.isArray(response.data.salesResultArr)) {
            this.salesData = response.data.salesResultArr;
            console.log("Sales Data:", this.salesData); // Log sales data
          } else {
            console.error("Unexpected API response structure:", response);
            this.salesData = [];
          }
        })
        .catch((err) => {
          console.error("Error fetching sales data:", err);
          this.salesData = []; // Fallback to empty array on error
          this.snackbar.message = "Failed to fetch sales data.";
          this.snackbar.color = "error";
          this.snackbar.visible = true;
        });
    },
    // Method to format date strings into a more readable format
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
    // Method to export sales data to a CSV file
    exportToCSV() {
      if (this.filteredSalesData.length === 0) {
        this.snackbar.message = "No data to export.";
        this.snackbar.color = "error";
        this.snackbar.visible = true;
        return;
      }

      const filename = "sales_report.csv";
      const csv = this.convertToCSV(this.filteredSalesData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, filename);
      } else {
        // Other browsers
        const link = document.createElement("a");
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", filename);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    // Method to convert sales data to a CSV file
    convertToCSV(data) {
      if (data.length === 0) return "";
      const header = this.tableHeaders.map(header => header.text).join(",") + "\n";
      const csv = data.map((item) =>
        this.tableHeaders.map(header => item[header.value] || "").join(",")
      ).join("\n");
      return header + csv;
    },
    // Method to parse date strings into Date objects
    parseDate(dateStr) {
      return new Date(dateStr);
    }
  },
};
</script>
