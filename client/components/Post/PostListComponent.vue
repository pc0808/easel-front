<script setup lang="ts">
import { defineProps } from 'vue';
import { smallDate } from '../../utils/formatDate';
import { sortDateUpdated } from '../../utils/formatPosts';

const props = defineProps(["posts"]); // EACH POST MUST ALSO HAVE INFO FOR AUTHOR'S PROFILE 
const posts = sortDateUpdated(props.posts); //sorts by latest 
// const posts = props.posts; 
</script>
<template>
    <section class="postColumns">
        <article v-for="post in posts" class="listPost">
            <RouterLink :to="{name: 'Post', params: {id: post._id}}">
                <img :src="post.content" class="imageList">
            </RouterLink>
            
            <img :src="post.profile.avatar" class="listAvatar"/>
            <section class="postListText">
                <RouterLink :to="{name: 'Profile', params: {user: post.author}}" 
                class="listAuthor">{{ post.author }}</RouterLink><br>
                {{ smallDate(post.dateUpdated? post.dateUpdated: new Date() ) }}
            </section>
        </article>
    </section>
</template>
<style scoped>
</style>