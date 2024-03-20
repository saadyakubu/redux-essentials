import React from 'react'
import { selectUserById } from './usersSlice'
import { useSelector } from 'react-redux'
import { selectAllPosts, selectPostsByUser } from '../posts/postsSlice'
import { Link } from 'react-router-dom'

const User = ({ match }) => {
    const { userId } = match.params
    const user = useSelector(state => selectUserById(state, userId))
    /*const postsForUser = useSelector(state =>{
        const allPosts = selectAllPosts(state)
        return allPosts.filter(post => post.user === userId)
    })*/
    //taking advantage memoizing technique by createSelector() in the postsSlice, to only re-render if the state changes. 
    const postsForUser = useSelector(state => selectPostsByUser(state, userId))

    const postTitles = postsForUser.map(post=>(
        <li key={post.id}><Link to={`/posts/${post.id}`}>{post.title}</Link></li>
    ))

    return (
        <section>
            <h2>{user?.name}</h2>
            <ul>{postTitles}</ul>
        </section>
    )
}

export default User