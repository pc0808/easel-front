import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";
import { UserDoc } from "./user";

export interface ProfileDoc extends BaseDoc {
    user: ObjectId;
    avatar: string;
    biography: string;
}

const DEFAULT_AVATAR = "https://firebasestorage.googleapis.com/v0/b/easel-e38a5.appspot.com/o/avatars%2FdefaultAvatar.png?alt=media&token=fc9e3ebe-17de-49c6-a00f-9b53ea2ccbcf&_gl=1*xho31z*_ga*MTE1NDA2NjQ0MS4xNjk3NTY2MTI2*_ga_CW55HF8NVT*MTY5NzkxNzgxOC40LjEuMTY5NzkyNDk1MC42MC4wLjA."; 

export default class ProfileConcept {
    public readonly profiles = new DocCollection<ProfileDoc>("Profiles");

    async create(user: ObjectId) {
        const _id = await this.profiles.createOne({ user: user, avatar: DEFAULT_AVATAR, biography: "" });
        return { msg: "Content successfully created!", profile: await this.profiles.readOne({ user }) };
    }
    // will filter either by *profile* objectID 
    async getProfile(_id: ObjectId) {
        const profile = await this.profiles.readOne({ _id: _id });
        if (!profile) {
            throw new NotFoundError(`Profile not found!`);
        }
        return profile;
    }
    async getProfileByUser(user: ObjectId) {
        const profile = await this.profiles.readOne({ user: user });
        if (!profile) {
            throw new NotFoundError(`Sorry, could not find profile!`);
        }
        return profile;
    }
    async getAllProfiles() {
        return await this.profiles.readMany({});
    }
    async authorsToProfiles(ids: ObjectId[]) { 
        const profmap: Map<ObjectId, ProfileDoc> = new Map();
        const profiles: Array<ProfileDoc> = []; 
        
        for(const id of ids){
            if(profmap.has(id)){
                profiles.push(profmap.get(id)!);
            } else{
                const res = await this.profiles.readOne({user: id});
                if(!res){
                    throw new NotFoundError(`Sorry, could not find profile!`);
                }
                profiles.push(res);
            }
        }
       return profiles
     }

    async delete(_id: ObjectId) {
        await this.profiles.deleteOne({ _id: _id });
    }

    //for updating boards, posts, following AND followed:
    async update(_id: ObjectId, update: Partial<UserDoc>) {
        await this.profiles.updateOne({ _id }, update);
        return { msg: "Successfully done!", profile: await this.profiles.readOne(_id) };
    }

    // TO DO ON FOLLOWING DOCS 
    async getFollowingPosts(_id: ObjectId) {
        throw new Error("Not yet implemented!");
    }
    async getFollowingBoards(_id: ObjectId) {
        throw new Error("Not yet implemented!");
    }
    private async isFollowing(_id: ObjectId, user: ObjectId) {
        throw new Error("Not yet implemented!");
    }
    private async isNotFollowing(_id: ObjectId, user: ObjectId) {
        throw new Error("Not yet implemented!");
    }
    private async userNotSelf(_id: ObjectId, user: ObjectId) {
        throw new Error("Not yet implemented!");
    }
    private async userExist(user: ObjectId) {

    }
}