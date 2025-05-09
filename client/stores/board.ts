import { defineStore } from "pinia";

import { fetchy } from "@/utils/fetchy";
// import Responses from "../../server/responses";

export const useBoardStore = defineStore(
    "board", 
    () => {
        const getAuthorBoards = async (author: string | string[]) => {
            if(author.constructor === Array) return;
            const url = "/api/boards/"+author ; 
            console.log("in board store: ", url); 
            console.log(await fetchy(url, "GET", { }));
            return (await fetchy(url, "GET", { })).boards;
        }; 
        const getBoardID = async(_id: string | string[]) => {
            if(_id.constructor === Array) return;
            const result = await fetchy("/api/boards/id/"+_id, "GET", { });
            return result.board; 
        };
        const getBoardTags = async(_id: string | string[]) => {
            if(_id.constructor === Array) return;
            const result = await fetchy("/api/tags/boards", "PATCH", { 
                body: {filter: {"content": _id} }
            });
            return result.boards; 
        };
        const checkPostInBoard = async(boardid:string, postid:string) => {
            const url = "/api/boards/post/"+boardid+"&"+postid;
            return await fetchy(url, "GET"); 
        };
        const addPostToBoard = async(boardid:string, postid:string) => {
            const url = "/api/boards/"+boardid+"&"+postid;
            return await fetchy(url, "PUT"); 
        };
        const removePostFromBoard = async(boardid:string, postid:string) => {
            const url = "/api/boards/"+boardid+"&"+postid;
            console.log(boardid, postid);
            return await fetchy(url, "DELETE", {}); 
        };
        return {
            getAuthorBoards,
            getBoardID, 
            getBoardTags,
            checkPostInBoard,
            addPostToBoard,
            removePostFromBoard,
        };
      },
      { persist: false },
);