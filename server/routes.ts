
import { Router, getExpressRouter } from "./framework/router";

import { ObjectId } from "mongodb";
import { Board, BoardTags, Following, Post, PostTags, Profile, User, WebSession } from "./app";
import { ContentDoc, ContentOptions } from "./concepts/content";
import { NotAllowedError } from "./concepts/errors";
import { ProfileDoc } from "./concepts/profile";
import { TagsDoc } from "./concepts/tags";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

const imageLink = "https://firebasestorage.googleapis.com/v0/b/easel-e38a5.appspot.com";

class Routes {
  ///////////////////////////////////////
  // USER+SESSION CONCEPT DOWN BELOW ////
  ///////////////////////////////////////
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUsers(username);
  }

  @Router.get("/users/id/:_id")
  async getUserByID(_id: ObjectId) {
    return await User.getUserById(_id);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    const user = await User.create(username, password);
    const userID = (await User.getUserByUsername(username))._id;
    const profile = await Profile.create(userID);
    return { msg: "Successfully created!", user: user.user, profile: profile.profile };
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update); //assures new usrn is okay 
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    const userID = (await User.getUserById(user))._id;

    //delete profile 
    await Profile.delete(userID);

    //delete user's posts and every tag associated w them
    const posts = await Post.getByAuthor(userID);
    await PostTags.deleteFilter({ author: userID });
    await Post.deleteMany(userID);

    //delete user's boards and every tag associated w them 
    const boards = await Board.getByAuthor(userID);
    await BoardTags.deleteFilter({ author: userID });
    await Board.deleteMany(userID);

    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  ///////////////////////////////////
  // PROFILES CONCEPT DOWN BELOW ////
  ///////////////////////////////////
  @Router.get("/profiles/:username")
  async getProfileByUsername(username: string) {
    //userID: 
    const _id = (await User.getUserByUsername(username))._id;
    return await Profile.getProfileByUser(_id);
  }

  @Router.patch("/profiles")
  async updateProfile(session: WebSessionDoc, update: Partial<ProfileDoc>) {
    const user = WebSession.getUser(session);
    const profile = (await Profile.getProfileByUser(user))._id;
    return await Profile.update(profile, update); //assures new usrn is okay 
  }

  ////////////////////////////////
  // POSTS CONCEPT DOWN BELOW ////
  ////////////////////////////////
  @Router.get("/posts/:author")
  async getPosts(author: string) {
    let posts;
    
    const id = (await User.getUserByUsername(author))._id;
    posts = await Post.getByAuthor(id);
    
    return Responses.posts(posts);
  }

  @Router.get("/posts/id/:_id")
  async getPostByID(_id: ObjectId) {
    const post = await Post.getContentByID(_id);
    return { msg: post.msg, post: await Responses.post(post.content) };
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, caption: string, content: string, options?: ContentOptions) {
    const user = WebSession.getUser(session);
    if(content.indexOf(imageLink) !== 0) throw new NotAllowedError("Image not uploaded properly"); 
    const created = await Post.create(user, caption, content, options);
    return { msg: created.msg, post: await Responses.post(created.content) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<ContentDoc<string>>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);

    //deletes post instance and every tag associated 
    await PostTags.deleteFilter({ content: _id });
    return Post.delete(_id);
  }

  /////////////////////////////////
  // BOARDS CONCEPT DOWN BELOW ////
  /////////////////////////////////
  @Router.get("/boards/:author")
  async getBoards(author: string) {
    const id = (await User.getUserByUsername(author))._id;
    const boards = await Board.getByAuthor(id);
    
    return Responses.boards(boards);
  }

  @Router.get("/boards/id/:_id")
  async getBoardByID(_id: ObjectId) {
    const board = await Board.getContentByID(_id);
    return { msg: board.msg, board: await Responses.board(board.content)  };
  }

  @Router.post("/boards")
  async createBoard(session: WebSessionDoc, caption: string) {
    const user = WebSession.getUser(session);
    const created = await Board.create(user, caption, []);
    return { msg: created.msg, board: await Responses.board(created.content) };
  }

  @Router.patch("/boards/:_board&:_post")
  async addPostToBoard(session: WebSessionDoc, _board: ObjectId, _post: ObjectId) {
    const user = WebSession.getUser(session);
    await Board.isAuthor(user, _board);
    await Post.getContentByID(_post); //will check that this post actually exists 

    return await Board.addPostToBoard(_board, _post);
  }

  @Router.delete("/boards/:_id")
  async deleteBoard(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Board.isAuthor(user, _id);

    //deletes board instance and every tag associated 
    await BoardTags.deleteFilter({ content: _id });
    return Board.delete(_id);
  }

  @Router.put("/boards/:_board&:_post")
  async deletePostFromBoard(session: WebSessionDoc, _board: ObjectId, _post: ObjectId) {
    const user = WebSession.getUser(session);
    await Board.isAuthor(user, _board);
    await Post.getContentByID(_post); //will check that this post actually exists 
    return await Board.deletePostFromBoard(_board, _post);
  }

  ////////////////////////////////
  // TAGS CONCEPT DOWN BELOW /////
  ////////////////////////////////
  @Router.patch("/tags/posts")
  async getTaggedPosts(filter: Partial<TagsDoc>) {
    // console.log((await PostTags.getContentFilter({ author: filter.author })).tags);
    const posts = (await PostTags.getContentFilter(filter)).tags;  
    return {
      msg: "Read successful",
      posts: await Responses.formatTags(posts),
    };
  }

  @Router.patch("/tags/boards")
  async getTaggedBoards(filter: Partial<TagsDoc>) {
    const boards = (await BoardTags.getContentFilter(filter)).tags;
    console.log(await Responses.formatTags(boards));
    return {
      msg: "Read successful",
      boards: await Responses.formatTags(boards),
    };
  }

  @Router.post("/tags/posts/:tagName&:_post")
  async addTagToPost(session: WebSessionDoc, _post: ObjectId, tagName: string) {
    console.log("server side", _post, tagName); 
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _post);
    await PostTags.create(tagName, user, _post);
    const tags = (await PostTags.getContentFilter({ content: _post })).tags;

    return { msg: "Successful update", tags: await Responses.getTags(tags) };
  }

  @Router.post("/tags/boards/:tagName&:_board")
  async addTagToBoard(session: WebSessionDoc, _board: ObjectId, tagName: string) {
    const user = WebSession.getUser(session);
    await Board.isAuthor(user, _board);
    await BoardTags.create(tagName, user, _board);
    const tags = (await BoardTags.getContentFilter({ content: _board })).tags;

    return { msg: "Successful update", tags: await Responses.getTags(tags) };
  }

  @Router.delete("/tags/posts/:tagName&:_post")
  async deleteTagFromPost(session: WebSessionDoc, _post: ObjectId, tagName: string) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _post);

    await PostTags.deleteFilter({ tagName, author: user, content: _post });

    const tagsLeft = (await PostTags.getContentFilter({ content: _post })).tags;
    return { msg: "successfully updated", tags: await Responses.getTags(tagsLeft) };
  }

  @Router.delete("/tags/boards/:tagName&:_board")
  async deleteTagFromBoard(session: WebSessionDoc, _board: ObjectId, tagName: string) {
    const user = WebSession.getUser(session);
    await Board.isAuthor(user, _board);

    await BoardTags.deleteFilter({ tagName, author: user, content: _board });

    const tagsLeft = (await BoardTags.getContentFilter({ content: _board })).tags;
    return { msg: "successfully updated", tags: await Responses.getTags(tagsLeft) };
  }

  //////////////////////////////////
  // FOLLOWING CONCEPT DOWN BELOW //
  //////////////////////////////////
  @Router.get("/following/:username")
  async getFollowing(username: string) {
    const userID = (await User.getUserByUsername(username))._id;
    const users = await Following.getFollowing(userID);
    return { msg: "read successful", users: await Responses.following(users, false) };
  }
  @Router.patch("/following/:user1&:user2")
  async followUser2(user1: string, user2: string) {
    const user1id = (await User.getUserByUsername(user1))._id;
    const user2id = (await User.getUserByUsername(user2))._id;
    const following = await Following.getFollowing(user1id);
    
    let followUser2 = false; 
    for(const user of await Responses.following(following, false)){ 
      if(user.toString() === user2id.toString()) followUser2 = true; 
    }
    return { msg: "read successful", followUser2 };
  }
  @Router.get("/followers/:username")
  async getFollowers(username: string) {
    const userID = (await User.getUserByUsername(username))._id;
    const users = await Following.getFollowers(userID);
    return { msg: "read successful", users: await Responses.following(users, true) }
  }
  @Router.post("/follow/:username")
  async followUser(session: WebSessionDoc, username: string) {
    const user1 = WebSession.getUser(session);
    const user2 = (await User.getUserByUsername(username))._id;
    return await Following.followUser(user1, user2);
  }
  @Router.post("/unfollow/:username")
  async unfollowUser(session: WebSessionDoc, username: string) {
    const user1 = WebSession.getUser(session);
    const user2 = (await User.getUserByUsername(username))._id;
    return await Following.unfollowUser(user1, user2);
  }
}

export default getExpressRouter(new Routes());
