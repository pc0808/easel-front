<script setup lang="ts">
import { ref } from 'vue';
import router from '../../router';
import { fetchy } from '../../utils/fetchy';

const props = defineProps(["post", "tags"]);
const post = props.post;
const tags = props.tags; 

let caption = ref(post.caption);
let updatingTags = ref<Array<string>>([]); 
updatingTags.value = tags.map((tag:any) => tag.tagName); //what we're removing and deleting from 
let currTag = ref("");
let loaded = ref(true);

const deleteTag = (tag:string) => {
  updatingTags.value = updatingTags.value.filter((x:string) => (x !== tag));
}

const addTag = (event:any) => {
  console.log("what the fuckkkkk");
  if(event.key !== "Enter") return; //only want this func to go thru on enter presses 
  console.log("working?");
  if(new Set(updatingTags.value).has(currTag.value) ) return; //already part of tags 
  updatingTags.value.push(currTag.value);
  currTag.value = ""; //
}

const updatePost = async () => {
  loaded.value = false; 
  console.log("what the fuck"); 

  try{
    await fetchy(`/api/posts/${post._id}`, "PATCH", {body: {update: {caption: caption.value}}} ); 

    const oldTags = tags.map((tag:any) => tag.tagName);
    const oldSet = new Set(oldTags);
    const newSet = new Set(updatingTags.value);
    const toAdd = updatingTags.value.filter((tag:string) => !oldSet.has(tag)); 
    const toDelete = oldTags.filter((tag:string) => !newSet.has(tag)); 
    
    for(const tag of toAdd)
      await fetchy(`/api/tags/posts/${tag}&${post._id}`, "POST"); 
    for(const tag of toDelete)
      await fetchy(`/api/tags/posts/${tag}&${post._id}`, "DELETE"); 
  }catch{ }

  loaded.value = true; 
  reloadPage(); 
};

const deletePost = async() => {
  if (confirm("Are you sure you want to delete?")) {
    loaded.value = false; 
    try{ //deletes post 
      await fetchy(`/api/posts/${post._id}`, "DELETE"); 
      router.push({name: "Home"}); 
    }catch{ }
    loaded.value = true;
  }
}

const reloadPage = async() => {
  window.location.reload(); 
}
</script>

<template>
  <div v-if="loaded" class="postBlock" >
    <legend class="heading" style="display: block;">Update Post</legend><br>
    <div style="display: block;">
      <label for="aligned-bio">Caption: </label>
      <input type="text" v-model.trim="caption" id="aligned-bio" :placeholder="caption" class="textarea" />
    </div>
    <div style="display: block; margin: 1em 0;">
      <label for="aligned-tags">Tags: </label>
      <span v-for="tag in updatingTags">
        <button class="tag" v-on:click="deleteTag(tag)">{{ tag }}</button>
      </span>
      <input id="aligned-tags" v-model.trim="currTag" type="text" class="textarea" 
       :onkeypress="addTag" placeholder ="Add tag here"/>
    </div>
    <menu>
      <button type="submit" class="submitButton" :onclick="updatePost" style="color: #555;">Save</button>
      <button type="submit" class="submitButton" :onclick="deletePost" style="color: #555;">Delete</button>
      <button class="submitButton" :onclick="reloadPage">Cancel</button>
    </menu>

  </div>
  <span class="heading" style="margin: 5% 20%" v-else>Loading...</span>
</template>

<style scoped>
p {
  margin: 0em;
}
.textarea{
  width: fit-content;
  margin: -3px 1em;
  padding: 3px 1em;
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

.timestamp {
  display: flex;
  justify-content: flex-end;
  font-size: 0.9em;
  font-style: italic;
}
</style>
