import { defineStore } from "pinia";

import { fetchy } from "@/utils/fetchy";
// import Responses from "../../server/responses";

export const usePostStore = defineStore(
    "post", 
    () => {
        const getAuthorPosts = async (author: string) => {
            const url = "/api/posts/"+author ; 
            return await fetchy(url, "GET", { });
        }; 
        const getPostID = async(_id: string) => {
            const result = await fetchy("/api/posts/id/"+_id, "GET", { });
            return result.post; 
        };
        const getPostTags = async(_id: string) => {
            const result = await fetchy("/api/tags/posts", "PATCH", { 
                body: {filter: {"content": _id} }
            });
            return result.posts; 
        };
        return {
            getAuthorPosts,
            getPostID, 
            getPostTags,
        };
      },
      { persist: false },
);