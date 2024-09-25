<template>
  <!-- Container for the entire toolbar section, allowing for full-width styling -->
  <v-container fluid>
    <!-- Toolbar component for the header area, with dense and dark styling -->
    <v-toolbar dense tabs color="light green" dark>
      <!-- Toolbar title placeholder (empty in this case) -->
      <v-toolbar-title class="pl-2"></v-toolbar-title>

      <!-- Icon representing cash, styled with white text color -->
      <h1><v-icon class="white--text">mdi-cash-multiple</v-icon></h1>

      <!-- Spacer to push content to the left and right sides of the toolbar -->
      <v-spacer></v-spacer>

      <!-- Tabs component for navigation within the toolbar -->
      <!-- Bind the active tab to the `tabs` data property -->
      <v-tabs
        v-model="tabs"
        color="transparent"
        slider-color="white"
        slot="extension"
        @click:tab="handleTabClick"
      >
        <!-- Iterate over each tab item -->
        <v-tab
          v-for="tabsItem in tabsItems"
          class="ml-5"
          :key="tabsItem.id"
          :to="tabsItem.link"
          @click.stop.prevent
        >
          {{ tabsItem.title }}
        </v-tab>
      </v-tabs>
      <!-- Button to trigger the logout action -->
      <v-btn @click="logoutClick" color="black" text>
        <!-- Icon for the logout button -->
        <v-icon left>mdi-logout</v-icon>
        <!-- Logout component that may contain additional functionality or UI -->
        <Logout />
      </v-btn>
    </v-toolbar>
  </v-container>
</template>

<script>
// Import Logout component from specified path
import Logout from "../components/Logout.vue";

export default {
  name: "Bill",
  components: {
    Logout,
  },
  data() {
    return {
      tabs: null,
      tabsItems: [
        { id: 1, title: "Home", link: "/biller" },
        { id: 2, title: "Stock View", link: "/stock-view" },
        { id: 3, title: "Bill Entry", link: "/bill" },
      ],
    };
  },
  methods: {
    handleTabClick(event) {
      // This method can be used for additional custom logic if needed
      // e.g., logging, analytics, etc.
      console.log("Tab clicked:", event);
    },
    logoutClick() {
      // Handle logout action
      // Example: Redirect to home and perform logout actions
      this.$router.push("/");
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
  background-color: green; /* Set toolbar background color */
}

.v-icon.black--text {
  color: black; /* Set icon color */
}

.v-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12); /* Bottom border for tabs */
}

.v-tabs-bar {
  background-color: #4caf50; /* Background color of tabs */
}

.v-tab {
  color: rgb(0, 0, 0); /* Text color of tabs */
}

.v-btn {
  color: white; /* Text color of button */
}

* {
  margin: 0;
  padding: 0;
}
</style>
