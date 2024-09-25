<template>
  <!-- Container for the top toolbar and navigation tabs -->
  <v-container fluid>
    <!-- Toolbar component with dense style and dark theme -->
    <v-toolbar dense tabs color="#1d2a42" dark>
      <!-- Toolbar icon for the application title or logo -->
      <h1><v-icon class="white--text">mdi-package-variant</v-icon></h1>

      <!-- Spacer to push the tabs to the right -->
      <v-spacer></v-spacer>

      <!-- Tabs component for navigation -->
      <!-- Bind tabs to data property for active tab control -->
      <v-tabs
        v-model="tabs"
        color="transparent"
        slider-color="black"
        slot="extension"
      >
        <!-- Tab items rendered dynamically from tabsItems array -->
        <!-- Loop through tabsItems to create each tab -->
        <v-tab
          v-for="tabsItem in tabsItems"
          class="ml-4"
          :key="tabsItem.id"
          :to="tabsItem.link"
        >
          {{ tabsItem.title }}
        </v-tab>
      </v-tabs>

      <!-- Button for logging out -->
      <v-btn color="red" @click="logoutClick">
        <!-- Icon inside the button -->
        <v-icon left>mdi-logout</v-icon>
        <!-- Logout component for additional functionality -->
        <Logout />
      </v-btn>
    </v-toolbar>
  </v-container>
</template>

<script>
import Logout from "../components/Logout.vue"; // Import Logout component

export default {
  name: "In", // Component name
  components: {
    Logout, // Register Logout component
  },
  data() {
    return {
      tabs: null, // Data property to control the active tab
      tabsItems: [
        // Array to define the tab items and their navigation links
        { id: 1, title: "Home", link: "/inventry" },
        { id: 2, title: "Stock View", link: "/stock-view" },
        { id: 3, title: "Stock Entry", link: "/stock-popup" },
      ],
    };
  },
  methods: {
    // Method to handle logout action
    logoutClick() {
      this.$router.push("/"); // Redirect to the home page
    },
    // Method to programmatically navigate to a specified route
    redirectTo(route) {
      this.$router.push(route); // Use Vue Router to navigate to the given route
    },
  },
};
</script>

<style scoped>
/* Scoped styles to ensure they only apply to this component */

/* Remove padding from the container */
.v-container {
  padding: 0;
}

/* Set background color of the toolbar */
.v-toolbar {
  background-color: #1d2a42;
}

/* Set color of the icons in the toolbar */
.v-icon.white--text {
  color: white;
}

/* Style for the tabs component */
.v-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12); /* Bottom border for the tabs */
}

/* Background color for the tabs bar */
.v-tabs-bar {
  background-color: #1d2a42;
}

/* Text color for the tabs */
.v-tab {
  color: white;
}

/* Reset margin and padding for all elements */
* {
  margin: 0;
  padding: 0;
}

/* Text color for the button */
.v-btn {
  color: white;
}
</style>
