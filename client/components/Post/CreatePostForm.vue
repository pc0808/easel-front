<script setup lang="ts">
import router from "@/router";
import { ObjectId } from "mongodb";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { uploadImageGetURL } from "../../utils/firebase";
// import { usePostStore } from '../../utils/post';

// const { getPostID } = usePostStore();
const image = ref("");
const tags = ref<Array<string>>([]); 
let loaded = ref(true); 
let caption = "";

function setImage(event: any){
  image.value = event.target.files[0]; 
}
function addTag(event: any){
  if(event.key !== "Enter") return; //only want this func to go thru on enter presses 
  const tagInput = document.getElementById("aligned-tags");
  const currTag = (tagInput?.value)? tagInput?.value:  ""; 
  if(tagInput && tagInput?.value){ 
    //make sure tagInput isn't blank and that not already inputted 
    if(new Set(tags.value).has(currTag) ) return; 
    tags.value.push(currTag);
    tagInput.value = ""; //
  }
}

function deleteTag(event:any){
  const value = event.target.innerText;
  tags.value = tags.value.filter(x => (x!== value));
}

async function updatePostWithTag(_id:ObjectId, tag: string) {
  const link = "/api/tags/posts/"+tag+"&"+(_id.toString()); 
  return await fetchy(link, "POST", { });
}

async function createPost () {
  loaded.value = false; 

  if(!image.value) {
    alert("Requires image input"); 
    return; 
  }
  const imageurl = await uploadImageGetURL(image, "posts");
  try {
    const response = await fetchy("/api/posts", "POST", {
      body: { "caption": caption, "content": (imageurl)?imageurl: "" },
    });
    const postid = response.post._id; 
   
    let result;
    for(const tag of tags.value){
      result = await updatePostWithTag(postid, tag); 
    }

    void router.push({name: "Post", params: {id: postid.toString()} }); //opens post w id 
  } catch (_) {
    return;
  }
};

</script>

<template>
  <div class ="container" v-if="loaded">
    <div class="pure-control-group">
      <label for="aligned-caption" class="subtitle">Caption: </label>
      <input id="aligned-caption" type="text" v-model="caption" placeholder="Post caption here"/>
    </div>
    <div class="pure-control-group">
      <label for="aligned-image" class="subtitle">Choose Image: </label>
      <input id="aligned-image" type="file" accept="image/png, image/jpeg" :onchange=setImage />
    </div>
    <div class="pure-control-group">
      <label for="aligned-tags" class="subtitle">Tags: </label>
      <span v-for="tag in tags">
        <span class="tag" :onclick="deleteTag">{{ tag }}</span>
      </span>
      <input id="aligned-tags" type="text" :onkeypress="addTag" placeholder ="Type here"/>
    </div>
    <button type="submit" :onclick=createPost class="pure-button-primary pure-button">Create Post</button>
  </div>
</template>

<style scoped>
.container {
  background-color: transparent;
  border-radius: 1em;
  border: solid 1.5px #ddd;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
  line-height: 1em;
  font-size: 18px;
  margin: 5% 20%;
}

textarea {
  font-family: inherit;
  font-size: 40px;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
.subtitle{
  color: #ddd;
}
#aligned-tags{
  background-color: transparent;
  border: none;
  width:20%;
  margin-left: 7px;
  color: #bbb;
}
</style>
