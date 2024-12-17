import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../store/userSlice'
import { useSigninMutation } from '../services/api'

export default function SignInForm() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.currentUser)
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [signIn, { isLoading, isError, error }] = useSigninMutation()

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await signIn({ username, password }).unwrap()
            localStorage.setItem('token', response.token)
            dispatch(setUser(response.username))
        } catch (error) {
            console.error('Sign-in failed', error)
        }
    }

    useEffect(() => {
        if (user) {
            navigate('/quests')
        }
    }, [user, navigate])

    if (user) {
        return null
    }

    return (
        <div className="signin-form-container">
            <form onSubmit={handleFormSubmit} className="signin-form">
                <input
                    type="text"
                    className="signin-form-username"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Username"
                    disabled={isLoading}
                />
                <input
                    type="password"
                    className="signin-form-password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading}
                    className='signin-form-button'
                >
                    Sign In
                </button>
                {isError && (
                    <div className="signin-error-container">
                        <h3 className="signin-error-p">You shall not pass!!!</h3>
                        <p className="signin-error-p" style={{ fontSize: '10px' }}>
                            Incorrect Username/Password
                        </p>
                    </div>
                )}
            </form>
        </div>
    )
}
