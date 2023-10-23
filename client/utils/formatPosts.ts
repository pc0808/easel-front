// sorts from newest to oldest 
export function sortDateUpdated(posts: Array<Record<string, string>>){
    return posts.sort((post1, post2) => {
        if(post1.dateUpdated < post2.dateUpdated) return 1
        // ^ post1 is older than post 2 , so it will go to back of array; 
        return -1
    })
}