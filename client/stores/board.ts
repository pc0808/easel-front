import { defineStore } from "pinia";

import { fetchy } from "@/utils/fetchy";
// import Responses from "../../server/responses";

export const useBoardStore = defineStore(
    "board", 
    () => {
        const getAuthorBoards = async (author: string) => {
            const url = "/api/boards/"+author ; 
            return await fetchy(url, "GET", { });
        }; 
        const getBoardID = async(_id: string) => {
            const result = await fetchy("/api/boards/id/"+_id, "GET", { });
            return result.board; 
        };
        const getBoardTags = async(_id: string) => {
            const result = await fetchy("/api/tags/boards", "PATCH", { 
                body: {filter: {"content": _id} }
            });
            return result.boards; 
        };
        return {
            getAuthorBoards,
            getBoardID, 
            getBoardTags,
        };
      },
      { persist: false },
);