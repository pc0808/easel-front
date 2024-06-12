import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
// import Responses from "../../server/responses";

export const useTagStore = defineStore(
    "tags", 
    () => {
        const getPostsUnderTag = async (tagName: string | string[]) => {
            if(tagName.constructor === Array) return;
            return (await fetchy("/api/tags/posts", "PATCH", { body: {filter: {tagName}} })).posts;
        }; 
        const getPostsUnderTagUser = async (tagName: string | string[], userid: string) => {
            //const filter = {tagName, author: userid}; 
            if(tagName.constructor === Array) return;
            const res = await fetchy("/api/tags/posts", "PATCH", { body: {filter: {tagName, author: userid} } });
            return res.posts;
        }; 
        const getBoardsUnderTag = async (tagName: string | string[]) => {
            if(tagName.constructor === Array) return;
            return (await fetchy("/api/tags/boards", "PATCH", { body: {filter: {tagName}} })).boards;
        }; 
        const gettBoardsUnderTagUser = async (tagName: string | string[], userid: string) => {
            if(tagName.constructor === Array) return;
            const res = await fetchy("/api/tags/boards", "PATCH", { body: {filter: {tagName, author: userid} } });
            return res.boards;
        }; 
        return {
            getPostsUnderTag,
            getPostsUnderTagUser,
            getBoardsUnderTag,
            gettBoardsUnderTagUser
        };
      },
      { persist: false },
);