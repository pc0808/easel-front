<script setup lang="ts">
import { defineProps } from 'vue';
import { smallDate } from '../../utils/formatDate';
import { sortDateUpdated } from '../../utils/formatPosts';

const props = defineProps(["boards"]); // EACH BOARD MUST ALSO HAVE INFO FOR AUTHOR'S PROFILE 
const boards: Record<string, string | Record<string,string> | Record<string,string>[]>[] = sortDateUpdated(props.boards); 
//sorts by latest 
//type allows for nested objects & array of content objects 

// interface Board{
//     author: string;
//     caption: string;
//     content: [Post];
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
        <article v-for="board in boards" class="listPost">
            <RouterLink :to="{name: 'Board', params: {id: board._id}}" class="routerLink">
                {{ board.caption }}
            </RouterLink>
            <img :src="board.profile.avatar" class="listAvatar" style="margin-top:1em"/>
            <section class="postListText">
                <RouterLink :to="{name: 'Profile', params: {user: board.author}}" 
                class="listAuthor">{{ board.author }}</RouterLink><br>
                {{ smallDate(board.dateUpdated? board.dateUpdated: new Date() ) }}
            </section>
            
        </article>
    </section>
</template>
<style scoped>
.routerLink{
    width:100%
}
.postListText{
    margin-top:1.5em
}
</style>