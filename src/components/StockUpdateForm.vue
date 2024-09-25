<template>
  <div>
    <!-- Display components based on the user role from the Vuex store -->
    <Man v-if="currentUserRole === 'Manager'" />
    <In v-if="currentUserRole === 'Inventry'" />

    <!-- Stock update form container -->
    <div class="stock-update-form">
      <v-card class="elevation-3">
        <!-- Card title with a button to open the stock modal -->
        <v-card-title class="headline green darken-1 black--text">
          Update Stock
          <v-btn icon color="red" @click="openAddStockModal" class="ml-auto">
            <v-icon>mdi-plus</v-icon> <!-- Added icon here for the button -->
          </v-btn>
        </v-card-title>
        
        <!-- Card content including the stock update form -->
        <v-card-text>
          <v-form ref="form">
            <v-container>
              <v-row>
                <!-- Dropdown to select stock -->
                <v-col cols="12">
                  <v-select
                    v-model="selectedStock"
                    :items="stockNames"
                    label="Select Stock"
                  ></v-select>
                </v-col>
                <!-- Input field for quantity -->
                <v-col cols="12">
                  <v-text-field
                    v-model="qty"
                    label="Quantity"
                    type="number"
                    outlined
                    :rules="qtyRules"
                    required
                  ></v-text-field>
                </v-col>
                <!-- Input field for unit price -->
                <v-col cols="12">
                  <v-text-field
                    v-model="unitPrice"
                    label="Unit Price"
                    outlined
                    :rules="unitPriceRules"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <!-- Card actions including save and cancel buttons -->
        <v-card-actions>
          <v-btn color="green darken-1" @click="saveChanges">Save</v-btn>
          <v-btn text @click="cancel">Cancel</v-btn>
          <v-spacer></v-spacer>  <v-spacer></v-spacer>   <v-spacer></v-spacer>   <v-spacer></v-spacer>   <v-spacer></v-spacer>   <v-spacer></v-spacer>
          <AddStockModal v-model="showAddStockModal" @message="handleMessage" />
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </div>
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>

    <!-- AddStockModal component -->
 
  </div>
</template>

<script>
import Eventservices from "../server/Eventservices";
import In from "./In";
import AddStockModal from "./AddStockModel.vue";
import Man from "./Man.vue";

export default {
  name: "StockUpdateForm",
  components: {
    AddStockModal,
    Man,
    In,
  },
  created() {
    const user = this.$store.state.CurrentUser;
    if (!user) {
      this.$router.push('/'); // Redirect to home if user is not logged in
      return; // Prevent further execution
    }

    Eventservices.updateuserloghistory()
      .then((response) => {
        console.log(response); // Log the response for debugging
        // Additional code for actions on successful logout, if needed
      })
      .catch((res) => {
        console.log(res); // Log the error response for debugging
        // Additional error handling, if needed
      });

    this.handleMessage();
  },
  data() {
    return {
      stockNames: [], // Array to hold stock names for dropdown
      stocks: [], // Array to store stock data fetched from the API
      selectedStock: "", // Selected stock from the dropdown
      qty: 0, // Quantity input
      unitPrice: 0, // Unit price input
      // Validation rules for quantity
      qtyRules: [
        (value) => !!value || "Quantity is required",
        (value) => /^\d+$/.test(value) || "Quantity must be a number",
        (value) => value >= 0 || "Quantity must be greater than or equal to 0",
      ],
      // Validation rules for unit price
      unitPriceRules: [
        (value) => !!value || "Unit Price is required",
        (value) =>
          /^\d+(\.\d{1,2})?$/.test(value) || "Invalid unit price format",
        (value) =>
          value >= 0 || "Unit Price must be greater than or equal to 0",
      ],
      showAddStockModal: false, // Boolean to control the visibility of the add stock modal
      snackbar: {
        visible: false,
        message: "",
        color: "",
      },
    };
  },
  computed: {
    currentUserRole() {
      return this.$store.state.CurrentUser
        ? this.$store.state.CurrentUser.role
        : "";
    },
  },
  methods: {
    openAddStockModal() {
      this.showAddStockModal = true;
    },
    saveChanges() {
      if (!this.selectedStock || this.qty <= 0 || this.unitPrice <= 0) {
        alert("Please enter valid stock details.");
        return;
      }

      const newStock = {
        medicine_name: this.selectedStock,
        Quantity: parseInt(this.qty),
        Unit_Price: parseFloat(this.unitPrice), // Use parseFloat for unit price
        Updated_By: this.$store.state.CurrentUser.userid,
      };

      Eventservices.updatestock(newStock)
        .then((response) => {
          console.log(response);
          this.snackbar.message = "Stock updated successfully";
          this.snackbar.color = "success";
          this.snackbar.visible = true;
        })
        .catch((err) => {
          console.error(err);
          this.snackbar.message = "Check the Values";
          this.snackbar.color = "error";
          this.snackbar.visible = true;
        });
    },
    cancel() {
      this.resetForm();
    },
    resetForm() {
      this.selectedStock = "";
      this.qty = 0;
      this.unitPrice = 0;
    },
    handleMessage() {
      Eventservices.stockview()
        .then((response) => {
          console.log(response.data.stockArr);

          if (Array.isArray(response.data.stockArr)) {
            this.stocks = response.data.stockArr;
            this.stockNames = this.stocks.map(stock => stock.medicine_name);
            console.log(this.stockNames); // Debug output
          } else {
            console.error("StockArr is not an array");
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
.stock-update-form {
  padding: 20px;
}

.v-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  background-color: #467087; /* Dark blue background */
  color: rgb(15, 15, 15);
  padding: 16px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  align-items: center; /* Center items vertically */
}

.v-card-text {
  padding: 16px;
}

.v-container {
  width: 100%;
}

.v-row {
  margin-bottom: 12px;
}

.v-col {
  padding: 0 8px;
}

.v-select,
.v-text-field {
  width: 100%;
}

.v-card-actions {
  padding: 16px;
  justify-content: center;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.v-btn {
  min-width: 120px;
  margin: 0 8px;
}

.blue--text {
  color: #1976d2; /* Dark blue text color */
}

.v-btn--text {
  color: #1976d2; /* Dark blue text color for text button */
}

.elevation-3 {
  transition: box-shadow 0.3s;
}

.elevation-3:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

@media (max-width: 600px) {
  .v-card {
    max-width: calc(100% - 20px);
    border-radius: 0;
  }
}
</style>
