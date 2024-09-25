<template>
  <!-- Main container for the stock popup -->
  <div id="stockpopup">
    <!-- Include the StockUpdateForm component -->
    <StockUpdateForm />
  </div>
</template>

<script>
// Import the StockUpdateForm component to use within this component
import StockUpdateForm from "./StockUpdateForm.vue";

export default {
  name: "StockPopup", // Define the name of the Vue component
  components: {
    StockUpdateForm, // Register the StockUpdateForm component
  },
  data() {
    return {
      showModal: false, // Data property to control the visibility of the modal
    };
  },
  methods: {
    // Method to show the stock update modal
    showAddStockModal() {
      this.showModal = true; // Set showModal to true to display the modal
    },

    // Method to close the stock update modal
    closeModal() {
      this.showModal = false; // Set showModal to false to hide the modal
    },
  },
};
</script>
