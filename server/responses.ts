import { ObjectId } from "mongodb";
import { Profile, User } from "./app";
import { ContentAuthorNotMatchError, ContentDoc } from "./concepts/content";
import { FollowingDoc } from "./concepts/following";
import { AlreadyFriendsError, FriendNotFoundError, FriendRequestAlreadyExistsError, FriendRequestNotFoundError } from "./concepts/friend";
import { TagsDoc } from "./concepts/tags";
import { Router } from "./framework/router";

/**
 * This class does useful conversions for the frontend.
 * For example, it converts a {@link PostDoc} into a more readable format for the frontend.
 */
export default class Responses {
  /**
   * Convert ContentDoc<string> into more readable format for the frontend by converting the author id into a username.
   */
  static async post(post: ContentDoc<string> | null) {
    if (!post) {
      return post;
    }
    const author = await User.getUserById(post.author);
    const profile = await Profile.getProfileByUser(post.author);
    return { ...post, author: author.username, avatar: profile.avatar };
  }
  /**
   * Convert ContentDoc<Array<ObjectId>> into more readable format for the frontend by converting the author id into a username.
   */
  static async board(board: ContentDoc<Array<ObjectId>> | null) {
    if (!board) {
      return board;
    }
    const author = await User.getUserById(board.author);
    const profile = await Profile.getProfileByUser(board.author);
    return { ...board, author: author.username, avatar: profile.avatar };
  }

  /**
   * Same as {@link post} but for an array of ContentDoc<string> for improved performance.
   */
  static async posts(posts: ContentDoc<string>[]) {
    const ids = posts.map((post) => post.author);
    const authors = await User.idsToUsernames(ids);
    const profiles = await Profile.authorsToProfiles(ids);
    return posts.map((post, i) => ({ ...post, author: authors[i], avatar: profiles[i] ? profiles[i].avatar : "" }));
  }

  /**
   * 
   * @param tags result of a tag call
   * @returns a copy of the tagsDocs, supplemented with the posts' author usernames 
   */
  static async formatTags(tags: TagsDoc[]){
    const authors = await User.idsToUsernames(tags.map((tag) => tag.author));
    return tags.map((tag, i) => ({...tag, author: authors[i]})); 
  }
  /**
   * Same as {@link board} but for an array of ContentDoc<Array<ObjectId>> for improved performance.
   */
  static async boards(boards: ContentDoc<Array<ObjectId>>[]) {
    const ids = boards.map((board) => board.author);
    const authors = await User.idsToUsernames(ids);
    const profiles = await Profile.authorsToProfiles(ids);
    return boards.map((board, i) => ({ ...board, author: authors[i], avatar: profiles[i] ? profiles[i].avatar : "" })); 
  }

  /**
   * converts followingDocs into keeping only 1 attribute
   * 
   * @param following An array of following instances taken from app's Following 
   * @param follower indicates whether we keep followers/user1 (true) or following/user2 (false)
   */
  static async following(following: FollowingDoc[], followed: boolean) {
    const users: ObjectId[] = following.map(user => (followed ? user.user1 : user.user2));
    return users;
  }

  static async formatFollowing(following: ObjectId[]){
    return await User.idsToUsernames(following);
  }
  // given a list of tagsDoc read results, return just a list of the tagnames 
  static async getTags(tags: TagsDoc[]) {
    return tags.map(tag => (tag.tagName));
  }

  // given a list of tagsDoc read results, return just a list of the content
  // assumes they all have same tag 
  static async getContentWithTag(tags: TagsDoc[]) {
    return tags.map(tag => (tag.content));
  }

}

Router.registerError(ContentAuthorNotMatchError, async (e) => {
  const username = (await User.getUserById(e.author)).username;
  return e.formatWith(username, e._id);
});

Router.registerError(FriendRequestAlreadyExistsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(FriendRequestNotFoundError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.from), User.getUserById(e.to)]);
  return e.formatWith(user1.username, user2.username);
});

Router.registerError(AlreadyFriendsError, async (e) => {
  const [user1, user2] = await Promise.all([User.getUserById(e.user1), User.getUserById(e.user2)]);
  return e.formatWith(user1.username, user2.username);
});
