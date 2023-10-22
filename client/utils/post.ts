import { defineStore } from "pinia";

import { fetchy } from "@/utils/fetchy";
// import Responses from "../../server/responses";

export const usePostStore = defineStore(
    "post", 
    () => {
        // const getAuthorPosts = async (author?: string) => {
        //     let url = "/api/posts/" ; 
        //     if(author) url+=author; 
        //     const posts = await fetchy(url, "GET", { });
        //     return posts; 
        // }; 
        const getPostID = async(_id: string) => {
            const result = await fetchy("/api/posts/"+_id, "GET", { });
            return result.post; 
        };
        const getPostTags = async(_id: string) => {
            const result = await fetchy("/api/tags/posts", "PATCH", { 
                body: {filter: {"content": _id} }
            });
            return result.posts; 
        };
        return {
            //getAuthorPosts,
            getPostID, 
            getPostTags,
        };
      },
      { persist: false },
);