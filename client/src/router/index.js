import { createRouter, createWebHistory } from "vue-router";
import DonationForm from "../views/DonationForm.vue";
import HomePage from "../views/HomePage.vue";
import RegisterPage from "../views/RegisterPage.vue";
import LoginPage from "../views/LoginPage.vue";
import ProfilePage from "../views/ProfilePage.vue";
import MosquesPage from "../views/MosquesPage.vue";
import AdminDashboard from "../views/AdminDashboard.vue";
import ErrorPage from "../views/ErrorPage.vue";
import { useUserStore } from "../store/index";

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
    beforeEnter: (to, from, next) => {
      const user = useUserStore();
      if (user.isLoggedIn) {
        next();
      } else {
        next({ name: 'home' });
      }
    }
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfilePage,
    beforeEnter: (to, from, next) => {
      const user = useUserStore();
      if (user.isLoggedIn) {
        next();
      } else {
        next({ name: 'home' });
      }
    }
  },
  {
    path: "/mosquesInfo",
    name: "mosquesInfo",
    component: MosquesPage,
    beforeEnter: (to, from, next) => {
      const user = useUserStore();
      if (user.isLoggedIn) {
        next();
      } else {
        next({ name: 'home' });
      }
    }
  },
  {
    path: "/adminDashboard",
    name:"adminDashboard",
    component: AdminDashboard,
    beforeEnter: (to, from, next) => {
      const user = useUserStore();
      if (user.isAdmin) {
        next();
      } else {
        next({ name: 'home' });
      }
    }
  },
  {
    path: "/register",
    name: "register",
    component: RegisterPage,
    beforeEnter: (to, from, next) => {
      const user = useUserStore();
      if (!user.isLoggedIn) {
        next();
      } else {
        next({ name: 'home' });
      }
    }
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
    beforeEnter: (to, from, next) => {
      const user = useUserStore();
      if (!user.isLoggedIn) {
        next();
      } else {
        next({ name: 'home' });
      }
    }
  },
  {
    path: '/:catchAll(.*)',
    component: ErrorPage // Use your error component for all undefined routes
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
