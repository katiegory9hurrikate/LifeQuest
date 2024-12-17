import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom'

import SignInForm from './components/SignInForm'
import SignUpForm from './components/SignUpForm'
import QuestList from './components/QuestList'
import QuestForm from './components/QuestForm'
import QuestDetailView from './components/QuestDetailView'
import App from './App'

import './index.css'
import store from './store/store'
import { Provider } from 'react-redux'

const BASE_URL = import.meta.env.BASE_URL
if (!BASE_URL) {
    throw new Error('BASE_URL is not defined')
}

const authLoader = () => {
    const token = localStorage.getItem('token')
    if (!token) {
        return redirect('/signin')
    }
    return null
}

const router = createBrowserRouter(
    [
        {
            path: '/',
            element: <App />,
            children: [
                {
                    path: 'signup',
                    element: <SignUpForm />,
                },
                {
                    path: 'signin',
                    element: <SignInForm />,
                },
                {
                    path: 'create',
                    element: <QuestForm />,
                    loader: authLoader,
                },
                {
                    path: 'quests',
                    element: <QuestList />,
                    loader: authLoader,
                },
                {
                    path: 'quests/:id',
                    element: <QuestDetailView />,
                    loader: authLoader,
                },
            ],
        },
    ],
    {
        basename: BASE_URL,
    }
)

const rootElement = document.getElementById('root')
if (!rootElement) {
    throw new Error('root element was not found!')
}

// Log out the environment variables while you are developing and deploying
// This will help debug things
console.table(import.meta.env)

const root = ReactDOM.createRoot(rootElement)
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </React.StrictMode>
)
