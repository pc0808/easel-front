<script setup lang="ts">
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import BoardComponent from '../components/Board/BoardComponent.vue';
import { useBoardStore } from "../stores/board";
import { useProfileStore } from "../stores/profile";

const { getBoardID, getBoardTags } = useBoardStore();
const { getProfile } = useProfileStore();
const boardid = router.currentRoute.value.params.id; //sjould 

let board = ref<Record<string, string>>({author: "aespa"});
let profile = ref<Record<string, string>>();
let tags = ref<Array<Record<string, string>>>([]); 
let loaded = ref(false);

onBeforeMount(async () => {
    board.value = await getBoardID(boardid); 
    tags.value = await getBoardTags(boardid); 
    profile.value = await getProfile(board.value.author); 
    loaded.value = true; 
});

</script>
<template>
    <BoardComponent v-if="loaded" :tags="tags" :board="board" :profile="profile" />
</template>