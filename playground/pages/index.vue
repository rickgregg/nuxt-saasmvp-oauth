<template>
  <div class="container mt-3">
    <h1 class="text-center">
      nuxt-saasmvp-oauth Module Playground
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
    <!-- eslint-disable vue/no-v-html -->
    <div
      class="mt-3"
      v-html="markdownToHtml"
    />
  </div>
</template>

<script setup>
import MarkdownIt from 'markdown-it'

const markdownToHtml = ref('')
const readme = async () => {
  // README.md or a symbolic link to README.md needs to be in /public directory
  // ln -s ../../README.md README.md
  const markdown = new MarkdownIt()
  try {
    const response = await fetch('./README.md')
    if (!response.ok) {
      throw new Error('Error reading ./README.md')
    }
    markdownToHtml.value = markdown.render(await response.text())
  }
  catch (error) {
    markdownToHtml.value = markdown.render(
      '### README.md or a symbolic link to README.md needs to be in the /public directory',
    )
  }
}

onMounted(async () => {
  const options = {
    logFlag: true,
    redirectRoute: '/testlogin',
  }
  smvpInitAuth(options)
  readme()
})
//
</script>
