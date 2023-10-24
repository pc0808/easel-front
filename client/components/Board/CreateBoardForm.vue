<script setup lang="ts">
import router from "@/router";
import { ObjectId } from "mongodb";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { uploadImageGetURL } from "../../utils/firebase";

const tags = ref<Array<string>>([]); 
let loaded = ref(true); 
let tagInput = ref(""); 
let caption = "";

function addTag(event: any){
    if(event.key !== "Enter" || tagInput.value === "") return; 
    //only want this func to go thru on enter presses on non-empty values 
    if(tagInput.value.indexOf(' ') >= 0) {
        alert("Cannot have whitespace in tags"); 
        return; 
    }
    if(new Set(tags.value).has(tagInput.value) ){ 
        alert("Already inputted"); 
        return;
    }
    tags.value.push(tagInput.value);
    tagInput.value = ""; //
}

function deleteTag(event:any){
  const value = event.target.innerText;
  tags.value = tags.value.filter(x => (x!== value));
}

async function updateBoardWithTag(_id:ObjectId, tag: string) {
  const link = "/api/tags/boards/"+tag+"&"+(_id.toString()); 
  return await fetchy(link, "POST", { });
}

async function createBoard () {
  loaded.value = false;
  try {
    const response = await fetchy("/api/boards", "POST", {
      body: { "caption": caption },
    });
    const boardid = response.board._id; 
   
    let result;
    for(const tag of tags.value){
      result = await updateBoardWithTag(boardid, tag); 
    }
   
    void router.push({name: "Board", params: {id: boardid.toString()} }); //opens board w id 
  } catch (_) {}
  loaded.value = true;
};

</script>

<template>
  <div class ="container" v-if="loaded">
    <div class="pure-control-group">
      <label for="aligned-caption" class="subtitle">Caption: </label>
      <input id="aligned-caption" type="text" v-model="caption" placeholder="Board caption here"/>
    </div>
    <div class="pure-control-group">
      <label for="aligned-tags" class="subtitle">Tags: </label>
      <span v-for="tag in tags">
        <span class="tag" :onclick="deleteTag">{{ tag }}</span>
      </span>
      <input id="aligned-tags" type="text" v-model="tagInput" :onkeypress="addTag" placeholder ="Type here"/>
    </div>
    <button type="submit" :onclick=createBoard class="pure-button-primary pure-button">Create Board</button>
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
