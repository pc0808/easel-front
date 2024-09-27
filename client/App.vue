<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { currentUsername } = useUserStore(); 
const { toast } = storeToRefs(useToastStore());
let loaded = ref(false); 

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
  loaded.value = true; 
});

</script>

<template>
  <link rel="stylesheet" href="https://use.typekit.net/oov2wcw.css">
  <header>
    <nav>
      <div class="title">
        <img src="@/assets/images/logo.svg" />
        <RouterLink :to="{ name: 'Home' }">
          <h1 class = "title">Easel</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink class="navLink" :to="{ name: 'Home' }" :class="{ curr: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="loaded && isLoggedIn">
          <RouterLink class="navLink" :to="{ name: 'Settings' }" :class="{ curr: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li v-else>
          <RouterLink class="navLink" :to="{ name: 'Login' }" :class="{ curr: currentRouteName == 'Login' }"> Login </RouterLink>
        </li>
        <li v-if="loaded && isLoggedIn">
          <RouterLink class="navLink" :to="{ name: 'Profile', params: { user: currentUsername} }" 
          :class="{ curr: currentRouteName == 'Profile' }"> Profile </RouterLink>
        </li>
        <li v-if="loaded && isLoggedIn">
          <RouterLink class="navLink" :to="{ name: 'Search' }" :class="{ curr: currentRouteName == 'Search' }"> Search </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 6em;
  background-color: #111;
  color: #eee;
  display: flex;
  align-items: center;
}
.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
  color: #eee;
}

img {
  height: 2em;
}
a {
  font-size: large;
  color: #ddd;
  text-decoration: none;
  font-family: century-gothic;
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.curr {
  font-weight: bold;
  color: aqua;
}
.navLink:hover{
  color:aqua;
}
h1.title{
  font-size: 200%;
}
</style>
