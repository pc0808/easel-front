<script setup lang="ts">
import { ref } from "vue";
import router from "../../router";

const author = ref("");
const tagName = ref(""); 

async function search(){
  console.log("check:", author.value, tagName.value); 
  if(author.value || tagName.value){
    router.push({name: "PostList", params:{user: author.value, tagname: tagName.value}});
  }
}
</script>

<template>
  <form @submit.prevent="search" class="profileBlock">
    <fieldset>
      <legend class="heading">Search Posts</legend>
      <input type="text" style="padding: 0.5em;" v-model="author" placeholder="Username" />
      <input type="text" style="padding: 0.5em;margin-left: 1em;" v-model="tagName" placeholder="Tag name" />
      <button type="submit" style="padding: 0.5em;" class="pure-button" @onclick="search">Search</button>
    </fieldset>
  </form>
</template>

<style scoped>
fieldset{
  border: none;
  padding: 0;
  margin: 0;
}
legend{
  text-transform: uppercase;
}
button{
  color: #ddd;
  margin-left: 2em;
}
</style>
