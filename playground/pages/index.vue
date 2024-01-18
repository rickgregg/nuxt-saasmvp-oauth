<template>
  <div class="container mt-3">
    <h1 class="text-center">nuxt-saasmvp-oauth Module Playground</h1>
    <NuxtLink class="" to="/">Home</NuxtLink>
    <NuxtLink class="ms-3" to="/testlogin">Test Login</NuxtLink>
    <NuxtLink class="ms-3" to="/testapi">Test API</NuxtLink>
    <NuxtLink class="ms-3" to="/pageone">Page One</NuxtLink>
    <NuxtLink class="ms-3" to="/pagetwo">Page Two</NuxtLink>
    <div class="mt-3" v-html="markdownToHtml"></div>    
  </div>
</template>

<script setup>
import MarkdownIt from "markdown-it";
import protect from '../playground/server/api/protected.json' 

const markdownToHtml = ref("");
const readme = async () => {
  //README.md or a symbolic link to README.md needs to be in /public directory
  //ln -s ../../README.md README.md
  const markdown = new MarkdownIt();
  try {
    const response = await fetch("./README.md");
    if (!response.ok) {
      throw new Error();
    }
    markdownToHtml.value = markdown.render(await response.text());
  } catch (error) {
    markdownToHtml.value = markdown.render(
      "### README.md or a symbolic link to README.md needs to be in the /public directory"
    );
  }
};

onMounted(async () => {
  const options = {
    jwtKey: "FF92528C6D4C441CF853CF99E55E4129", 
    jwtKeyExpires: "7200",
    boundryTime: 125,
    logFlag: true,
    redirectRoute: "/testlogin", 
  };
  smvpInitAuth(protect, options)
  readme()
});
//
</script>
