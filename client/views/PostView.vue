<script setup lang="ts">
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import PostComponent from '../components/Post/PostComponent.vue';
import { usePostStore } from "../stores/post";
import { useProfileStore } from "../stores/profile";

const { getPostID, getPostTags } = usePostStore();
const { getProfile } = useProfileStore();
const postid = router.currentRoute._rawValue.params.id;
let post = ref<Record<string, string>>();
let profile = ref<Record<string, string>>();
let tags = ref<Array<Record<string, string>>>([]); 
let loaded = ref(false);

onBeforeMount(async () => {
    post = await getPostID(postid); 
    tags = await getPostTags(postid); 
    profile = await getProfile(post.author); 
    loaded.value = true; 
});

</script>
<template>
    <PostComponent v-if="loaded" :tags="tags" :post="post" :profile="profile" />
</template>