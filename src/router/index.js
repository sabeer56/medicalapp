import Vue from "vue";
import VueRouter from "vue-router";
import MedApp from "../views/MedApp.vue";
import AddUser from "../components/AddUser.vue";
import UserLogs from "../components/UserLogs.vue";
import Manager from "../views/Manager.vue";
import GenarateBillForm from "../components/GenarateBillForm.vue"; // Added missing comma here
import StockView from "../components/StockView.vue";
import StockPopup from "../components/StockPopup.vue";
import SalesReport from "../components/SalesReport.vue";
import SystemAdmin from "../views/SystemAdmin.vue";
import Biller from "../views/Biller.vue";
import Inventry from "../views/Inventry.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "MedApp",
    component: MedApp,
  },

  { path: "/systemadmin", name: "SystemAdmin", component: SystemAdmin },
  { path: "/manager", name: "Manager", component: Manager },
  { path: "/inventry", name: "Inventry", component: Inventry },
  { path: "/biller", name: "Biller", component: Biller },
  { path: "/adduser", name: "AddUser", component: AddUser },
  { path: "/logs", name: "UserLogs", component: UserLogs },
  { path: "/stock-view", component: StockView },
  { path: "/stock-popup", component: StockPopup },
  { path: "/sales", name: "SalesReport", component: SalesReport }, // Added missing comma here
  { path: "/bill", name: "GenarateBillForm", component: GenarateBillForm }, // Added missing comma here
];

const router = new VueRouter({
  routes,
});

export default router;
