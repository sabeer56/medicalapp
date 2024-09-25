import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    final_netPayable: 0,

    currentBill: [
      {
        billNo: "",

        name: "",
        quantity: 0,
        brand: "",
        gst: 0,

        total: 0, // Assuming billData.total is used for billAmount
        // Assuming billData.gst is used for billGst
        date: "", // Use current date as an example
        userId: "", // Replace with actual user ID from your application
        netPayable: 0,
      },
    ],

    AllDaySales: [
      {
        billNo: "B001",

        name: "Atarax 25mg Tablet",
        quantity: 6,
        brand: "sd",
        gst: 100,

        total: 1000, // Assuming billData.total is used for billAmount
        // Assuming billData.gst is used for billGst
        date: "25/6/2024", // Use current date as an example
        userId: "user123", // Replace with actual user ID from your application
        netPayable: 0,
      },
    ],
    todaySalesTotal: 0,
    CurrentUser: null,
    users: [
      { userId: "sabeer", password: "sab451", role: "System Admin" },
      { userId: "surya", password: "sur451", role: "Biller" },
      { userId: "sudharsan", password: "sud451", role: "Manager" },
      { userId: "sanjai", password: "san451", role: "Inventry" },
    ],
    bills: [
      {
        billNo: "B002",

        name: "Atarax 25mg Tablet",
        quantity: 6,
        brand: "sd",
        gst: 100,

        total: 1000, // Assuming billData.total is used for billAmount
        // Assuming billData.gst is used for billGst
        date: "25/6/2024", // Use current date as an example
        userId: "user123", // Replace with actual user ID from your application
        netPayable: 2000,
      },
    ],
    userLogs: [],
    stocks: [
      {
        name: "Atarax 25mg Tablet",
        brand: "sd",
        qty: 6,
        unitPrice: 200,
        totalPrice: 1200,
      },
      {
        name: "Amoxyclav 625 Tablet",
        brand: "TDV",
        qty: 40,
        unitPrice: 150,
        totalPrice: 60000,
      },
    ],
  },
  mutations: {
    addCurrentBill(state, billItems) {
      this.state.currentBill.push(billItems);
    },

    SET_TODAY_SALES_TOTAL(state, total) {
      state.todaySalesTotal = total;
    },
    SET_ALL_SALES_TOTAL(state, data) {
      state.AllDaySales.push(data);
    },
    setCurrentUser(state, user) {
      state.currentUser = user;
    },

    addStock(state, newStock) {
      const existingStock = state.stocks.find(
        (stock) => stock.name === newStock.name
      );
      if (existingStock) {
        throw new Error("Stock already exists.");
      } else {
        state.stocks.push(newStock);
      }
    },
    updateLog(state, { index, updatedLog }) {
      // Use Vue.set to ensure reactivity
      Vue.set(state.userLogs, index, updatedLog);
    },
    updateStock(state, updatedStock) {
      const index = state.stocks.findIndex(
        (stock) => stock.name === updatedStock.name
      );
      if (index !== -1) {
        state.stocks[index].qty = updatedStock.qty;
        state.stocks[index].unitPrice = updatedStock.unitPrice;
        state.stocks[index].totalPrice =
          state.stocks[index].unitPrice * state.stocks[index].qty;
      } else {
        console.error("Stock not found:", updatedStock.name);
      }
    },
    addLog(state, log) {
      state.userLogs.push(log);
    },
    addUser(state, newUser) {
      if (!state.users.some((user) => user.userId === newUser.userId)) {
        state.users.push(newUser);
      } else {
        console.error("User already exists!");
      }
    },
    ADD_BILL(state, bill) {
      state.bills.push(bill);
    },
    // Other mutations as needed
  },
  actions: {
    async calculateAndUpdateTodaySales({ state, commit }) {
      const date = new Date();
      const day = date.getDay();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const val = day + "/" + month + "/" + year;
      // Calculate today's sales total
      const totalSales = state.bills
        .filter((bill) => bill.date === val)
        .reduce((acc, bill) => acc + bill.billAmount, 0);

      // Commit mutation to update today's sales total in state
      commit("SET_ALL_SALES_TOTAL", totalSales);
      return this.state.todaySalesTotal;
    },
    async fetchBillsByDateRange({ state }, { from, to }) {
      try {
        const bills = state.bills.filter(
          (bill) => bill.date >= from && bill.date <= to
        );
        return bills;
      } catch (error) {
        console.error("Error fetching bills by date range:", error);
        throw error;
      }
    },
    addStock({ commit }, newStock) {
      commit("addStock", newStock);
    },
    async addUser({ commit, state }, newUser) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        if (!state.users.some((user) => user.userId === newUser.userId)) {
          commit("addUser", newUser);
          return true;
        } else {
          console.error("User already exists!");
          return false;
        }
      } catch (error) {
        console.error("Error adding user:", error);
        throw error;
      }
    },
    async loginUser({ commit, state }, { userId, password, InDate }) {
      try {
        console.log(InDate);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const user = state.users.find(
          (user) => user.userId === userId && user.password === password
        );
        if (user) {
          const log = {
            userId: user.userId,
            InType: "Login",
            InDate: new Date().toLocaleString(),
            role: user.role,
            OutType: "",
            OutDate: "",
          };
          commit("addLog", log);
          return log;
        } else {
          throw new Error("Invalid credentials");
        }
      } catch (error) {
        console.error("Login error:", error);
        throw error;
      }
    },
    async addBill({ commit }, bill) {
      try {
        // Simulate async operation (replace with actual saving logic)
        await new Promise((resolve) => setTimeout(resolve, 500));

        commit("ADD_BILL", bill);
      } catch (error) {
        console.error("Error adding bill:", error);
        throw error;
      }
    },
    // Other actions like checkUserExists, logoutUser, etc.
  },
  getters: {
    getCurrentUser: (state) => state.currentUser,
    allBills: (state) => state.bills,
    allStocks: (state) => state.stocks,
    getUserLogs: (state) => state.userLogs,
    getUsers: (state) => state.users,
    getUserById: (state) => (userId) => {
      const user = state.users.find((user) => user.userId === userId);
      return user ? user.role : null;
    },
    // Other getters as needed
  },
  modules: {
    // Add modules if any
  },
});
