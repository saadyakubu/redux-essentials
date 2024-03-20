import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import TimeAgo from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'

import { selectPostById } from './postsSlice'


export const Post = ({match}) => {
    const { postId } = match.params

    const post = useSelector(state => selectPostById(state, postId))//useSelector(state => state.posts.find(post => post.id === postId))

    if(!post){
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <section>
            <h2>{post.title}</h2>
            <p className='post-content'>{post.content}</p>
            <ReactionButtons post={post}/>
            <PostAuthor userId={post.user}/> &nbsp; <TimeAgo timestamp={post.date} />
            <Link to={`/edit-post/${post.id}`} className="button">Edit Post</Link>
        </section>
    )
}

export default Post