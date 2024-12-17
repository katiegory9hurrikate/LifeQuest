import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import questReducer from './questSlice'
import { lifeQuestApi } from '../services/api'

const store = configureStore({
    reducer: {
        user: userReducer,
        quests: questReducer,
        [lifeQuestApi.reducerPath]: lifeQuestApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(lifeQuestApi.middleware),
})

export default store
