import { createRouter, createWebHistory } from "vue-router";
import DonationForm from "../views/DonationForm.vue";
import HomePage from "../views/HomePage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import LoginPage from "../views/LoginPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import MosquesPage from "../views/MosquesPage.vue";
import AdminDashboard from "../views/AdminDashboard.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/makeDonation",
    name: "donationForm",
    component: DonationForm,
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
  },
  {
    path: "/mosquesInfo",
    name: "mosquesInfo",
    component: MosquesPage
  },
  {
    path: "/adminDashboard",
    name:"adminDashboard",
    component: AdminDashboard
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
