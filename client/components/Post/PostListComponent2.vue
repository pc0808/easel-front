<script setup lang="ts">
const props = defineProps(["posts"]);
const posts = props.posts; 
</script>
<template>
<section class="container">
    <article v-for="post in posts">
        {{ post.caption }}
    </article>
</section>
</template>
<style scoped>
</style>