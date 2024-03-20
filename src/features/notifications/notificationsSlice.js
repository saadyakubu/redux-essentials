import React from 'react'
import { createAsyncThunk, createSlice, createEntityAdapter } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const notificationsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

export const fetchNotifications = createAsyncThunk('notifications/fetchNotifications', async (_, { getState})=>{
    const allNotifications = selectAllNotifications(getState())
    //we want to use the creation timestamp of the most recent notification as part of our request, 
    //so that the server knows it should only send back notifications that are actually new.
    const [ latestNotification ] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(`/fakeApi/notifications?since=${latestTimestamp}`)
    return response.data
})

const notificationsSlice = createSlice({
    name: "notifications",
    initialState: notificationsAdapter.getInitialState(),//[],
    reducers: {
        allNotificationsRead(state, action){
            //state.forEach(notification => notification.read = true)
            Object.values(state.entities).forEach(notification => notification.read = true)
        },
    },
    extraReducers(builder){
        builder.addCase(fetchNotifications.fulfilled, (state, action)=>{
            // state.push(...action.payload)
            // state.forEach(notification => {
            //     //any notifications we've read are no longer new
            //     notification.isNew = !notification.read
            // })
            // state.sort((a, b)=> b.date.localeCompare(a.date))
            notificationsAdapter.upsertMany(state, action.payload)
            Object.values(state.entities).forEach(notification => notification.isNew = !notification.read)
        })
    }
  })

export default notificationsSlice.reducer
//export const selectAllNotifications = state => state.notifications
export const { selectAll: selectAllNotifications } = notificationsAdapter.getSelectors(state => state.notifications)
export const { allNotificationsRead } = notificationsSlice.actions