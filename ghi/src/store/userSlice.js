import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { lifeQuestApi } from '../services/api' // Adjust this import path as needed

export const fetchUserData = createAsyncThunk(
    'user/fetchUserData',
    async (username, { dispatch, getState, rejectWithValue }) => {
        const token = localStorage.getItem('token')
        if (!token || !username) {
            return rejectWithValue('No token or username available')
        }
        try {
            const result = await dispatch(
                lifeQuestApi.endpoints.getUser.initiate(username)
            )
            return result.data
        } catch (error) {
            console.error('Error fetching user data:', error)
            return null
        }
    }
)

const userSlice = createSlice({
    name: 'user',
    initialState: {
        currentUser: null,
        isLoading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.currentUser = action.payload
        },
        logout: (state) => {
            state.currentUser = null
            state.isLoading = false
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.isLoading = false
                state.currentUser = action.payload
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error.message
            })
    },
})

export const { setUser, logout } = userSlice.actions
export default userSlice.reducer
