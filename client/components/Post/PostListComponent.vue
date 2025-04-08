<script setup lang="ts">
import { defineProps } from 'vue';
import { smallDate } from '../../utils/formatDate';
import { sortDateUpdated } from '../../utils/formatPosts';

const props:any = defineProps(["posts"]); // EACH POST MUST ALSO HAVE INFO FOR AUTHOR'S PROFILE 
const posts: Record<string, string | Record<string, string>>[] = sortDateUpdated(props.posts); //sorts by latest 
//this type allows nested objects

// interface Post{
//     author: string;
//     caption: string;
//     content: string;
//     dateCreated: Date;
//     dateUpdated: Date;
//     options: any;
//     profile: {
//         avatar: string;
//     }
// }


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