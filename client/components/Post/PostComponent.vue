<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineProps, ref } from "vue";
import { useUserStore } from '../../stores/user';
import { formatDate } from "../../utils/formatDate";
import EditPostForm from "./EditPostForm.vue";

const props = defineProps(["post", "tags", "profile"]);
const post = props.post;
const tags = props.tags; 
const profile = props.profile; 
const {currentUsername} = storeToRefs(useUserStore());
const canEdit = (profile.username == currentUsername.value); 
const editMode = ref(false);

const postUpdated = ref(post.dateCreated !== post.dateUpdated); 

function switcMode(){
  editMode.value = true; 
}
console.log(props);
</script>

<template>
  <section class ="postBlock" v-if="!editMode">
    <img class="postAvatar" :src="profile.avatar" />
    <div style="margin-left: 7em; margin-top: -5.5em;">
      <RouterLink :to="{ name: 'Profile', params: { user: profile.username} }"
       class="routerLink">{{ profile.username }}</RouterLink>
      <article class="timestamp">
        <p v-if="postUpdated">Edited on: 
        {{ formatDate(post.dateUpdated? post.dateUpdated: new Date()) }}</p>
        <p v-else>Created on: {{ formatDate(post.dateCreated? post.dateCreated: new Date() ) }}</p>
      </article>
      <button v-if="canEdit" class="editButton" v-on:click="switcMode()">Edit</button>
    </div>
    <section class="postContent">
      <p class="heading" style="margin: 1em 0;">{{ post.caption }}</p>
        <img class="postImage" :src="post.content" style="margin-bottom: 1em;" />
      <p></p>
      <span v-for="tag in tags">
        <RouterLink :to="{name: 'PostList', params: {tagname: tag.tagName}}" 
        class="tag">{{ tag.tagName }}</RouterLink>
      </span>
    </section>
  </section>

  <EditPostForm class="postBlock" :post="post" :tags="tags" v-else />
  <!-- <p class="author">{{ props.post.author }}</p>
  <p>{{ props.post.content }}</p>
  <div class="base">
    <menu v-if="props.post.author == currentUsername">
      <li><button class="btn-small pure-button" @click="emit('editPost', props.post._id)">Edit</button></li>
      <li><button class="button-error btn-small pure-button" @click="deletePost">Delete</button></li>
    </menu>
  
  </div> -->
  
</template>

<style scoped>
p {
  margin: 0em;
}
.postImage{
  width: 100%;
}
.author {
  font-weight: bold;
  font-size: 1.2em;
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
.postAvatar{
  width: 5em;
  height: 5em;
  border-radius: 0.5em;
}
.editButton{
  padding: 5px 8px;
  margin-top: 0.5em;
  font-family: century-gothic;
  text-transform: uppercase;
  letter-spacing: 1px;
}
</style>
