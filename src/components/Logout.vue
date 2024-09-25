<template>
  <div>
    <!-- Logout button with color "error" indicating it as a critical action -->
    <v-btn color="error" @click="logout">Logout</v-btn>
    <!-- Triggers the `logout` method when clicked -->
  </div>
</template>

<script>
import Eventservices from "../server/Eventservices"; // Importing Eventservices for API interaction

export default {
  name: "Logout", // Component name
  computed: {
    // Computed property to access user logs from Vuex store
    userLogs() {
      return this.$store.state.userLogs; // Returns the `userLogs` from Vuex store state
    },
  },
  methods: {
    // Method to handle user logout process
    logout() {
      // Constructing a user object with the current user's ID
     
      // Calling the API service to update the user's log history
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
    },
  },
};
</script>
