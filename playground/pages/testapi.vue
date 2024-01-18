<template>
  <div class="container mt-3">
    <div class="container-fluid">
      <h1 class="text-center">Test API</h1>
      <NuxtLink class="" to="/">Home</NuxtLink>
      <NuxtLink class="ms-3" to="/testlogin">Test Login</NuxtLink>
      <NuxtLink class="ms-3" to="/testapi">Test API</NuxtLink>
      <NuxtLink class="ms-3" to="/pageone">Page One</NuxtLink>
      <NuxtLink class="ms-3" to="/pagetwo">Page Two</NuxtLink>
    
      <div
        v-if="alert"
        class="alert alert-success alert-dismissible mt-3"
        role="alert"
      >
        saasmvp API Key Copied to Clipboard.
        <button @click="closeAlert" type="button" class="btn-close"></button>
      </div>

      <div class="input-group mb-3 mt-3">
        <input
          v-model="apiKey"
          id="apikey"
          type="text"
          class="form-control"
          placeholder="saasmvp API Key"
          aria-label="saasmvp API Key"
          aria-describedby="button-addon2"
        />
        <button
          @click="copyAPIKey"
          class="btn btn-primary"
          type="button"
          id="button-addon2"
        >
          Copy
        </button>
      </div>
      <button
        @click="genApiKey"
        id="btn-genapikey"
        class="btn btn-primary"
        type="button"
      >
        Generate API Key
      </button>

      <!-- test api http methods -->
      <div class="card mt-3">
        <!-- style="width: 18rem" -->
        <div class="card-body">
          <h5 class="card-title">Test API HTTP Methods</h5>
          <!-- GET -->
          <div class="row mt-3">
            <div class="col-auto">
              <button @click="getMethod" class="btn btn-primary btn-width">
                GET
              </button>
            </div>
            <div class="col">{{ status.get }}</div>
          </div>

          <!-- POST -->
          <div class="row mt-3">
            <div class="col-auto">
              <button @click="postMethod" class="btn btn-primary btn-width">
                POST
              </button>
            </div>
            <div class="col">{{ status.post }}</div>
          </div>

          <!-- PUT -->
          <div class="row mt-3">
            <div class="col-auto">
              <button @click="putMethod" class="btn btn-primary btn-width">
                PUT
              </button>
            </div>
            <div class="col">{{ status.put }}</div>
          </div>

          <!-- PATCH -->
          <div class="row mt-3">
            <div class="col-auto">
              <button @click="patchMethod" class="btn btn-primary btn-width">
                PATCH
              </button>
            </div>
            <div class="col">{{ status.patch }}</div>
          </div>

          <!-- DELETE -->
          <div class="row mt-3">
            <div class="col-auto">
              <button @click="deleteMethod" class="btn btn-primary btn-width">
                DELETE
              </button>
            </div>
            <div class="col">{{ status.delete }}</div>
          </div>
        </div>
      </div>

    <!-- end -->
    </div>
  </div>
</template>

<script setup lang="ts">
const apiKey = ref();
const alert = ref(false);
const status = ref({
  get: "get",
  post: "post",
  put: "put",
  patch: "patch",
  delete: "delete",
});

const copyAPIKey = () => {
  const apikey = document.getElementById("apikey") as HTMLInputElement;
  if (apikey !== null) {
    apikey.select();
    apikey.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(apikey.value);
    alert.value = true;
  }
};

const closeAlert = () => {
  alert.value = false;
};

const getMethod = async () => {
  if (apiKey.value == null) {
    status.value.get = "Generate API Key First";
    return;
  }

  if ((await useMethod("GET", apiKey.value)) == 200) {
    status.value.get = "success";
  } else {
    status.value.get = "failed";
  }
  return;
};

const postMethod = async () => {
  if (apiKey.value == null) {
    status.value.post = "Generate API Key First";
    return;
  }

  if ((await useMethod("POST", apiKey.value)) == 200) {
    status.value.post = "success";
  } else {
    status.value.post = "failed";
  }
  return;
};

const putMethod = async () => {
  if (apiKey.value == null) {
    status.value.put = "Generate API Key First";
    return;
  }

  if ((await useMethod("PUT", apiKey.value)) == 200) {
    status.value.put = "success";
  } else {
    status.value.put = "failed";
  }
  return;
};

const patchMethod = async () => {
  if (apiKey.value == null) {
    status.value.patch = "Generate API Key First";
    return;
  }

  if ((await useMethod("PATCH", apiKey.value)) == 200) {
    status.value.patch = "success";
  } else {
    status.value.patch = "failed";
  }
  return;
};

const deleteMethod = async () => {
  if (apiKey.value == null) {
    status.value.delete = "Generate API Key First";
    return;
  }

  if ((await useMethod("DELETE", apiKey.value)) == 200) {
    status.value.delete = "success";
  } else {
    status.value.delete = "failed";
  }
  return;
};

const useMethod = async (method: string, token: string) => {
  const body = Object.assign({}, { endpoint: "/api/v1/apitest", method: method });
  let options: object;
  
  if (method != "GET") {
    options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-TOKEN": token,
      },
      body: JSON.stringify(body),
    };
  } else {
    options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-TOKEN": token,
      },
    };
  }

  try {
    //wait for the `fetch()` call to be settled
    const response = await fetch("/api/v1/apitest", options);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    //wait for the `response.json()` call to be settled
    const json = await response.json();
    return json.response.status;
  } catch (error) {
    console.log(error);
  }
  return 400;
};

const genApiKey = async () => {
  const acctNum = "1111";
  apiKey.value = await smvpGetOAuthApiKey(acctNum);
};
//
</script>

<style scoped>
.btn-width {
  width: 5rem;
}

.input-label {
  background-color: black;
  color: white;
}
</style>
