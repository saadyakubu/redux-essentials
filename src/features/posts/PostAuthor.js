import React from 'react'
import { useSelector } from 'react-redux'
import { selectUserById } from '../users/usersSlice'

export const PostAuthor = ({ userId }) => {
    //console.log(`User: ${userId}`)
    const author = useSelector(state => selectUserById(state, userId))//useSelector(state=>state.users.find(user=>user.id == userId))
    //console.log(`Author: ${author}`)

    return (
        <span>by {author ? author.name : 'Unknown Author'}</span>
    )
} 