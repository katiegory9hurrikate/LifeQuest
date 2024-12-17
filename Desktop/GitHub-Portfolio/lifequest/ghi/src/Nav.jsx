import { useEffect, useCallback } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { logout, fetchUserData } from './store/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import { lifeQuestApi } from './services/api'

import './App.css'

function Nav() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { currentUser, isLoading } = useSelector((state) => state.user)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token && !currentUser) {
            dispatch(fetchUserData())
        }
    }, [dispatch, currentUser])

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        dispatch(logout())
        dispatch(lifeQuestApi.util.resetApiState())
        navigate('/signin')
    }, [dispatch, navigate])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <nav className="navbar">
            <NavLink
                to={currentUser ? '/quests' : '/signin'}
                className="home-link"
            >
                LifeQuest Home
            </NavLink>
            <div className="nav-links">
                {currentUser ? (
                    <>
                        <span>Welcome, {currentUser.first_name}!</span>{' '}
                        <NavLink to="/create">Create a Quest</NavLink>{' '}
                        <NavLink to="/quests">Quest List</NavLink>{' '}
                        <button
                            className="logout-button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <span>Please : </span>{' '}
                        <NavLink to="/signin">Login</NavLink> <span> Or </span>{' '}
                        <NavLink to="/signup">Sign Up</NavLink>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Nav
