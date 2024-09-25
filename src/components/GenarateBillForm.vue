<template>
  <!-- Container for the bill generation form and related components -->
  <div class="generate-bill-form">
    <!-- Include the Bill component (header or overview) -->
    <Bill />

    <!-- Card component for the bill generation form -->
    <v-card>
      <!-- Card title with a back button -->
      <v-card-title class="headline French grey green darken-1 white--text">
        Generate Bill
        <!-- Button to navigate back to the previous page -->
     
      </v-card-title>

      <!-- Card text area containing the form for generating a bill -->
      <v-card-text>
        <!-- Container for form fields -->
        <v-container>
          <!-- Vue form with validation -->
          <v-form ref="form">
            <!-- Layout using v-layout and v-flex -->
            <v-layout row wrap>
              <!-- Flex for the item selection -->
              <v-flex xs12>
                <!-- Dropdown for selecting stock items -->
                <v-select
                  v-model="selectedItem"
                  :items="stockNames"
                  item-text="medicine_name"
                  item-value="medicine_name"
                  label="Select Item"
                  :rules="selectedItemRules"
                >
                </v-select>
              </v-flex>
              <!-- Flex for entering quantity -->
              <v-flex xs12>
                <!-- Text field for quantity input -->
                <v-text-field
                  v-model="quantity"
                  label="Quantity"
                  type="number"
                  outlined
                  :rules="quantityRules"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>

      <!-- Card actions for form buttons -->
      <v-card-actions>
        <!-- Button to add item to the bill -->
        <v-btn color="blue darken-1" text @click="addToBill">Add</v-btn>
        <!-- Button to cancel the bill generation process -->
        <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Include the BillView component to display or preview the bill -->
    <BillView
      :addBill1="addBill1"
      :newBill="newBill"
      :billno="billno"
      @reset="resetBill"
    />

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Eventservices from "../server/Eventservices";
import BillView from "./BillView.vue";
import Bill from "./Bill.vue";

export default {
  name: "GenerateBillForm",
  components: {
    BillView,
    Bill,
  },
  computed: {
    currentUser() {
      return this.$store.state.CurrentUser;
    },
  },
  created() {
    this.generateUniqueBillNo();
    this.fetchData()

    console.log("Current User:", this.currentUser);
  },
  data() {
    return {
      buttons: [
        { color: "info", title: "Information", type: "info" },
        { color: "success", title: "Success", type: "success" },
        { color: "warning", title: "Warning", type: "warning" },
        { color: "error", title: "Error", type: "error" },
      ],
      snackbar: {
        color: null,
        icon: null,
        mode: null,
        position: "top",
        text: null,
        timeout: 7500,
        title: null,
        visible: false,
      },
      timeout: 7500,
      err: "",
      stocks: [],
      newBill: [],
      stockNames: [],
      billno: "",
      selectedItem: null,
      quantity: 0,
      showBill: false,
      selectedItemRules: [(v) => !!v || "Item is required"],
      quantityRules: [
        (v) => !!v || "Quantity is required",
        (v) => /^\d+$/.test(v) || "Quantity must be a valid number",
        (v) => parseInt(v) > 0 || "Quantity must be greater than 0",
      ],
    };
  },
  methods: {
  backClick() {
    this.$router.push("/biller");
  },
  generateUniqueBillNo() {
    const now = new Date();
    this.billno =
      now.getFullYear() +
      ("0" + (now.getMonth() + 1)).slice(-2) +
      ("0" + now.getDate()).slice(-2) +
      ("0" + now.getHours()).slice(-2) +
      ("0" + now.getMinutes()).slice(-2) +
      ("0" + now.getSeconds()).slice(-2) +
      ("00" + now.getMilliseconds()).slice(-3);
  },
  addToBill() {
    if(this.quantity<0 || this.isFloat(this.quantity)){
      this.snackbar.message = `please select the valid quantity`;
            this.snackbar.color = "error";
            this.snackbar.visible = true;
          return
    }
    
    if (this.selectedItem && this.quantity) {
      const selectedStock = this.stocks.find(
        (stock) => stock.medicine_name === this.selectedItem
      );
      if (selectedStock) {
        const existingBillIndex = this.newBill.findIndex(
          (bill) => bill.Medicine_Name === selectedStock.medicine_name
        );

        const totalPrice = parseInt(this.quantity) * selectedStock.unit_price;
        const gst = totalPrice * 0.18;

        if (existingBillIndex !== -1) {
          const existingBill = this.newBill[existingBillIndex];
          existingBill.Quantity += parseInt(this.quantity);
          existingBill.UnitPrice =
            existingBill.Quantity * selectedStock.unit_price;
          existingBill.GST = existingBill.UnitPrice * 0.18;
          existingBill.NetPayable = existingBill.UnitPrice + existingBill.GST;
        } else {
          const newBillEntry = {
            Medicine_Name: selectedStock.medicine_name,
            Brand: selectedStock.brand,
            Bill_No: this.billno,
            Quantity: parseInt(this.quantity),
            UnitPrice: parseInt(totalPrice),
            GST: parseFloat(gst),
            NetPayable: totalPrice + gst,
            Login_Id: this.currentUser ? this.currentUser.userid : "Unknown",
            Created_By: this.currentUser.userid,
          };

          this.newBill.push(newBillEntry);
          
        }
      } else {
        
        this.snackbar.message = "Selected item not found in stock.";
            this.snackbar.color = "error";
            this.snackbar.visible = true;
      }
    } else {
    
      this.snackbar.message = "Please select an item and enter a quantity.";
            this.snackbar.color = "error";
            this.snackbar.visible = true;
    }
  },
  isFloat(value) {
      return Number.isFinite(value) && !Number.isInteger(value);
    },
  addBill1() {
    if (this.newBill.length > 0) {
      Eventservices.addBill(this.newBill)
        .then((response) => {
          if (response.data.errmsg) {
            this.snackbar.message = ` ${response.data.status}`;
            this.snackbar.color = "error";
            this.snackbar.visible = true;
            return;
          }
          this.snackbar.message = "successfully Added.";
            this.snackbar.color = "success";
            this.snackbar.visible = true;
            
          this.fetchData()
          return Eventservices.addBillDetails(this.newBill);
        })
        .then(() => {
          this.resetBill();
        })
        .catch((err) => {
          this.snackbar.message = ` ${err}`;
            this.snackbar.color = "error";
            this.snackbar.visible = true;
            return;
        });
    } else {
     
      this.snackbar.message = "No items to add to the bill.";
            this.snackbar.color = "error";
            this.snackbar.visible = true;
            return;
    }
  },
  resetBill() {
    this.newBill = [];
    this.selectedItem = null;
    this.quantity = 0;
    this.$refs.form.resetValidation();
    this.showBill = false;
    this.generateUniqueBillNo();
  },
  cancel() {
    this.resetBill();
  },

  fetchData() {
    Eventservices.stockview()
      .then((response) => {
        if (Array.isArray(response.data.stockArr)) {
          this.stockNames = response.data.stockArr.filter(stock => stock.quantity > 0);
          this.stocks = response.data.stockArr;
        } else {
          console.error("StockArr is not an array");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
},

};
</script>
