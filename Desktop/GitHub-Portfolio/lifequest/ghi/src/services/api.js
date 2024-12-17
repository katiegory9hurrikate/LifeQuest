import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const API_HOST = import.meta.env.VITE_API_HOST

export const lifeQuestApi = createApi({
    reducerPath: 'lifeQuestApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_HOST}/api/`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token')
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            return headers
        },
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        getUser: builder.query({
            query: (username) => `users/${username}`,
        }),
        getQuests: builder.query({
            query: () => 'quests/mine',
            providesTags: ['quests'],
        }),
        getQuestById: builder.query({
            query: (id) => `quests/mine/${id}`,
            providesTags: ['quests'],
        }),
        createQuest: builder.mutation({
            query: (quest) => ({
                url: 'quests/create',
                method: 'POST',
                body: quest,
            }),
            invalidatesTags: ['quests'],
        }),
        updateQuest: builder.mutation({
            query: (quest) => ({
                url: `quests/mine/${quest.id}`,
                method: 'PUT',
                body: quest,
            }),
            invalidatesTags: ['quests'],
        }),
        deleteQuest: builder.mutation({
            query: (quest) => ({
                url: `quests/mine/${quest.id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['quests'],
        }),
        signup: builder.mutation({
            query: (newUser) => ({
                url: 'auth/signup',
                method: 'POST',
                body: newUser,
            }),
        }),
        signin: builder.mutation({
            query: (credentials) => ({
                url: 'auth/signin',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
})

export const {
    useGetUserQuery,
    useGetQuestsQuery,
    useCreateQuestMutation,
    useUpdateQuestMutation,
    useDeleteQuestMutation,
    useSignupMutation,
    useSigninMutation,
    useGetQuestByIdQuery,
} = lifeQuestApi

export default lifeQuestApi
