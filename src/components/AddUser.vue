<template>
  <!-- Vuetify's v-app component serves as the root element for the application -->
  <v-app>
    <!-- System component presumably represents some global application layout or functionality -->
    <System />

    <!-- Card component to encapsulate the form for adding a new user -->
    <v-card width="400" class="mx-auto mt-5">
      <!-- Card title for the user addition form -->
      <v-card-title class="text-h5 pb-2">Add User</v-card-title>
      <v-card-text>
        <!-- Form component that holds input fields and validation -->
        <v-form ref="form">
          <!-- Text field for User ID with validation rules -->
          <v-text-field
            v-model="userId"
            :rules="userIdRules"
            label="User ID"
            prepend-icon="mdi-account"
            outlined
            required
          ></v-text-field>

          <!-- Text field for Password with validation rules and toggle visibility -->
          <v-text-field
            v-model="password"
            :rules="passwordRules"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="showPassword = !showPassword"
            outlined
            required
          ></v-text-field>

          <!-- Select dropdown for user role with validation rules -->
          <v-select
            v-model="selectedRole"
            :items="roleOptions"
            :rules="roleRules"
            label="Role"
            outlined
            required
          ></v-select>

          <!-- Alert component to show error messages if validation fails -->
          <v-alert v-if="error" type="error" dense>{{ errorMessage }}</v-alert>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <!-- Button to trigger adding a new user -->
        <v-btn color="primary" @click="addNewUser">Add User</v-btn>

        <!-- Button to navigate back to the previous page -->
        <v-btn color="black darken-1" text @click="backClick">Back</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      :position="snackbar.position"
      multi-line
    >
      <v-icon v-if="snackbar.icon">{{ snackbar.icon }}</v-icon>
      <span>{{ snackbar.message }}</span>
      <v-btn color="white" text @click="snackbar.visible = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import System from "./System.vue";
import Eventservices from "../server/Eventservices";

export default {
  name: "AddUser",
  components: {
    System,
  },
  data() {
    return {
      showPassword: false,
      userId: "",
      password: "",
      selectedRole: null,
      roleOptions: ["Biller", "Manager", "System Admin", "Inventory"],
      error: false,
      userIdRules: [
        (v) => !!v || "User ID is required",
        (v) => !/\s/.test(v) || "User ID cannot contain spaces",
        (v) => /^[^\s@.]+@[^\s@.]+\.[^\s@.]{2,}$/.test(v) && !/\.\./.test(v) || "User ID must be a valid email address with exactly one dot in the domain part, and no consecutive dots",
      ],
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) => (v && v.length >= 8) || "Password must be at least 8 characters long",
        (v) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v) ||
          "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
      ],
      roleRules: [(v) => !!v || "Role is required"],
      snackbar: {
        visible: false,
        color: "",
        icon: "",
        message: "",
        timeout: 7500,
        position: "top",
      },
    };
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
  methods: {
    backClick() {
      this.$router.push("/systemadmin");
    },
    addNewUser() {
      if (!this.$refs.form.validate()) {
        this.error = true;
        this.errorMessage = "Please fill out all fields correctly.";
        return;
      }

      Eventservices.getuser()
        .then((response) => {
          console.log(response.data);
          const userssql = Array.isArray(response.data.userArr)
            ? response.data.userArr
            : [];
          const userExists = userssql.find(
            (user) => user.userId === this.userId
          );
        console.log(response.data);
        
          if (userExists) {
            this.showSnackbar("error", "User ID already exists.");
          } else {
            const newUser = {
              userId: this.userId,
              password: this.password,
              role: this.selectedRole,
              Created_By: this.$store.state.CurrentUser.userid,
            };

            Eventservices.adduser(newUser)
              .then((response) => {
                this.showSnackbar("success", "User successfully created.");
                this.resetForm();
                console.log(response);
              })
              .catch((err) => {
                this.showSnackbar("error", "Failed to create user.");
                console.error(err);
              });
          }
        })
        .catch((err) => {
          this.showSnackbar("error", "Error fetching user data.");
          console.error(err);
        });
    },
    showSnackbar(type, message) {
      this.snackbar = {
        visible: true,
        color: type === "error" ? "error" : "success",
        icon: type === "error" ? "mdi-alert-circle" : "mdi-check-circle",
        message: message,
        timeout: 7500,
        position: "top",
      };
    },
    resetForm() {
      this.userId = "";
      this.password = "";
      this.selectedRole = null;
      this.$refs.form.resetValidation();
    },
  },
};
</script>
