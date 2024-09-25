<template>
  <!-- Main container for displaying current inventory value -->
  <v-container>
    <!-- Add space for layout adjustments -->
    <br />
    <br />
    <br />
    <!-- Display current inventory value dynamically -->
    <h3>Current Inventory Value: {{ inventoryVal }}</h3>
  </v-container>
</template>

<script>
import Eventservices from "../server/Eventservices"; // Import Eventservices for API calls

export default {
  name: "CurrentInventory", // Component name
  data() {
    return {
      inventoryVal: 0, // Initialize inventoryVal with a default value of 0
    };
  },
  created() {
    // Lifecycle hook that runs after the component is created
    // Fetch inventory value when the component is first created
    this.fetchInventoryValue();
  },
  methods: {
    fetchInventoryValue() {
      // Call the API to fetch current inventory value
      Eventservices.curreninventryval()
        .then((response) => {
          // On successful response, update inventoryVal with the fetched value
          this.inventoryVal = response.data.inventryval;
        })
        .catch((err) => {
          // Handle any errors that occur during the API call
          console.error("Error fetching inventory value:", err);
          // Optionally handle the error, e.g., show a message or set inventoryVal to a default error value
        });
    },
  },
};
</script>
