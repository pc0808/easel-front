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
  const imageurl = await uploadImageGetURL(avatar);
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
  console.log('hello', avatar.value); 
}
const props = defineProps(["currBiography", "editButton"]);
const currBiography = props.currBiography; 

</script>

<template>
  <div class="container">
    <form class="pure-form pure-form-aligned" @submit.prevent="update" >
      <h3>Update Profile</h3>
      <fieldset>
        <div class="pure-control-group">
          <label for="aligned-avatar">Avatar</label>
          <input type="file" id="aligned-avatar" accept="image/png, image/jpeg"
          :onchange=setAvatar>
        </div>
        <div class="pure-control-group">
          <label for="aligned-bio">Biography</label>
          <input type="biography" v-model.trim="biography" id="aligned-bio" :placeholder=currBiography />
        </div>
        <div class="pure-controls">
          <button type="submit" class="profileButton">Submit</button>
        </div>
      </fieldset>
    </form>
  </div>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
  text-align: center;
}

.active{
  display: block;
}

view{
  display: none;
}

img{
  width: 7em;
  height: 7em;
}

</style>
