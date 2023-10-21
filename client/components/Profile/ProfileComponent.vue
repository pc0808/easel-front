<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import ProfileForm from "./ProfileForm.vue";

const props = defineProps(["profile"]);
const emit = defineEmits(["updateProfile", "refreshProfile"]);
const { currentUsername } = storeToRefs(useUserStore());

const biography = props.profile.biography; 

function switchEdit() {
  const form = document.getElementById("editForm");
  const button = document.getElementById("editButton");
  console.log("Hello?");
  if(form && button) {
    if(form.style.display === "block"){
      form.style.display = "none";
      button.innerText = "Edit";
    }
    else{
      form.style.display = "block" 
      button.innerText = "Cancel";
    } 
  }
}

</script>

<template>
  <section class="profile">
    <p class="username">{{ props.profile.username }}</p>
    <p>{{ props.profile.biography }}</p>
    <img :src=props.profile.avatar class="avatar"/>
    <div class="base">
      <menu v-if="props.profile.username == currentUsername">
        <li><button v-on:click="switchEdit()" id="editButton">Edit</button></li>
        <div else id="editForm"  > 
          <ProfileForm :currBiography="biography" />
        </div>
      </menu>
    </div>
  </section>
</template>

<style scoped>
p {
  margin: 0em;
}

#editForm{
  display: none;
}
.username {
  font-weight: bold;
  font-size: 1.2em;
}
.profile{
  justify-content: center;
}

menu {
  list-style-type: none;
  display: flex;
  flex-direction: row;
  gap: 1em;
  padding: 0;
  margin: 0;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
