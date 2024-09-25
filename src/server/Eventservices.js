import axios from "axios";

// Create an instance of axios with default configurations
const baseApi = axios.create({
  baseURL: `http://localhost:9090`, // Base URL for the API requests
  withCredentials: false, // Whether or not to send cookies with the requests
  headers: {
    Accept: "application/json", // Specify that the client expects JSON responses
    "Content-Type": "application/json", // Specify that the client is sending JSON data
  },
});

export default {
  getuser() {
    return baseApi.get("/getuser");
  },
  adduser(data) {
    return baseApi.post("/adduser", data);
  },
  updateuserloghistory() {
    return baseApi.put("/updateloghistory");
  },
  addloghistory(data) {
    return baseApi.post("/addloghistory", data);
  },
  getUserLogs() {
    return baseApi.get("/getuserlogs");
  },
  addstock(data) {
    return baseApi.post("/addstock", data);
  },
  updatestock(data) {
    return baseApi.post("/updatestock", data);
  },
  stockview() {
    return baseApi.get("/stockview");
  },
  stockviewNames() {
    return baseApi.get("/stockviewnames");
  },
  addBill(data) {
    return baseApi.post("/addbill", data);
  },
  addBillDetails(data) {
    return baseApi.post("/addbilldetails", data);
  },
  sales(fromDate, toDate) {
    return baseApi.get("/salesreport", {
      params: {
        from_date: fromDate,
        to_date: toDate,
      },
    });
  },
  todaysales(date) {
    return baseApi.get("/todaysales", {
      params: {
        date: date,
      },
    });
  },
  curreninventryval() {
    return baseApi.get("/currentInventry");
  },
  monthlyapi(){
    return baseApi.get("/monthlyapi")
  }
};
