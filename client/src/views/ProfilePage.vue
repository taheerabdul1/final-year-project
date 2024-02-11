<template>
  <h1>Profile</h1>
  <p>
    Below are the details stored by FundMosque for this account. <br />
    Click the update button to update your details
  </p>
  <h3>Name: {{ user.name }}</h3>
  <h3>Username: {{ user.username }}</h3>
  <h3>Email: {{ user.email }}</h3>
  <button
    class="btn btn-primary"
    data-bs-toggle="modal"
    data-bs-target="#exampleModal"
  >
    Update
  </button>

  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Update user info here</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="update(user._id)" class="register-form">
            <div class="mb-3">
              <label for="username" class="form-label">Username (cannot be changed)</label>
              <input
                class="form-control"
                v-model="user.username"
                type="text"
                disabled
                required
              />
            </div>
            <div class="mb-3">
              <label for="name" class="form-label">Full Name</label>
              <input class="form-control" v-model="user.name" type="text" required />
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">Email address</label>
              <input
                class="form-control"
                v-model="user.email"
                type="email"
                required
              />
            </div>
            <button class="btn btn-primary" type="submit" data-bs-dismiss="modal">Update</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useUserStore } from "../store/index";

export default {
  name: "ProfilePage",
  setup() {
    const user = useUserStore();
    return {
      user,
    };
  },
  methods: {
    async update(id){
      fetch(`http://localhost:3000/api/users/${id}`,{
        method:"PUT",
        credentials: "include",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.user)
      })
      .then((response)=>{
        if(!response.ok){throw response}
        return response.json()
      }).then((data)=>{
        if(data.success){
          alert('User updated successfully!');
        } else {
          throw new Error(data.message || 'Failed to update user');
        }
      }).catch((err)=>{alert(`uh oh, theres a problem\n${err.status}: ${err.statusText}`)});
    }
  }
};
</script>
