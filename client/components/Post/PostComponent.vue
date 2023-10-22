<script setup lang="ts">
// import { useUserStore } from "@/stores/user";
// import { storeToRefs } from "pinia";
// import { fetchy } from "../../utils/fetchy";
import { ref } from "vue";
import { useProfileStore } from "../../stores/profile";
import { usePostStore } from "../../utils/post";

const { getPostID, getPostTags } = usePostStore(); 
const { getProfile } = useProfileStore(); 
const props = defineProps(["query"]);
const postid = props.query.query.q; 

let loaded = ref(false); 
let author = ref(""); 
let caption = ref(""); 
let avatar = ref("");
let image = ref(""); 
let dateCreated = ref<Date>();
let dateUpdated = ref<Date>();
let tags = ref<Array<string>>([]); 

async function begin() {
  const post = await getPostID(postid); 
  author.value = post.author; 
  caption.value = post.caption; 
  image.value = post.content; 
  dateCreated.value = post.dateCreated;
  dateUpdated.value = post.dateUpdated;
  
  const tagsresult = await getPostTags(postid); 
  for(const t of tagsresult) tags.value.push(t.tagName); 
  
  avatar.value = (await getProfile(author.value)).avatar; 
  loaded.value = true; //allows post to actually display 
};

await begin();


</script>

<template>
  <main>
  <h1>Post?</h1>
  <!-- <section v-if="loaded" class ="post" :class="{active: loaded.valueOf}">
    <img class="avatar" :src="avatar.valueOf" />
    <span class="author">{{ author.valueOf }}</span>
    
    <article class="timestamp">
      <p v-if="dateCreated !== dateUpdated">Edited on: {{ formatDate(dateUpdated? dateUpdated: new Date()) }}</p>
      <p v-else>Created on: {{ formatDate(dateCreated? dateCreated: new Date() ) }}</p>
    </article>

    <p class="caption">{{ caption.valueOf }}</p>
    <img class="postImage" :src="image.valueOf" />
    <p></p>
    <span v-for="tag in tags">
        <span class="tag">{{ tag }}</span>
      </span>
  </section> -->
</main>

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
.post{
  border-radius: 1em;
  border: solid 2px #ddd;
  padding: 7% 10%;
  display: none;
}
p {
  margin: 0em;
}
.postImage{
  width: fit-content;
}
.active{
  display: block;
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
