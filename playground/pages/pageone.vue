<template>
  <div class="container mt-3">
    <h1 class="text-center">
      Page One
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
      to="/pagetwo"
    >
      Page Two
    </NuxtLink>
    <p class="fw-bold mt-3">
      Protected by smvp-pageauth Client Middleware
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['smvp-pageauth'],
})
</script>
