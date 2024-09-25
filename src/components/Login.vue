<template>
  <v-app>
    <!-- Container with full width and height for the background image -->
    <v-container fluid fill-height>
      <!-- Background Image using v-img with 'cover' mode to ensure the image covers the container -->
      <v-img
        src="https://img.freepik.com/premium-photo/crop-doctor-with-stethoscope_23-2147796554.jpg?w=1060"
        :aspect-ratio="16 / 9"
        class="fill-height"
        contain
        lg="12"
        md="12"
        xs="12"
        sm="12"
      >
        <!-- Content inside the image, centered horizontally and vertically -->
        <v-row align="center" justify="center" class="fill-height">
          <!-- Column configuration for responsive design, adjusts size based on screen width -->
          <v-col cols="12" sm="8" md="6" lg="4">
            <!-- Card component with elevation for shadow effect and margin-top for spacing -->
            <v-card elevation="12" class="mx-auto mt-5">
              <!-- Card title section, centered text with a bottom margin -->
              <v-card-title class="pb-0">
                <h1 class="text-center mb-5 black--text">Login</h1>
                <!-- Title of the card -->
              </v-card-title>
              <!-- Card text section containing the form -->
              <v-card-text>
                <!-- Form submission handler is defined to prevent default behavior -->
                <v-form @submit.prevent="login">
                  <!-- Text field for username with an icon -->
                  <!-- Two-way binding for the username input -->
                  <v-text-field
                    v-model="UserId"
                    label="Username"
                    prepend-icon="mdi-account-circle"
                    outlined
                  ></v-text-field>
                  <!-- Text field for password with toggleable visibility -->
                  <!-- Two-way binding for the password input -->
                  <v-text-field
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    label="Password"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    outlined
                  ></v-text-field>
                  <!-- Alert message for invalid credentials -->
                  <v-alert v-if="error" type="error" class="mt-3">
                    Invalid credentials!
                  </v-alert>
                </v-form>
              </v-card-text>
              <!-- Divider to separate the form from the action buttons -->
              <v-divider></v-divider>
              <!-- Card actions section containing the login button -->
              <v-card-actions>
                <!-- Button to trigger login process -->
                <v-btn color="success" @click="login">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-img>
    </v-container>
  </v-app>
</template>

<script>
import Eventservices from "../server/Eventservices";

export default {
  name: "Login",
  data() {
    return {
      UserId: "",
      password: "",
      users: [],
      id: 0,
      showPassword: false,
      error: false,
    };
  },
  methods: {
    login() {
      // Fetch users from the API
      Eventservices.getuser()
        .then((response) => {
          // Ensure response data is an array
          if (Array.isArray(response.data.userArr)) {
            this.users = response.data.userArr;
          } else {
            console.error("Response is not an array:", response.data.userArr);
            this.users = [];
            return;
          }
        console.log(response.data.userArr);
        
          // Find if the user exists
          const userExists = this.users.find(
            (user) =>
              user.userId === this.UserId && user.password === this.password
          );

          if (userExists) {
            console.log(userExists);

            // Prepare CurrentUser object
            const CurrentUser = {
              userid: userExists.userId,
              Type: "LogIn",
              role: userExists.role,
            };
         console.log(CurrentUser);
         
            // Update Vuex state
            this.$store.state.CurrentUser = CurrentUser;
            console.log(this.$store.state.CurrentUser.role);

            // Add log history
            Eventservices.addloghistory(CurrentUser)
              .then((response) => {
                console.log("Log history response:", response);

                // Redirect based on user role
                switch (userExists.role) {
                  case "System Admin":
                    this.$router.push("/systemadmin");
                    break;
                  case "Biller":
                    this.$router.push("/biller");
                    break;
                  case "Manager":
                    this.$router.push("/manager");
                    break;
                  case "Inventry":
                    this.$router.push("/inventry"); // Corrected 'Inventory' route
                    break;
                  default:
                    this.$router.push("/");
                    break;
                }
              })
              .catch((err) => {
                console.error("Error adding log history:", err);
                this.error = true; // Show error if logging history fails
              });
          } else {
            this.error = true; // User not found
            console.log("User not found");
          }
        })
        .catch((err) => {
          console.error("An error occurred:", err);
          this.error = true; // Show error if fetching users fails
        });
    },
  },
};
</script>

<style scoped>
/* Scoped styles */
.v-card {
  background-color: rgba(
    255,
    255,
    255,
    0.9
  ); /* Semi-transparent white background */
  border-radius: 10px; /* Rounded corners */
  padding: 20px; /* Padding inside the card */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1); /* Shadow effect */
}
* {
  margin: 0;
  padding: 0;
}
.v-card-title h1 {
  font-size: 2.5rem; /* Larger font size for the title */
}
.v-btn {
  width: 100%; /* Full width button */
}
.v-divider {
  margin: 20px 0; /* Spacing above and below the divider */
}
</style>
