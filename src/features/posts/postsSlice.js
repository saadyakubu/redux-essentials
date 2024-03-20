import { createSlice, nanoid, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit"
import { sub } from "date-fns"
import { client } from "../../api/client"

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

/*const initialState = [
    { 
        id: '1', 
        title: 
        'First Post!', 
        content: 'Hello!', 
        user: 0, 
        date: sub(new Date(), { minutes: 10 }).toISOString(),
        reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0}
    },
    { 
        id: '2', 
        title: 'Second Post', 
        content: 'More text', 
        user: 1, 
        date: sub(new Date(), { minutes: 5 }).toISOString(),
        reactions: {thumbsUp: 0, hooray: 0, heart: 0, rocket: 0, eyes: 0} 
    },
]*/
/*const initialState = {
    posts: [],
    // Multiple possible status enum values
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null     // string | null
}*/

const initialState = postsAdapter.getInitialState({
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null,    // string | null
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await client.get('/fakeApi/posts')
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost',
    //The payload creator receives the partial `{title, content, user}` object
    async initialPost => {
        //send the initial data to the faker API server
        const response = await client.post('/fakeApi/posts', initialPost)
        //the response includes the complete post object, including the uniq ID
        return response.data
    }
)

const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        // postAdded(state, action){
        //     state.push(action.payload)
        // },

        //Using {reducer, prepare},
        //our component doesn't have to worry about what the payload object looks like - the action creator will take care of putting it together
        // the right way. So, we can update the component so that it passes in title and content as arguments when it dispatches postAdded
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        user: userId,
                        date: new Date().toISOString(),
                    }
                }
            }
        },
        postUpdated(state, action) {
            const { id, title, content } = action.payload
            const post = state.entities[id] //const post = state.posts.find(post => post.id === id)
            if (post) {
                post.title = title
                post.content = content
            }
        },

        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId] //const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) existingPost.reactions[reaction]++
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                //add any fetched post to the posts array
                //state.posts = state.posts.concat(action.payload)
                //use the `upsertMany` reducer as a mutating update utility
                postsAdapter.upsertMany(state, action.payload)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            // .addCase(addNewPost.fulfilled, (state, action) => {
            //     state.posts.push(action.payload)
            // })
            // Use the `addOne` reducer for the fulfilled case
            .addCase(addNewPost.fulfilled, postsAdapter.addOne)

    }
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions
export default postsSlice.reducer

//export const selectAllPosts = state => state.posts.posts
//export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId)
//Export the customized selectors for this adapter using `getSelectors`
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds,
    //pass in a selector  that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId],
    (posts, userId) => posts.filter(post => post.user === userId)
)
