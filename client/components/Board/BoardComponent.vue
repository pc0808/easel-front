<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineProps, ref } from "vue";
import { useUserStore } from '../../stores/user';
import { formatDate } from "../../utils/formatDate";
// import EditPostForm from "./EditPostForm.vue";

const props = defineProps(["board", "tags", "profile"]);
const board = props.board;
const tags = props.tags; 
const profile = props.profile; 
const {currentUsername} = storeToRefs(useUserStore());
const canEdit = (profile.username == currentUsername.value); 
const editMode = ref(false);

const boardUpdated = ref(board.dateCreated !== board.dateUpdated); 

function switcMode(){
  // editMode.value = true; 
  console.log("toggled hehe"); 
}
</script>

<template>
  <section class ="postBlock" v-if="!editMode">
    <img class="postAvatar" :src="profile.avatar" />
    <div style="margin-left: 7em; margin-top: -5.5em;">
      <RouterLink :to="{ name: 'Profile', params: { user: profile.username} }"
       class="routerLink">{{ profile.username }}</RouterLink>
      <article class="timestamp">
        <p v-if="boardUpdated">Edited on: 
        {{ formatDate(board.dateUpdated? board.dateUpdated: new Date()) }}</p>
        <p v-else>Created on: {{ formatDate(board.dateCreated? board.dateCreated: new Date() ) }}</p>
      </article>
      <button v-if="canEdit" class="editButton" v-on:click="switcMode()">Edit</button>
    </div>
    <section class="postContent">
      <span v-for="tag in tags">
        <!-- <RouterLink :to="{name: 'PostList', params: {tagname: tag.tagName}}" 
        class="tag">{{ tag.tagName }}</RouterLink> -->
        <span class = "tag">{{tag.tagName}}</span>
      </span>
    </section>
  </section>

  <!-- <EditPostForm class="postBlock" :post="post" :tags="tags" v-else /> -->
  
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
