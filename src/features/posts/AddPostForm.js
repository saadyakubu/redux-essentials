import React, { useState } from "react"
import { postAdded } from "./postsSlice"
import { useDispatch, useSelector } from "react-redux"
import { nanoid } from "@reduxjs/toolkit"

import { addNewPost } from "./postsSlice"


export const AddPostForm = () => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const dispatch = useDispatch()
    //const user = useSelector(state=>state.users.find(users=>users.id===userId))
    const users = useSelector(state => state.users)

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)

    /*
    const onSavePostClicked = ()=> {
        if(title && content && user){
            dispatch(postAdded({
                //id: nanoid(), //not required as its usage has been declared/prepared in the postAdded reducer
                title,
                content,
                userId
            }))

            setTitle('')
            setContent('')
        }
    }

    const canSave = Boolean(title) && Boolean(content) && Boolean(user)
    */

    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'
    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                //Redux Toolkit adds a .unwrap() function to the returned Promise, 
                //which will return a new Promise that either has the actual action.payload value from a fulfilled action, 
                //or throws an error if it's the rejected action. This lets us handle success and failure in the component using normal try/catch logic
                await dispatch(addNewPost({ title, content, user: userId })).unwrap()
                setTitle('')
                setContent('')
                setUserId('')
            }
            catch (error) {
                console.error(`Failed to save the post: `, error)
            }
            finally {
                setAddRequestStatus('idle')
            }
        }
    }

    const usersOptions = users.map((user) => (
        <option key={user.id} value={user.id}>
            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Add Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input type="text" id="postTitle" name="postTitle" value={title} onChange={onTitleChanged} />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option value=""></option>
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea id="postContent" name="postContent" value={content} onChange={onContentChanged} />
                <button type="button" onClick={onSavePostClicked} disabled={!canSave}>Save Post</button>
            </form>
        </section>
    )
}