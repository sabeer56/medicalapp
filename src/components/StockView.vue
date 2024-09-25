<template>
  <div>
    <!-- Conditionally display components based on the user's role -->
    <Bill v-if="currentRole === 'Biller'" />
    <Man v-if="currentRole === 'Manager'" />
    <In v-if="currentRole === 'Inventry'" />

    <!-- Search input and Table -->
    <v-container fluid>
      <v-row>
        <!-- Search input field -->
        <v-col cols="12" sm="6" md="4" lg="3">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <!-- Data table to display stocks -->
          <v-data-table
            :headers="headers"
            :items="filteredStocks"
            :items-per-page="itemsPerPage"
            item-key="name"
            class="elevation-1"
          >
            <!-- Table Default Slot -->
            <template v-slot:default="{ items }">
              <tbody>
                <tr v-for="stock in items" :key="stock.name">
                  <td>{{ stock.medicine_name }}</td>
                  <td>{{ stock.brand }}</td>
                  <td>{{ stock.quantity }}</td>
                  <td>{{ stock.unit_price }}</td>
                </tr>
              </tbody>
            </template>

            <!-- No Data Slot -->
            <template v-slot:no-data>
              <td colspan="4" class="text-center">No data available</td>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>

    <!-- Back Button -->
  </div>
</template>
<script>
import Eventservices from "../server/Eventservices"; // Import service to fetch stock data
import In from "./In.vue"; // Import In component
import Man from "./Man.vue"; // Import Man component
import Bill from "./Bill.vue"; // Import Bill component

export default {
  name: "StockView", // Name of the component
  components: {
    Bill, // Register Bill component
    Man, // Register Man component
    In, // Register In component
  },
  data() {
    return {
      stocks: [], // Array to store stock data
      search: "", // Data property for search input
      itemsPerPage: 5, // Number of items to display per page
      sortBy: "", // Data property to track the column being sorted
      sortDesc: false, // Data property to determine sort direction
      headers: [
        // Headers for the data table
        { text: "Medicine Name", value: "medicine_name" },
        { text: "Brand", value: "brand" },
        { text: "Quantity", value: "quantity" },
        { text: "Unit Price", value: "unit_price" },
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
 
    // Lifecycle hook: called when the component is created
    Eventservices.stockview() // Fetch stock data from the backend
      .then((response) => {
        console.log(response.data.stockArr);
        
        if (Array.isArray(response.data.stockArr)) {
          // Check if stockArr is an array
          this.stocks = response.data.stockArr; // Update stocks data property
        } else {
          console.error("stockArr is not an array"); // Log error if stockArr is not an array
        }
      })
      .catch((err) => {
        console.error("Failed to fetch stock data:", err); // Log any errors during data fetching
      });
  },
  computed: {
    currentRole() {
      // Computed property to get the current user's role
      return this.$store.state.CurrentUser
        ? this.$store.state.CurrentUser.role
        : ""; // Return the role if CurrentUser exists, otherwise return an empty string
    },
    filteredStocks() {
      // Computed property to filter and sort stocks based on search and sorting criteria
      let filtered = this.stocks; // Start with all stocks

      // Apply search filter
      if (this.search) {
        filtered = filtered.filter((stock) =>
          stock.medicine_name.toLowerCase().includes(this.search.toLowerCase())
        );
      }

      // Apply sorting
      if (this.sortBy) {
        filtered = filtered.slice().sort((a, b) => {
          const modifier = this.sortDesc ? -1 : 1; // Determine sort direction
          return modifier * (a[this.sortBy] > b[this.sortBy] ? 1 : -1);
        });
      }

      return filtered; // Return the filtered and sorted stocks
    },
  },
  methods: {
    sort(column) {
      // Method to handle sorting of the table columns
      if (this.sortBy === column) {
        // Check if the column is already sorted
        this.sortDesc = !this.sortDesc; // Toggle sort direction
      } else {
        this.sortBy = column; // Set the column to sort by
        this.sortDesc = false; // Default to ascending sort
      }
    },
  },
};
</script>
