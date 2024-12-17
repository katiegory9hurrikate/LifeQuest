import { useState } from 'react'
import { useCreateQuestMutation } from '../services/api'
import { useNavigate, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function questForm({ onSubmit }) {
    const [createQuest, { isLoading, isError }] = useCreateQuestMutation()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [completed, setCompleted] = useState(false)
    const navigate = useNavigate()
    const { currentUser, isLoading: isUserLoading } = useSelector(
        (state) => state.user
    )

    const handleSubmit = async (e) => {
        e.preventDefault()
        const newQuest = { title, description, completed }

        try {
            await createQuest(newQuest).unwrap()
            if (onSubmit) onSubmit(newQuest)
            setTitle('')
            setDescription('')
            setCompleted(false)

            const addMore = window.confirm(
                'Quest created succesfully! Would you like to add more?'
            )
            if (addMore) {
            } else {
                navigate('/quests')
            }
        } catch (error) {
            console.error('Failed to create quest:', error)
        }
    }

    if (!isUserLoading && !currentUser) {
        return <Navigate to="/signin" replace />
    }

    return (
        <div className="quest-form">
            <form className="quest-input-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    className="quest-input-title"
                    placeholder="Quest Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading} // Disable input while loading
                />
                <br></br>
                <textarea
                    className="quest-form-textarea"
                    placeholder="Quest Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading} // Disable input while loading
                />
                <br></br>
                <button
                    type="submit"
                    className="quest-input-button"
                    disabled={isLoading}
                >
                    Create Quest
                </button>
                {isError && (
                    <div className="quest-form-error-container">
                        <p className="quest-form-error-p">
                            Quest denied. Try harder.
                        </p>
                    </div>
                )}
            </form>
        </div>
    )
}
