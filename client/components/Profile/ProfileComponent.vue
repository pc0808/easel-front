<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const props = defineProps(["profile"]);
const emit = defineEmits(["updateProfile", "refreshProfile"]);
const { currentUsername } = storeToRefs(useUserStore());

// const deletePost = async () => {
//   try {
//     await fetchy(`/api/posts/${props.post._id}`, "DELETE");
//   } catch {
//     return;
//   }
//   emit("refreshPosts");
// };
console.log(props.profile);
</script>

<template>
  <section class="profile">
  <p class="username">{{ props.profile.username }}</p>
  <p>{{ props.profile.biography }}</p>
  <img :src=props.profile.avatar class="avatar"/>
  <div class="base">
    <menu v-if="props.profile.username == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('updateProfile', props.profile._id)">Edit</button></li>
    </menu>
  </div>
</section>
</template>

<style scoped>
p {
  margin: 0em;
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

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
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
