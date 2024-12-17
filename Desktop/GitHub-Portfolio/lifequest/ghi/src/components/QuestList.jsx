import { useState, useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useGetQuestsQuery, useUpdateQuestMutation } from '../services/api'
import { NavLink, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function QuestList() {
    const { data: quests, isLoading, isError, error } = useGetQuestsQuery()
    const [updateQuest] = useUpdateQuestMutation()
    const navigate = useNavigate()
    const { currentUser, isLoading: isUserLoading } = useSelector(
        (state) => state.user
    )
    const [showCompleted, setShowCompleted] = useState(false)

    const handleQuestCompleted = async (quest) => {
        try {
            const updatedQuest = {
                ...quest,
                completed: !quest.completed,
            }
            await updateQuest(updatedQuest).unwrap()
            navigate('/quests')
        } catch (error) {
            console.error('Failed to update the quest', error)
        }
    }
    const toggleFilter = () => {
        setShowCompleted(!showCompleted)
    }

    if (!isUserLoading && !currentUser) {
        return <Navigate to="/signin" replace />
    }

    if (isUserLoading || isLoading) return <p>Loading...</p>
    if (quests.length === 0) {
        return (
            <div className="questlist-error-container">
                <p className="questlist-error-p">No quests to be found.</p>
                <Link to="/create" className="questlist-error-p">
                    Click here to start a new quest
                </Link>
            </div>
        )
    }

    const filteredQuests = showCompleted
        ? quests.filter((quest) => quest.completed)
        : quests.filter((quest) => !quest.completed)

    return (
        <div className="quest-list-container">
            <h2 className="quest-table-title">Quest Log</h2>
            <button onClick={toggleFilter} className="quest-list-filter-button">
                {showCompleted ? 'Completed' : 'Active'}
            </button>
            <table className="quest-table">
                <thead className="quest-table-head">
                    <tr>
                        <th>Quests</th>
                        <th>Description</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody className="quest-table-body">
                    {quests &&
                        filteredQuests.map((quest) => (
                            <tr key={quest.id}>
                                <td>
                                    <NavLink
                                        to={`/quests/${quest.id}`}
                                        className="quest-table-navlink"
                                    >
                                        {quest.title}
                                    </NavLink>
                                </td>
                                <td>
                                    <p className="quest-table-desc-p">
                                        {quest.description}
                                    </p>
                                </td>
                                <td>
                                    <label className="custom-checkbox-container">
                                        <input
                                            type="checkbox"
                                            className="custom-checkbox"
                                            checked={quest.completed}
                                            onChange={(e) =>
                                                handleQuestCompleted(quest)
                                            }
                                            disabled={isLoading} // Disable input while loading
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    )
}
