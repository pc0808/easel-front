<script setup lang="ts">
import { useProfileStore } from "@/stores/profile";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useUserStore } from "../../stores/user";
import { uploadImageGetURL } from "../../utils/firebase";

const { currentUsername } = storeToRefs(useUserStore()); 
const { updateProfile, getProfile} = useProfileStore(); 

let avatar = ref();
let biography = "";
 
async function update() {
  const imageurl = await uploadImageGetURL(avatar, "avatars");
  console.log("imageurl: ", imageurl); 
  if(imageurl){
    await updateProfile({avatar: imageurl})
  } if(biography){
    await updateProfile({biography}); 
  }

  const updated = await getProfile(currentUsername.value); 
  console.log(updated.avatar, updated.biography); 

  window.location.reload(); 
}

function setAvatar(event: any){
  avatar.value = event.target.files[0]; 
}
const props = defineProps(["currBiography", "editButton"]);
const currBiography = props.currBiography; 

</script>

<template>
  <main class="profileBlock">
    <form @submit.prevent="update" >
      <legend class="heading">Update Profile</legend>
      <div class="pure-control-group">
        <label for="aligned-avatar">Avatar: </label>
        <input type="file" id="aligned-avatar" accept="image/png, image/jpeg"
        :onchange=setAvatar />
      </div>
      <div class="pure-control-group" style="margin: 0.5em 0;">
        <label for="aligned-bio">Biography: </label>
        <input type="text" v-model.trim="biography" id="aligned-bio" placeholder="Type here" />
      </div>
      <div class="pure-controls">
        <button type="submit" class="submitButton">Submit</button>
      </div>
    </form>
  </main>
</template>

<style scoped>
.active{
  display: block;
}
form{
  padding: 0;
  border: 0;
  margin: 0 -20% 0 0;
}
view{
  display: none;
}

img{
  width: 7em;
  height: 7em;
}
label{
  size: 25px;
}
#aligned-bio{
  width: 100%;
  margin-right: -50%;
}
</style>
