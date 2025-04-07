import { ObjectId } from "mongodb";
import ContentConcept, { ContentDoc, ContentOptions } from "./content";
import { BadValuesError, NotAllowedError } from "./errors";

export default class BoardConcept extends ContentConcept<ObjectId[]>{
    //SPECIFIC to board: 
    async create(author: ObjectId, caption: string, content: ObjectId[], options?: ContentOptions) {
        await this.boardNameUnique(caption);
        const _id = await this.contents.createOne({
            author, caption, content, options
        });
        return {
            msg: "Content successfully created!",
            content: await this.contents.readOne({ _id })
        };
    }
    async update(_id: ObjectId, update: Partial<ContentDoc<ObjectId[]>>) {
        if(update.caption && update.caption !== (await this.getContentByID(_id)).content.caption){
            await this.boardNameUnique(update.caption); 
        }
        await this.contents.updateOne({ _id }, update);
        return { msg: "Content successfully updated!" };
    }
    async addPostToBoard(_board: ObjectId, _post: ObjectId) {
        await this.postNotInBoard(_board, _post);
        const board = (await this.getContentByID(_board)).content;

        board.content.push(_post);
        await this.update(_board, { content: board.content });
        return { msg: "Board successfully updated" };
    }
    async deletePostFromBoard(_board: ObjectId, _post: ObjectId) {
        await this.postInBoard(_board, _post);
        const board = (await this.getContentByID(_board)).content;

        const newBoard = board?.content.filter(post => (post.toString !== _post.toString));
        //filter returns new array so no aliasing 
        await this.update(_board, { content: newBoard });
        return { msg: "Board successfully updated" };
    }
    async postNotInBoard(_id: ObjectId, _postid: ObjectId) {
        const board = (await this.getContentByID(_id)).content; //actual board stored in db
        const diff = board.content.filter(post => (post.toString() === _postid.toString())).length;
        if (diff !== 0) {
            throw new BadValuesError("Cannot add, already in board");
        }
    }
    async postInBoard(_id: ObjectId, _postid: ObjectId) {
        const board = (await this.getContentByID(_id)).content;
        const diff = board?.content.filter(post => (post.toString() === _postid.toString())).length;
        if (diff === 0) {
            throw new BadValuesError("Cannot delete if not already existing in board");
        }
    }
    async boardNameUnique(caption: string){
        if((await this.getContents({caption})).length > 0){
            throw new NotAllowedError("Board with given name already exists"); 
        }
    }
}