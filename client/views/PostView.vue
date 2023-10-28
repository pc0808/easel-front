<script setup lang="ts">
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import PostComponent from '../components/Post/PostComponent.vue';
import { usePostStore } from "../stores/post";
import { useProfileStore } from "../stores/profile";

const { getPostID, getPostTags } = usePostStore();
const { getProfile } = useProfileStore();
const postid = router.currentRoute.value.params.id;
let post = ref<Record<string, string>>({author: "aespa"});
let profile = ref<Record<string, string>>();
let tags = ref<Array<Record<string, string>>>([]); 
let loaded = ref(false);

onBeforeMount(async () => {
    post.value = await getPostID(postid); 
    tags.value = await getPostTags(postid); 
    profile.value = await getProfile(post.value.author); 
    loaded.value = true; 
});

</script>
<template>
    <PostComponent v-if="loaded" :tags="tags" :post="post" :profile="profile" />
</template>