<template>
  <div class="container mt-3">
    <div class="container-fluid">
      <h1 class="text-center">
        Test API
      </h1>
      <NuxtLink
        class=""
        to="/"
      >
        Home
      </NuxtLink>
      <NuxtLink
        class="ms-3"
        to="/testlogin"
      >
        Test Login
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

      <div
        v-if="alert"
        class="alert alert-success alert-dismissible mt-3"
        role="alert"
      >
        saasmvp API Key Copied to Clipboard.
        <button
          type="button"
          class="btn-close"
          @click="closeAlert"
        />
      </div>

      <div class="input-group mb-3 mt-3">
        <input
          id="apikey"
          v-model="apiKey"
          type="text"
          class="form-control"
          placeholder="saasmvp API Key"
          aria-label="saasmvp API Key"
          aria-describedby="button-addon2"
        >
        <button
          id="button-addon2"
          class="btn btn-primary"
          type="button"
          @click="copyAPIKey"
        >
          Copy
        </button>
      </div>
      <button
        id="btn-genapikey"
        class="btn btn-primary"
        type="button"
        @click="genApiKey"
      >
        Generate API Key
      </button>

      <!-- test api http methods -->
      <div class="card mt-3">
        <!-- style="width: 18rem" -->
        <div class="card-body">
          <h5 class="card-title">
            Test HTTP REST API Endpoints
          </h5>
          <!-- GET -->
          <div class="row mt-3">
            <div class="col-auto">
              <button
                class="btn btn-primary btn-width"
                @click="getMethod"
              >
                GET
              </button>
            </div>
            <div class="col">
              {{ status.get }}
            </div>
          </div>

          <!-- POST -->
          <div class="row mt-3">
            <div class="col-auto">
              <button
                class="btn btn-primary btn-width"
                @click="postMethod"
              >
                POST
              </button>
            </div>
            <div class="col">
              {{ status.post }}
            </div>
          </div>

          <!-- PUT -->
          <div class="row mt-3">
            <div class="col-auto">
              <button
                class="btn btn-primary btn-width"
                @click="putMethod"
              >
                PUT
              </button>
            </div>
            <div class="col">
              {{ status.put }}
            </div>
          </div>

          <!-- PATCH -->
          <div class="row mt-3">
            <div class="col-auto">
              <button
                class="btn btn-primary btn-width"
                @click="patchMethod"
              >
                PATCH
              </button>
            </div>
            <div class="col">
              {{ status.patch }}
            </div>
          </div>

          <!-- DELETE -->
          <div class="row mt-3">
            <div class="col-auto">
              <button
                class="btn btn-primary btn-width"
                @click="deleteMethod"
              >
                DELETE
              </button>
            </div>
            <div class="col">
              {{ status.delete }}
            </div>
          </div>

          <!-- Dynamic Parameters Example -->
          <div class="row mt-3">
            <div class="col-auto">
              <button
                class="btn btn-primary btn-width"
                @click="dynamicParameter"
              >
                Dynamic
              </button>
            </div>
            <div class="col">
              {{ status.dynamic }}
            </div>
          </div>

          <!-- Dynamic Nested Parameters Example -->
          <div class="row mt-3">
            <div class="col-auto">
              <button
                class="btn btn-primary btn-width"
                @click="nestedParameter"
              >
                Nested
              </button>
            </div>
            <div class="col">
              {{ status.nested }}
            </div>
          </div>

          <!-- Query Parameters Example -->
          <div class="row mt-3">
            <div class="col-auto">
              <button
                class="btn btn-primary btn-width"
                @click="queryParameter"
              >
                Query
              </button>
            </div>
            <div class="col">
              {{ status.query }}
            </div>
          </div>
          <!-- End -->
        </div>
      </div>

    <!-- end -->
    </div>
  </div>
</template>

<script setup lang="ts">
const apiKey = ref()
const alert = ref(false)
const status = ref({
  get: 'get',
  post: 'post',
  put: 'put',
  patch: 'patch',
  delete: 'delete',
  dynamic: 'dynamic',
  nested: 'nested',
  query: 'query',
})

const copyAPIKey = () => {
  const apikey = document.getElementById('apikey') as HTMLInputElement
  if (apikey !== null) {
    apikey.select()
    apikey.setSelectionRange(0, 99999)
    navigator.clipboard.writeText(apikey.value)
    alert.value = true
  }
}

const closeAlert = () => {
  alert.value = false
}

const getMethod = async () => {
  if (apiKey.value == null) {
    status.value.get = 'Generate API Key First'
    return
  }

  const response = await useMethod('GET', apiKey.value)
  console.log(response)
  status.value.get = response!.message
  return
}

const postMethod = async () => {
  if (apiKey.value == null) {
    status.value.post = 'Generate API Key First'
    return
  }

  const response = await useMethod('POST', apiKey.value)
  status.value.post = response!.message
  return
}

const putMethod = async () => {
  if (apiKey.value == null) {
    status.value.put = 'Generate API Key First'
    return
  }
  const response = await useMethod('PUT', apiKey.value)
  status.value.put = response!.message
  return
}

const patchMethod = async () => {
  if (apiKey.value == null) {
    status.value.patch = 'Generate API Key First'
    return
  }

  const response = await useMethod('PATCH', apiKey.value)
  status.value.patch = response!.message
  return
}

const deleteMethod = async () => {
  if (apiKey.value == null) {
    status.value.delete = 'Generate API Key First'
    return
  }
  const response = await useMethod('DELETE', apiKey.value)
  status.value.delete = response!.message
  return
}

const useMethod = async (method: string, token: string) => {
  const body = Object.assign({}, { endpoint: '/api/v1/apitest', method: method })
  let options: object

  if (method != 'GET') {
    options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-TOKEN': token,
      },
      body: JSON.stringify(body),
    }
  }
  else {
    options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-TOKEN': token,
      },
    }
  }

  try {
    // wait for the `fetch()` call to be settled
    const response = await fetch('/api/v1/apitest', options)
    // wait for the `response.json()` call to be settled
    const json = await response.json()
    return { message: json.message, status: json.status }
  }
  catch (error) {
    console.log(error)
  }
}

const dynamicParameter = async () => {
  if (apiKey.value == null) {
    status.value.dynamic = 'Generate API Key First'
    return
  }

  const name = 'rickyg'
  const url = `api/v1/dynamic/${name}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-TOKEN': apiKey.value,
      },
    })
    const json = await response.json()
    if (json.status == 200) {
      status.value.dynamic = json.data
    }
    else {
      // json.status = 401
      status.value.dynamic = json.message
    }
  }
  catch (error) {
    console.log(error)
  }
}

const nestedParameter = async () => {
  if (apiKey.value == null) {
    status.value.nested = 'Generate API Key First'
    return
  }

  const name = 'rickyg'
  const url = `api/v1/nested/${name}/nested`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-TOKEN': apiKey.value,
      },
    })
    const json = await response.json()
    if (json.status == 200) {
      status.value.nested = json.data
    }
    else {
      // json.status = 401
      status.value.nested = json.message
    }
  }
  catch (error) {
    console.log(error)
  }
}

const queryParameter = async () => {
  if (apiKey.value == null) {
    status.value.query = 'Generate API Key First'
    return
  }

  const lastName = 'Smith'
  const age = 30
  const url = `api/v1/query?lastName=${lastName}&age=${age}`

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-TOKEN': apiKey.value,
      },
    })
    const json = await response.json()
    if (json.status == 200) {
      status.value.query = json.data
    }
    else {
      // json.status = 401
      status.value.query = json.message
    }
  }
  catch (error) {
    console.log(error)
  }
}

const genApiKey = async () => {
  const acctNum = '1111'
  apiKey.value = await smvpGetOAuthApiKey(acctNum)
}
//
</script>

<style scoped>
.btn-width {
  width: 8rem;
}

.input-label {
  background-color: black;
  color: white;
}
</style>
