import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '../store/userSlice'
import { useSignupMutation } from '../services/api'

export default function SignUpForm() {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user.currentUser)
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [first_name, setFirstName] = useState('')
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')

    const [signup, { isLoading, isError }] = useSignupMutation()

    async function handleFormSubmit(e) {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        try {
            const newUser = { username, password, first_name, email }
            const result = await signup(newUser).unwrap()
            localStorage.setItem('token', result.token)
            dispatch(setUser(result.username))
        } catch (error) {
            console.error('Signup failed: ', error)
            setError('Check Username or Email (one or both already taken)!')
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
        <form onSubmit={handleFormSubmit} className="signup-form">
            <input
                type="text"
                className="signup-form-input"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter Username"
            />
            <input
                type="password"
                className="signup-form-input"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
            />
            <input
                type="password"
                className="signup-form-input"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
            />
            <input
                type="text"
                className="signup-form-input"
                name="first_name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter First Name"
            />
            <input
                type="text"
                className="signup-form-input"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
            />
            {error && (
                <div className="signup-error-container">
                    <h3>
                        {error === 'Passwords do not match'
                            ? 'HALT!'
                            : 'Side Quest!'}
                    </h3>
                    <p>{error}</p>
                </div>
            )}
            <button type="submit" className="signup-form-button">
                Sign Up
            </button>
        </form>
    )
}
