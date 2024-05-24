<template>
  <div class="container mt-3">
    <div class="container-fluid">
      <h1 class="text-center">
        Test Login
      </h1>
      <NuxtLink
        class=""
        to="/"
      >
        Home
      </NuxtLink>
      <NuxtLink
        class="ms-3"
        to="/testapi"
      >
        Test API
      </NuxtLink>
      <NuxtLink
        class="ms-3"
        to="/pageone"
      >
        Page One
      </NuxtLink>
      <NuxtLink
        class="ms-3"
        to="/pagetwo"
      >
        Page Two
      </NuxtLink>
      <div class="row mt-3">
        <!-- test login button -->
        <div class="col-xs-2 col-sm-3 col-md-3 col-lg-auto mb-3">
          <button
            class="btn btn-primary me-3"
            style="width: 10rem"
            @click="testLogin"
          >
            Test Login
          </button>
        </div>

        <!-- test logout button -->
        <div class="col-xs-2 col-sm-3 col-md-3 col-lg-auto mb-3">
          <button
            class="btn btn-primary me-3"
            style="width: 10rem"
            @click="testLogout"
          >
            Test Logout
          </button>
        </div>

        <!-- login status indicator -->
        <div class="col-xs-2 col-sm-3 col-md-3 col-lg-auto mb-3">
          <div
            class="indicator"
            :class="statusClass"
          >
            Login Status
          </div>
        </div>

        <!-- message -->
        <div class="row">
          <div class="col">
            <p class="fw-bold">
              {{ msg }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const msg = ref('Press \'Test Login\' Button')
const statusClass = ref('btn-danger')

const testLogin = async () => {
  // hardcoded data to simulate database
  const username = 'rickyg'
  const password = 'example'
  const isUserInDatabase = true

  // add your code to check if username, password in database
  // simulated success for testing
  if (isUserInDatabase) {
    if ((await smvpGetOAuthToken(username, password)) == 200) {
      msg.value = 'Login Successful'
    }
    else {
      msg.value = 'Login Error'
    }
    getLoginStatus()
  }
}

const testLogout = () => {
  if (smvpLogout()) {
    // user is logged out
    msg.value = 'Logout Successful'
  }
  else {
    // error
    msg.value = 'Logout Error'
  }
  getLoginStatus()
}

const getLoginStatus = async () => {
  if (await smvpGetLoginStatus()) {
    statusClass.value = 'go'
  }
  else {
    statusClass.value = 'stop'
  }
}

onMounted(() => {
  getLoginStatus()
})
</script>

<style scoped>
.indicator {
  display: inline-block;
  font-weight: 400;
  line-height: 1.5;
  color: #fff;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  background-color: #dc3545;
  border-color: #dc3545;
  border: 1px solid transparent;
  width: 10rem;
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  border-radius: 0.25rem;
}

.stop {
  background-color: #dc3545;
  border-color: #dc3545;
}

.go {
  background-color: #198754;
  border-color: #198754;
}
</style>
