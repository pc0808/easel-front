<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import PostListComponent from '../components/Post/PostListComponent.vue';
import router from '../router';

const author = router.currentRoute._value.params.user;
const tagName = router.currentRoute._value.params.tagname;
const loaded = ref(false); 
const posts = ref<Array<Record<string, string>>>([]); 
console.log(author, tagName); 

onBeforeMount( async() =>{
    
    if(tagName){
        // WORK LATER
        let filter = { tagName }; 
        console.log(filter); 
    } else if(author){ //ONLY AUTHOR 

    } else{
        void router.push({name: "not-found"}); // will not search posts if no param given 
    }

    //FILTER POSTS BY DATEUPDATED!
    loaded.value = true; 
}); 

</script>
<template>
    <PostListComponent v-if="loaded" :posts="posts" />
</template>
<style scoped></style>