<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import { usePostStore } from '../../stores/post';
import { useProfileStore } from "../../stores/profile";
import { useUserStore } from '../../stores/user';
import { formatDate } from "../../utils/formatDate";
import PostListComponent from "../Post/PostListComponent.vue";
import EditBoardForm from "./EditBoardForm.vue";

const props = defineProps(["board", "tags", "profile"]);
const board = props.board;
const tags = props.tags; 
const profile = props.profile; 

const {currentUsername} = storeToRefs(useUserStore());
const {getPostID} = usePostStore();
const {getProfile} = useProfileStore();
const canEdit = (profile.username == currentUsername.value); 
let editMode = ref(false);
let loaded = ref(false);
let posts = ref<Array<Record<string, string>>>([]);

const boardUpdated = ref(board.dateCreated !== board.dateUpdated); 

function switchMode(){
  editMode.value = true; 
}

onBeforeMount(async() => {
    for(const post of board.content)
        posts.value.push(await getPostID(post));
    
    console.log(posts.value);
    loaded.value = true; 
}); 

</script>

<template>
  <section class ="boardBlock" v-if="!editMode">
    <h2 class="boardCaption">{{ board.caption }}</h2>
    <img class="postAvatar" :src="profile.avatar" />
    <div style="margin-left: 7em; margin-top: -5.5em;">
      <RouterLink :to="{ name: 'Profile', params: { user: profile.username} }"
       class="routerLink">{{ profile.username }}</RouterLink>
      <article class="timestamp">
        <p v-if="boardUpdated">Edited on: 
        {{ formatDate(board.dateUpdated? board.dateUpdated: new Date()) }}</p>
        <p v-else>Created on: {{ formatDate(board.dateCreated? board.dateCreated: new Date() ) }}</p>
      </article>
      <button v-if="canEdit" class="editButton" v-on:click="switchMode()">Edit</button>
    </div>
    <section class="postContent">
        Tags:
      <span v-for="tag in tags">
        <RouterLink :to="{name: 'BoardList', params: {tagname: tag.tagName}}" 
        class="tag">{{ tag.tagName }}</RouterLink>
      </span>
    </section>
  </section>

  <EditBoardForm class="postBlock" :board="board" :tags="tags" v-else />
  <PostListComponent v-if="loaded && !editMode" :posts="posts" style="margin-top:-2em"/>
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
.editButton{
  padding: 5px 8px;
  margin-top: 0.5em;
  font-family: century-gothic;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.postContent{
    margin: 4em 0;
}
</style>
