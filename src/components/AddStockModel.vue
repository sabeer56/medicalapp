<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn color="primary" dark v-on="on">Add Stock</v-btn>
      </template>
      <v-card>
        <v-card-title>Add New Stock</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="Medicine_name"
                  label="Medicine Name"
                  required
                  :error-messages="medicineNameErrors"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="brand"
                  label="Brand Name"
                  required
                  :error-messages="brandNameErrors"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="submitForm">Add Stock</v-btn>
          <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <v-btn color="white" text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Eventservices from "../server/Eventservices";

export default {
  name: "AddStockModal",
  data() {
    return {
      dialog: false,
      Medicine_name: "",
      brand: "",
      snackbar: {
        visible: false,
        message: "",
        color: "error"
      },
      medicineNameErrors: [],
      brandNameErrors: []
    };
  },
  created() {
    const user = this.$store.state.CurrentUser;
    if (!user) {
      Eventservices.updateuserloghistory()
        .then((response) => {
          console.log(response); // Log the response for debugging
        })
        .catch((error) => {
          console.log(error); // Log the error response for debugging
        });
      this.$router.push('/'); // Redirect to home if user is logged in
    }
  },
  methods: {
    validateField(value) {
      const trimmedValue = value.trim();

      if (value !== trimmedValue) return "Field cannot have leading or trailing spaces.";
      if (/^\d/.test(trimmedValue)) return "Field cannot start with a number.";
      if (/^[\s.]*$/.test(trimmedValue)) return "Field cannot contain only spaces or dots.";
      if (/[^a-zA-Z0-9\s]/.test(trimmedValue)) return "Field cannot contain special characters.";

      return "";
    },
    validateFields() {
      this.medicineNameErrors = [this.validateField(this.Medicine_name)].filter(Boolean);
      this.brandNameErrors = [this.validateField(this.brand)].filter(Boolean);
    },
    submitForm() {
      this.medicineNameErrors = [];
      this.brandNameErrors = [];
      this.validateFields();

      if (this.medicineNameErrors.length || this.brandNameErrors.length) {
        this.snackbar.message = "Please correct the errors before submitting.";
        this.snackbar.color = "error";
        this.snackbar.visible = true;
        return;
      }

      Eventservices.stockview()
        .then(response => {
          const exists = response.data.stockArr.some(med =>
            med.medicine_name === this.Medicine_name
          );
          console.log(response.data.stockArr);

          if (exists) {
            this.snackbar.message = "Stock with the same medicine name already exists.";
            this.snackbar.color = "error";
            this.snackbar.visible = true;
            return;
          }

          const newStock = {
            medicine_name: this.Medicine_name,
            brand: this.brand,
            Created_By: this.$store.state.CurrentUser.userid,
          };

          Eventservices.addstock(newStock)
            .then(response => {
              this.dialog = false;
              this.Medicine_name = "";
              this.brand = "";
              this.snackbar.message = "Stock added successfully.";
              this.snackbar.color = "success";
              this.snackbar.visible = true;
              this.$emit('message');
              console.log(response);
            })
            .catch(err => {
              this.snackbar.message = "Error adding stock.";
              this.snackbar.color = "error";
              this.snackbar.visible = true;
              console.error(err);
            });
        })
        .catch(err => {
          this.snackbar.message = "Error fetching stock data.";
          this.snackbar.color = "error";
          this.snackbar.visible = true;
          console.error(err);
        });
    },
    cancel() {
      this.Medicine_name = "";
      this.brand = "";
      this.dialog = false;
    }
  }
}
</script>
