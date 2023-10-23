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
  <div class="profileBlock" style="margin-bottom: 5%;">
    <form class="profileBlock" @submit.prevent="update" >
      <fieldset>
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
          <button type="submit" class="profileButton">Submit</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
.active{
  display: block;
}
form{
  padding: 0;
  margin-right: -10em;
}
fieldset{
  margin: -2em -10em 0;
  border: 0;
  padding: 0;
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
form{
  border: 0;
  padding: 0;
}
#aligned-bio{
  width: 100%;
  margin-right: -50%;
}
.profileButton{
  padding: 0.5em;
  margin-top: 0.5em;
}
</style>
