<script setup lang="ts">
import { storeToRefs } from "pinia";
import { defineProps, onBeforeMount, ref } from "vue";
import { useBoardStore } from '../../stores/board';
import { useUserStore } from '../../stores/user';
import { formatDate } from "../../utils/formatDate";
import EditPostForm from "./EditPostForm.vue";

const props = defineProps(["post", "tags", "profile"]);
const post = props.post;
const tags = props.tags; 
const profile = props.profile; 
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { getAuthorBoards, checkPostInBoard, addPostToBoard, removePostFromBoard } = useBoardStore();
const canEdit = (profile.username == currentUsername.value); 
const editMode = ref(false);

const postUpdated = ref(post.dateCreated !== post.dateUpdated); 
let loaded = ref(false); 
let addMode = ref(false); 
let boards = ref<Array<Record<string, string>>>([]); 

onBeforeMount(async () => {
  if(isLoggedIn.value){
    boards.value = await getAuthorBoards(currentUsername.value); 
    for(const board of boards.value){
      const inBoard = await checkPostInBoard(board._id, post._id); 
      board.inBoard = inBoard; 
    }
  }
  loaded.value = true;
});

function switchMode(){
  editMode.value = true; 
}
function boardPopup(){
  if(addMode.value){
    addMode.value = false; 
  } else{
    addMode.value = true; 
  }
}
async function addToBoard(board: Record<string, any>){
  loaded.value = false;
  await addPostToBoard(board._id.toString(), post._id.toString()); 
  board.inBoard = true; 
  loaded.value = true; 
}
async function removeFromBoard(board:Record<string, any>){
  loaded.value = false;
  await removePostFromBoard(board._id, post._id); 
  board.inBoard = false; 
  loaded.value = true; 
}
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
      <button v-if="canEdit" class="editButton" v-on:click="switchMode()">Edit</button>
    </div>
    <section class="postContent">
      <p class="heading" style="margin: 1em 0;">{{ post.caption }}</p>
      <section v-if="isLoggedIn">
        <button class="editButton" style="float:right; margin-top: -3.5em;" v-if="loaded" v-on:click="boardPopup()">
          Add to board
        </button>
        <table v-if="loaded && addMode" class="boards">
          <tr v-for="board in boards" class="boardInstance">
            {{board.caption}}
            <button v-if="board.inBoard" class="editButton" v-on:click="removeFromBoard(board)">Remove</button>
            <button v-else class="editButton" v-on:click="addToBoard(board)">Add</button>
          </tr>
        </table>
        <span v-if="!loaded" class="editButton">Loading...</span>
      </section>

      <img class="postImage" :src="post.content" style="margin-bottom: 1em;" />
      <p></p>
      <span v-for="tag in tags">
        <RouterLink :to="{name: 'PostList', params: {tagname: tag.tagName}}" 
        class="tag">{{ tag.tagName }}</RouterLink>
      </span>
    </section>
  </section>

  <EditPostForm class="postBlock" :post="post" :tags="tags" v-else />
  
</template>

<style scoped>
p {
  margin: 0em;
}
.postImage{
  width: 100%;
}

.editButton{
  padding: 5px 8px;
  margin-top: 0.5em;
  font-family: century-gothic;
  text-transform: uppercase;
  letter-spacing: 1px;
  vertical-align: center;
}
.boardInstance{
  font-family: century-gothic; 
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 3px 15px 7px;
  font-size: 15px;
  display: inline-table;
  border: solid 1px #ddd;
  margin: -1px 0 0 -1px;
  color: #999;
}

.boards{
  display:inline-table; 
  margin: 0.5em 0 2em;
}
</style>
