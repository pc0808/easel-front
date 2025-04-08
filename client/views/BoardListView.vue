<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import BoardListComponent from '../components/Board/BoardListComponent.vue';
import router from '../router';
import { useBoardStore } from '../stores/board';
import { useProfileStore } from '../stores/profile';
import { useTagStore } from "../stores/tags";
import { useUserStore } from '../stores/user';

const {getBoardsUnderTag, gettBoardsUnderTagUser } = useTagStore();
const {getUserByUsername} = useUserStore(); 
const {getAuthorBoards, getBoardID} = useBoardStore();
const {getProfile} = useProfileStore();

const username = router.currentRoute.value.params.user;
const tagName = router.currentRoute.value.params.tagname;
let loaded = ref(false); 
let boards = ref<Array<Record<string, string>>>([]); 
// console.log("username: ", username, "tagName: ", tagName); 

onBeforeMount( async() =>{
    if(tagName){
        const tags = (username)? await gettBoardsUnderTagUser(tagName, 
                                    (await getUserByUsername(username))._id): 
                                    await getBoardsUnderTag(tagName);  
        //we only have the tag instances, so we must correlate the tag.content objectid
        //with the actual board (getting board by that objectid)
        for(const tag in tags){
            console.log(tag);
            boards.value.push( await getBoardID(tags[tag].content) );
        }
    } else if(username){ //ONLY AUTHOR 
        boards.value = await getAuthorBoards(username); //automatically writes author as well 
    } else{
        void router.push({name: "not-found"}); // will not search boards if no param given 
    }

    //BoardListComponent also requires author: 
    for(const board in boards.value){
        boards.value[board].avatar = (await getProfile(boards.value[board].author)).avatar; 
    }

    loaded.value = true; 
}); 

</script>
<template>
    <BoardListComponent v-if="loaded" :boards="boards" />
    <h3 v-else class="loadingText">Loading...</h3>
</template>
<style scoped></style>