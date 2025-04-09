<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import BoardListComponent from '../components/Board/BoardListComponent.vue';
import router from '../router';
import { useBoardStore } from '../stores/board';
import { useTagStore } from "../stores/tags";
import { useUserStore } from '../stores/user';

const {getBoardsUnderTag, getBoardsUnderTagUser } = useTagStore();
const {getUserByUsername} = useUserStore(); 
const {getAuthorBoards, getBoardID} = useBoardStore();

const username = router.currentRoute.value.params.user;
const tagName = router.currentRoute.value.params.tagname;
let loaded = ref(false); 
let boards = ref<Array<Record<string, string>>>([]); 
// console.log("username: ", username, "tagName: ", tagName); 

onBeforeMount( async() =>{
    if(tagName){
        console.log("inside 1st if");
        console.log(await getUserByUsername(username));
        const tags = (username)? await getBoardsUnderTagUser(tagName, 
                                    (await getUserByUsername(username))._id): 
                                    await getBoardsUnderTag(tagName);  
        //we only have the tag instances, so we must correlate the tag.content objectid
        //with the actual board (getting board by that objectid)
        for(const tag in tags){
            boards.value.push( await getBoardID(tags[tag].content) );
        }
    } else if(username){ //ONLY AUTHOR
        console.log("in second if") ; 
        console.log(await getAuthorBoards(username));
        boards.value = await getAuthorBoards(username); //automatically writes author as well 
    } else{
        void router.push({name: "not-found"}); // will not search boards if no param given 
    }

    loaded.value = true; 
    console.log("boards list view")
    console.log(boards.value);
}); 

</script>
<template>
    <BoardListComponent v-if="loaded" :boards="boards" />
    <h3 v-else class="loadingText">Loading...</h3>
    <h3 v-if="loaded && boards.length === 0" class="loadingText">No boards found</h3>
</template>
<style scoped></style>