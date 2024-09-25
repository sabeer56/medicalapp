<template>
  <!-- Container for the toolbar and tabs -->
  <v-container fluid>
    <!-- Toolbar for navigation and logout -->
    <v-toolbar dense tabs color="green" dark>
      <!-- Toolbar title area (currently empty) -->
      <v-toolbar-title class="pl-2"></v-toolbar-title>

      <!-- Icon indicating the title or section (key icon) -->
      <h1><v-icon class="black--text">mdi-account-key</v-icon></h1>

      <!-- Spacer to push elements to the right -->
      <v-spacer></v-spacer>

      <!-- Tabs for navigation -->
      <!-- Binds the active tab index to the `tabs` data property -->
      <v-tabs
        v-model="tabs"
        color="transparent"
        slider-color="white"
        slot="extension"
      >
        <!-- Generate a tab for each item in `tabsItems` -->
        <!-- Loop through the tabsItems array -->
        <v-tab
          v-for="tabsItem in tabsItems"
          :key="tabsItem.id"
          :to="tabsItem.link"
        >
          {{ tabsItem.title }}
          <!-- Display the title of the tab -->
        </v-tab>
      </v-tabs>

      <!-- Button for logging out -->
      <v-btn @click="logoutClick" color="white" text>
        <!-- Logout icon -->
        <v-icon left>mdi-logout</v-icon>
        <!-- Logout component or text -->
        <Logout />
      </v-btn>
    </v-toolbar>
  </v-container>
</template>

<script>
import Logout from "@/components/Logout.vue"; // Import the Logout component
import Eventservices from "../server/Eventservices";
export default {
  name: "System", // Name of the component
  components: {
    Logout, // Register the Logout component
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
  },
  data() {
    return {
      tabs: null, // Data property to bind the active tab index
      // Array of tabs items with their titles and links
      tabsItems: [
        { id: 1, title: "Home", link: "/systemadmin" },
        { id: 2, title: "Add User", link: "/adduser" },
        { id: 3, title: "User Logs", link: "/logs" },
      ],
    };
  },
  methods: {
    // Method to handle the logout action
    logoutClick() {
      // Redirect to the home page and perform logout actions
      this.$router.push("/"); // Navigate to the home page
    },
  },
};
</script>

<style scoped>
/* Reset default margin and padding */
* {
  margin: 0;
  padding: 0;
}

/* Styles scoped to this component */

/* Style for the tabs container */
.v-tabs {
  border-bottom: 1px solid rgba(255, 255, 255, 0.12); /* Bottom border for tabs */
}

/* Style for the tabs bar background */
.v-tabs-bar {
  background-color: #4caf50; /* Green background color */
}

/* Style for individual tabs */
.v-tab {
  color: rgb(0, 0, 0); /* Black text color for tabs */
}

/* Style for buttons within the toolbar */
.v-btn {
  margin-top: 16px; /* Top margin for spacing */
}

/* Additional style for card title (though not used here, it could be relevant for similar components) */
.v-card-title {
  background-color: #000000; /* Background color for card title */
  padding: 16px; /* Padding around the title */
  margin-bottom: 16px; /* Margin below the title */
}

/* Style for card components (not used directly here but for general purpose) */
.v-card {
  margin-top: 20px; /* Top margin for card components */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Box shadow for depth effect */
}

/* Style for card title text color */
.v-card-title {
  color: #424242; /* Dark gray color for text */
}
</style>
