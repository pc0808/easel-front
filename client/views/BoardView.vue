<script setup lang="ts">
import router from "@/router";
import { onBeforeMount, ref } from "vue";
import BoardComponent from '../components/Board/BoardComponent.vue';
import { useBoardStore } from "../stores/board";
import { useProfileStore } from "../stores/profile";

const { getBoardID, getBoardTags } = useBoardStore();
const { getProfile } = useProfileStore();
const boardid = router.currentRoute._rawValue.params.id;

console.log(boardid);
let board = ref<Record<string, string>>();
let profile = ref<Record<string, string>>();
let tags = ref<Array<Record<string, string>>>([]); 
let loaded = ref(false);

onBeforeMount(async () => {
    board = await getBoardID(boardid); 
    tags = await getBoardTags(boardid); 
    profile = await getProfile(board.author); 
    loaded.value = true; 
});

</script>
<template>
    <BoardComponent v-if="loaded" :tags="tags" :board="board" :profile="profile" />
</template>