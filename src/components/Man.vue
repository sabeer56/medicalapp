<template>
  <v-container fluid>
    <!-- Toolbar with tabs and logout button -->
    <v-toolbar dense tabs color="#a14d71" dark>
      <!-- Toolbar Icon -->
      <h1><v-icon class="black--text">mdi-account-supervisor</v-icon></h1>
      <v-spacer></v-spacer>
      <!-- Pushes elements to the far right -->

      <!-- Tabs Navigation -->
      <!-- Binds the selected tab value to the `tabs` data property -->
      <v-tabs
        v-model="tabs"
        color="transparent"
        slider-color="black"
        slot="extension"
      >
        <!-- Loops through each item in `tabsItems` array -->
        <v-tab
          v-for="tabsItem in tabsItems"
          @click="toStoretheVal"
          class="ml-6"
          :key="tabsItem.id"
          :to="tabsItem.link"
        >
          {{ tabsItem.title }}
          <!-- Displays the title of each tab -->
        </v-tab>
      </v-tabs>

      <!-- Logout Button -->
      <v-btn color="red" @click="logoutClick">
        <!-- Triggers `logoutClick` method on click -->
        <v-icon left>mdi-logout</v-icon>
        <!-- Logout icon -->
        <Logout />
        <!-- Renders the `Logout` component, assumes it has a button or similar functionality -->
      </v-btn>
    </v-toolbar>
  </v-container>
</template>

<script>
// Import Logout component
import Logout from "../components/Logout.vue";

export default {
  name: "Man",
  components: {
    Logout,
  },
  data() {
    return {
      tabs: null, // Holds the currently selected tab value
      tabsItems: [
        { id: 1, title: "Home", link: "/manager" }, // Tab for Home
        { id: 2, title: "Stock View", link: "/stock-view" }, // Tab for Stock View
        { id: 3, title: "Stock Entry", link: "/stock-popup" }, // Tab for Stock Entry
        { id: 4, title: "Sales Report", link: "/sales" }, // Tab for Sales Report
      ],
    };
  },
  methods: {
    logoutClick() {
      // Handle logout action
      // Example: Redirect to home and perform logout actions
      this.$router.push("/"); // Redirect to home page
    },
    toStoretheVal() {
      this.$store.state.selectedItem = "manager";
    },
  },
};
</script>

<style scoped>
/* Scoped styles */
.v-container {
  padding: 0; /* Remove padding from the container */
}

.v-toolbar {
  background-color: #a14d71; /* Set toolbar background color */
}

.v-icon.black--text {
  color: black; /* Set icon color */
}

.v-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12); /* Bottom border for tabs */
}

.v-tabs-bar {
  background-color: #a14d71; /* Background color of tabs */
}

.v-tab {
  color: black; /* Text color of tabs */
}

.v-btn {
  color: white; /* Text color of button */
}
* {
  margin: 0;
  padding: 0;
}
</style>
