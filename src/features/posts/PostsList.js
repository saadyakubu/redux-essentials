import React, { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import TimeAgo from "./TimeAgo"
import { PostAuthor } from "./PostAuthor"
import { ReactionButtons } from "./ReactionButtons"

import { selectAllPosts, fetchPosts, selectPostIds, selectPostById } from "./postsSlice"
import { Spinner } from "../../components/Spinner"

let PostExcerpt = ({ postId }) => { //let PostExcerpt = ({ post }) => {
    const post = useSelector(state => selectPostById(state, postId))
    return (
        <article className="post-excerpt">
            <h3>{post.title}</h3>
            <div>
                <PostAuthor userId={post.user} />
                <TimeAgo timestamp={post.date} />
            </div>
            <p className="post-content">{post.content.substring(0, 100)}</p>

            <ReactionButtons post={post} />
            <Link to={`/posts/${post.id}`} className="button muted-button">View Post</Link>
        </article>
    )
}

PostExcerpt = React.memo(PostExcerpt) //only re-renders when one of the props changes 

export const PostsList = () => {
    const dispatch = useDispatch()
    //const posts = useSelector(selectAllPosts)//useSelector(state=>state.posts)
    const orderedPostIds = useSelector(selectPostIds)

    const postStatus = useSelector(state => state.posts.status)
    const error = useSelector(state => state.posts.error)

    useEffect(() => {
        if (postStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postStatus, dispatch])


    let content
    if (postStatus === 'loading') {
        content = <Spinner text="Loading..." />
    }
    else if(postStatus === 'succeeded') {

        //sort post in reverse chronological order by datetime string
        // const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

        // content = orderedPosts.map(post => (
        //     <PostExcerpt key={post.id} post={post} />
        // ))
        content = orderedPostIds.map(postId => (
            <PostExcerpt key={postId} postId={postId} />
        ))

    }
    else if(postStatus === 'failed'){
        content = <div>{`Error: ${error}`}</div>
    }

    return (
        <section className="posts-list">
            <h2>Posts</h2>
            {content}
        </section>
    )
}