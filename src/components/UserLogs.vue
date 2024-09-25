<template>
  <div>
    <!-- Include the System component -->
    <System />
    <br /><br />
    <v-container>
      <v-data-table
        :headers="headers"
        :items="userLogs"
        class="warning black--text elevation-1"
      >
        <template v-slot:column.headers="{ headers }">
          <thead>
            <tr>
              <!-- Iterate over headers to generate table column headers -->
              <th v-for="header in headers" :key="header.value">
                {{ header.text }}
              </th>
            </tr>
          </thead>
        </template>

        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.userId }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.logintime }}</td>
            <td>{{ item.logindate }}</td>
            <td>{{ item.role }}</td>
            <td>{{ item.logouttime }}</td>
            <td>{{ item.logoutdate }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>

<script>
import Eventservices from "../server/Eventservices"; // Import service to fetch user logs
import System from "./System.vue"; // Import System component

export default {
  name: "UserLogs", // Name of the component
  components: {
    System, // Register the System component
  },
  data() {
    return {
      userLogs: [], // Data property to store user logs
      headers: [
        // Headers for the data table columns
        { text: "User ID", value: "userId" },
        { text: "Type", value: "type" },
        { text: "Login Time", value: "logintime" },
        { text: "Login Date", value: "logindate" },
        { text: "Role", value: "role" },
        { text: "Logout Time", value: "logouttime" },
        { text: "Logout Date", value: "logoutdate" },
      ],
    };
  },

  methods: {
    // Method to format date strings
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString(); // Convert date string to localized date format
    },
  },
  created() {
    // Fetch user logs and handle errors gracefully
    Eventservices.getUserLogs()
      .then((response) => {
        console.log(response.data.userlogs);
        
        if (response.data && response.data.userlogs) {
          // Ensure userlogs exists before processing
          this.userLogs = response.data.userlogs.map(log => ({
            userId: log.Userid,
            type: log.Type,
            logintime: log.login_time,
            logindate: log.login_date,
            role: log.Role,
            logouttime: log.logout_time ,
            logoutdate: log.logout_date 
          }));
        } else {
          // Handle the case where userlogs is null or undefined
          this.userLogs = [];
          console.warn("No user logs found in the response");
        }
      })
      .catch((err) => {
        console.error("Error fetching user logs:", err); // Log any errors that occur during data fetching
        this.userLogs = []; // Clear user logs on error
      });

    // Check if the user is logged in and handle accordingly
    const user = this.$store.state.CurrentUser;
    if (user === null) {
      Eventservices.updateuserloghistory()
        .then((response) => {
          console.log("User log history updated:", response); // Log the response for debugging
        })
        .catch((res) => {
          console.error("Error updating user log history:", res); // Log any errors that occur during update
        });
      this.$router.push('/'); // Redirect to home if user is logged in
    }
  },
};
</script>

<style scoped>
/* Any scoped styles can be added here */
</style>
