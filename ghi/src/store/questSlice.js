import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchquests = createAsyncThunk(
    'quests/fetchQuests',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_HOST}/api/quests/mine`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            })
            if (!response.ok) {
                throw new Error('Failed to fetch quests')
            }
            const quests = await response.json()
            return quests
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const createQuest = createAsyncThunk(
    'quests/createQuest',
    async (quest, { rejectWithValue }) => {
        try {
            const response = await fetch(`${API_HOST}/api/quests/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(quest),
            })
            if (!response.ok) {
                throw new Error('Failed to create quest')
            }
            const newquest = await response.json()
            return newquest
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const updateQuest = createAsyncThunk(
    'quests/updateQuest',
    async (quest, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_HOST}/api/quests/mine/${quest.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${getToken()}`,
                    },
                    body: JSON.stringify(quest),
                }
            )
            if (!response.ok) {
                throw new Error('Failed to update quest')
            }
            const updatedQuest = await response.json()
            return updatedQuest
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

export const deleteQuest = createAsyncThunk(
    'quests/deleteQuest',
    async (questId, { rejectWithValue }) => {
        try {
            const response = await fetch(
                `${API_HOST}/api/quests/mine/${questId}`,
                {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                    },
                }
            )
            if (!response.ok) {
                throw new Error('Failed to delete quest')
            }
            return questId
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)

const questSlice = createSlice({
    name: 'quests',
    initialState: {
        quests: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchquests.pending, (state) => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchquests.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.quests = action.payload
            })
            .addCase(fetchquests.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.payload
            })
            .addCase(createQuest.fulfilled, (state, action) => {
                state.quests.push(action.payload)
            })
            .addCase(updateQuest.fulfilled, (state, action) => {
                const index = state.quests.findIndex(
                    (quest) => quest.id === action.payload.id
                )
                if (index !== -1) {
                    state.quests[index] = action.payload
                }
            })
            .addCase(deleteQuest.fulfilled, (state, action) => {
                state.quests = state.quests.filter(
                    (quest) => quest.id !== action.payload
                )
            })
    },
})

export default questSlice.reducer

function getToken() {
    return localStorage.getItem('token') || ''
}
