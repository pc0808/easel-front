<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from 'vue';
import { usePostStore } from '../../stores/post';
import { useProfileStore } from '../../stores/profile';
import { useUserStore } from '../../stores/user';
import { fetchy } from '../../utils/fetchy';
import PostListComponent from './PostListComponent.vue';

let posts: Array<Record<string, string>> = [];
let loaded = ref(false);

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { getUserById } = useUserStore();
const { getProfile } = useProfileStore();
const { getAuthorPosts } = usePostStore();

onBeforeMount( async () =>{
    const url = "/api/following/"+currentUsername.value;
    const following = (await fetchy(url, "GET")).users; 

    for(const userid of following){ //go thru everyone i am following 
        const author = (await getUserById(userid)).username; 
        const profile = (await getProfile(author)); 
        const userPosts = (await getAuthorPosts(author));
        console.log(userPosts);
        for(const post of userPosts) post.profile = profile; 
        
        posts.push(userPosts);
    }
    console.log(posts);
    loaded.value = true; 
}); 

</script>
<template>
    <PostListComponent v-if="loaded" :posts="posts" />
</template>