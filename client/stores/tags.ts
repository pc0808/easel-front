import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
// import Responses from "../../server/responses";

export const useTagStore = defineStore(
    "tags", 
    () => {
        const getPostsUnderTag = async (tagName: string) => {
            return (await fetchy("/api/tags/posts", "PATCH", { body: {filter: {tagName}} })).posts;
        }; 
        const getPostsUnderTagUser = async (tagName: string, userid: string) => {
            //const filter = {tagName, author: userid}; 
            const res = await fetchy("/api/tags/posts", "PATCH", { body: {filter: {tagName, author: userid} } });
            return res.posts;
        }; 
        return {
            getPostsUnderTag,
            getPostsUnderTagUser
        };
      },
      { persist: false },
);