import { createAsyncThunk, createSlice, createEntityAdapter } from "@reduxjs/toolkit"
import { client } from "../../api/client"

/*const initialState = [
    { id: '0', name: 'Akin Abdulkareem' },
    { id: '1', name: 'Danladi Umar' },
    { id: '2', name: 'Pete Dede' },
]*/

//const initialState = []

const usersAdapter = createEntityAdapter()
const initialState = usersAdapter.getInitialState()

export const fetchUsers = createAsyncThunk(`/users/fetchUser`, async() => {
    const response = await client.get(`/fakeApi/users`)
    return response.data
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder){
        // builder.addCase(fetchUsers.fulfilled, (state, action)=>{
        //     return action.payload
        // })
        builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
    }
})

export default usersSlice.reducer
//export const selectAllUsers = state => state.users
//export const selectUserById = (state, userId) => state.users.find(user => user.id === userId)
export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(state => state.users)
