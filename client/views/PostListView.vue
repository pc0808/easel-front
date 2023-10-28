<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import PostListComponent from '../components/Post/PostListComponent.vue';
import router from '../router';
import { usePostStore } from '../stores/post';
import { useProfileStore } from '../stores/profile';
import { useTagStore } from "../stores/tags";
import { useUserStore } from '../stores/user';

const {getPostsUnderTag, getPostsUnderTagUser } = useTagStore();
const {getUserByUsername} = useUserStore(); 
const {getAuthorPosts, getPostID} = usePostStore();
const {getProfile} = useProfileStore();
const username = router.currentRoute._value.params.user;
const tagName = router.currentRoute._value.params.tagname;
let loaded = ref(false); 
let posts = ref<Array<Record<string, string>>>([]); 

onBeforeMount( async() =>{
    if(tagName){
        //const posts = await getPostsUnderTag(tagName); 
        const tags = (username)? await getPostsUnderTagUser(tagName, 
                                    (await getUserByUsername(username))._id): 
                                    await getPostsUnderTag(tagName);  
        //we only have the tag instances, so we must correlate the tag.content objectid
        //with the actual post (getting post by that objectid)
        for(const tag in tags){
            posts.value.push( await getPostID(tags[tag].content) );
        }
    } else if(username){ //ONLY AUTHOR 
        posts.value = await getAuthorPosts(username); //automatically writes author as well 
    } else{
        void router.push({name: "not-found"}); // will not search posts if no param given 
    }

    //PostListComponent also requires author: 
    for(const post in posts.value){
        posts.value[post].profile = await getProfile(posts.value[post].author); 
    }

    loaded.value = true; 
}); 

</script>
<template>
    <PostListComponent v-if="loaded" :posts="posts" />
    <h3 v-else class="loadingText">Loading...</h3>
</template>
<style scoped></style>