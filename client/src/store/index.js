import { defineStore } from "pinia";
import router from "../router/index";

export const useUserStore = defineStore("user", {
  state: () => ({
    _id: 0,
    username: "",
    name: "",
    email: "",
    password: "",
    isLoggedIn: false,
  }),
  actions: {
    async loggedIn() {
      try {
        const response = await fetch("http://localhost:3000/api/loggedIn", {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          this._id = data._id;
          this.isLoggedIn = true;
          this.username = data.username;
          this.name = data.name;
          this.email = data.email;
        } else {
          this.isLoggedIn = false;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async logout() {
      const response = await fetch("http://localhost:3000/api/logout", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        this._id = 0;
        this.username = "";
        this.name = "";
        this.email = "";
        this.password = "";
        this.isLoggedIn = false;
      }
    },
    async login() {
      try {
        const response = await fetch("http://localhost:3000/api/login", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });
        if (response.status === 401) {
          alert("Wrong Username or Password");
          router.push("/login");
        } else {
          const data = await response.json();
          if (data.success) {
            alert("Login successful");
            this._id = data._id;
            this.username = data.username;
            this.name = data.name;
            this.email = data.email;
            this.loggedIn();
            router.push("/");
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
});
