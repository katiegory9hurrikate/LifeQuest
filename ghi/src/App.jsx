import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Provider } from 'react-redux'
import { useDispatch, useSelector } from 'react-redux'
import { useGetUserQuery } from './services/api'
import store from './store/store'
import Nav from './Nav'
import './App.css'
import { setUser, fetchUserData } from './store/userSlice'

const API_HOST = import.meta.env.VITE_API_HOST

if (!API_HOST) {
    throw new Error('VITE_API_HOST is not defined')
}

export default function App() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()
    const user = useSelector((state) => state.user.currentUser)
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const {
        data: userData,
        error: userError,
        isLoading,
    } = useGetUserQuery(username, {
        skip: !token,
    })

    useEffect(() => {
        if (token && !user) {
            dispatch(fetchUserData())
        }
    }, [token, user, dispatch])

    useEffect(() => {
        if (userData) {
            dispatch(setUser(userData))
        }
    }, [userData, dispatch])

    useEffect(() => {
        if (
            !token &&
            location.pathname !== '/signin' &&
            location.pathname !== '/signup'
        ) {
            navigate('/signin')
        }
    }, [token, location, navigate])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <Provider store={store}>
            <Nav />
            <div className="App">
                <header className="App-header"></header>
                <Outlet />
                {/* <ErrorNotification error={error} /> */}
                {/* <Construct info={launchInfo} /> */}
            </div>
        </Provider>
    )
}
