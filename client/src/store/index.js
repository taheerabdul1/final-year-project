import { defineStore } from "pinia";
import router from "../router/index";

const initialUserState = {
  _id: 0,
  username: "",
  name: "",
  email: "",
  password: "",
  isAdmin: false,
  chosenMosqueId: "",
  chosenMosqueName: "",
  isLoggedIn: false,
};

export const useUserStore = defineStore("user", {
  state: () => {
    const storedUserState = localStorage.getItem("user");
    return storedUserState ? JSON.parse(storedUserState) : initialUserState;
  },
  actions: {
    async loggedIn() {
      try {
        const response = await fetch("/api/loggedIn", {
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
          this.isAdmin = data.isAdmin;
          this.chosenMosqueId = data.chosenMosqueId;
          this.chosenMosqueName = data.chosenMosqueName,
          localStorage.setItem("user", JSON.stringify(this.$state));
        } else {
          this.isLoggedIn = false;
          localStorage.removeItem("user");
        }
      } catch (e) {
        console.log(e);
      }
    },
    async logout() {
      const response = await fetch("/api/logout", {
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
        this.isAdmin = false;
        this.chosenMosqueId = null;
        this.chosenMosqueName = '';
        localStorage.clear();
      }
    },
    async login() {
      try {
        const response = await fetch("/api/login", {
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
            this.isAdmin = data.isAdmin;
            this.chosenMosqueId = data.chosenMosqueId;
            this.chosenMosqueName = data.chosenMosqueName;
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
