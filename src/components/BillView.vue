<template>
  <!-- Main container for the bill view component -->
  <div class="bill-view">
    <!-- Card to display bill details -->
    <v-card>
      <!-- Card title with styling for background color and text color -->
      <v-card-title class="headline French grey darken-1 white--text">
        Bill Details
      </v-card-title>
      <v-card-text>
        <!-- Container for bill details layout -->
        <v-container>
          <v-row>
            <!-- Column for Bill No -->
            <v-col cols="12">
              <span><strong>Bill No:</strong> {{ billno }}</span>
            </v-col>
            <!-- Column for Bill Date -->
            <v-col cols="12">
              <span><strong>Bill Date:</strong> {{ formattedDate }}</span>
            </v-col>
            <!-- Divider for visual separation -->
            <v-col cols="12">
              <v-divider></v-divider>
            </v-col>
            <!-- Column for GST -->
            <v-col cols="12">
              <span><strong>GST:</strong> {{ lastGst }}</span>
            </v-col>
            <!-- Column for Net Payable amount -->
            <v-col cols="12">
              <span><strong>Net Payable:</strong> {{ totalAmount }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <!-- Card actions for buttons -->
      <v-card-actions>
        <!-- Button to preview the bill, triggers previewBill method -->
        <v-btn color="red" @click="previewBill">Preview</v-btn>
        <!-- Button to save the bill, triggers addBill1 method -->
        <v-btn color="success" @click="addBill1">Save</v-btn>
        <!-- Button to download the bill, triggers downloadBill method -->
        <v-btn color="info" @click="downloadBill">Download</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Dialog to preview the bill -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <!-- Dialog title with styling for background color and text color -->
        <v-card-title class="headline success darken-1 white--text">
          Preview Bill
        </v-card-title>
        <v-card-text>
          <!-- Container for preview content layout -->
          <v-container>
            <!-- Row for bill preview data -->
            <v-row v-if="currentBills.length > 0">
              <!-- Divider for visual separation -->
              <v-col cols="12">
                <v-divider></v-divider>
              </v-col>
              <!-- Column for Total amount in preview -->
              <v-col cols="12">
                <span><strong>Total:</strong> {{ totalAmount }}</span>
              </v-col>
              <!-- Column for GST in preview -->
              <v-col cols="12">
                <span><strong>GST:</strong> {{ lastGst }}</span>
              </v-col>
              <!-- Data table for current bills -->
              <v-col cols="12">
                <v-data-table
                  :headers="tableHeaders"
                  :items="currentBills"
                  hide-default-footer
                >
                  <!-- Custom body slot for data table -->
                  <template v-slot:body="{ items }">
                    <tbody>
                      <!-- Loop through items to create table rows -->
                      <tr v-for="item in items" :key="item.Medicine_Name">
                        <td>{{ item.Medicine_Name }}</td>
                        <td>{{ item.Brand }}</td>
                        <td>{{ item.Quantity }}</td>
                        <td>{{ item.UnitPrice }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <!-- Row for empty state if no bills -->
            <v-row v-else>
              <v-col cols="12">
                <span>No items added to the bill.</span>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <!-- Dialog actions with a button to close the dialog -->
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeDialog">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Container for data table displaying new bills -->
    <v-container>
      <v-row>
        <v-col cols="12">
          <!-- Table headers configuration -->

          <v-data-table
            :headers="tableHeaders"
            :items="newBill"
            hide-default-footer
          >
            <!-- Custom body slot for data table -->
            <template v-slot:body="{ items }">
              <tbody>
                <!-- Loop through items to create table rows -->
                <tr v-for="item in items" :key="item.Medicine_Name">
                  <td>{{ item.Medicine_Name }}</td>
                  <td>{{ item.Brand }}</td>
                  <td>{{ item.Quantity }}</td>
                  <td>{{ item.UnitPrice }}</td>
                </tr>
              </tbody>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
    <!-- Snackbar for error messages -->
  </div>
</template>

<script>
export default {
  name: "BillView",
  props: {
    addBill1: Function, // Function to handle saving the bill, passed as a prop
    newBill: Array, // Array of new bill items, passed as a prop
    billno: String, // Bill number, passed as a prop
  },
  data() {
    return {
      dialog: false, // Controls visibility of the preview dialog
      currentBills: [], // Holds current bills for preview
      tableHeaders: [
        // Configuration for table headers
        { text: "Name", value: "Medicine_Name" },
        { text: "Brand", value: "Brand" },
        { text: "Quantity", value: "Quantity" },
        { text: "Unit Price", value: "UnitPrice" },
      ],
    };
  },
  computed: {
    formattedDate() {
      // Formats the current date as YYYY-MM-DD
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const day = String(today.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    totalAmount() {
      // Computes the total amount for the new bill
      const amount = this.newBill.reduce(
        (total, item) => total + (item.UnitPrice || 0),
        0
      );
      return amount + this.lastGst;
    },
    lastGst() {
      const amount = this.newBill.reduce(
        (total, item) => total + (item.UnitPrice || 0),
        0
      );
      return amount * 0.18;
    },
  },
  watch: {
    newBill: {
      immediate: true,
      handler(newVal) {
        // Updates currentBills when newBill prop changes
        this.currentBills = newVal; // Update currentBills based on newBill prop
      },
    },
  },
  methods: {
    previewBill() {
      // Opens the preview dialog
      this.dialog = true;
    },
    downloadBill() {
      // Converts bill data to CSV format and triggers download
      const filename = "bill_items.csv";
      const csvContent = this.convertToCSV(this.currentBills);
      this.downloadCSV(csvContent, filename);
    },
    convertToCSV(items) {
      // Converts array of objects to CSV format
      if (items.length === 0) return "No data"; // Handle empty case with a meaningful message

      const header = Object.keys(items[0])
        .map((key) => `"${key}"`)
        .join(",");
      const rows = items
        .map((item) =>
          Object.values(item)
            .map((value) => `"${value}"`)
            .join(",")
        )
        .join("\n");

      return `${header}\n${rows}`;
    },
    downloadCSV(csvContent, filename) {
      // Creates a downloadable CSV file and triggers download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement("a");
        if (link.download !== undefined) {
          // For other browsers
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
    closeDialog() {
      // Closes the preview dialog
      this.dialog = false;
    },
  },
};
</script>
