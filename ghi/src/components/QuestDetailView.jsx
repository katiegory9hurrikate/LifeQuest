import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import {
    useGetQuestByIdQuery,
    useDeleteQuestMutation,
    useUpdateQuestMutation,
} from '../services/api'
import { useSelector } from 'react-redux'

export default function QuestDetailView() {
    const param = useParams()
    const quest_id = param.id
    const navigate = useNavigate()
    const {
        data: quest,
        isLoading,
        isError,
        error,
    } = useGetQuestByIdQuery(quest_id)
    skip: !quest_id
    const [deleteQuest] = useDeleteQuestMutation()
    const [updateQuest] = useUpdateQuestMutation()
    const { currentUser, isLoading: isUserLoading } = useSelector(
        (state) => state.user
    )
    const [questTitle, setQuestTitle] = useState('')
    const [questDescription, setQuestDescription] = useState('')
    const [questCompleted, setQuestCompleted] = useState(false)

    useEffect(() => {
        if (quest) {
            setQuestTitle(quest.title || '')
            setQuestDescription(quest.description || '')
            setQuestCompleted(quest.completed || false)
        }
    }, [quest])

    useEffect(() => {}, [quest_id])

    const handleQuestDelete = async () => {
        if (!quest_id) return
        const confirmed = window.confirm(
            'Are you sure you want to delete this quest?'
        )
        if (confirmed) {
            try {
                await deleteQuest({ id: quest_id }).unwrap()
                navigate('/quests')
            } catch (error) {
                console.error('Failed to delete the quest', error)
            }
        }
    }

    const handleQuestUpdate = async () => {
        try {
            const updatedQuest = {
                id: quest_id,
                title: questTitle,
                description: questDescription,
                completed: questCompleted,
            }
            await updateQuest(updatedQuest).unwrap()
            navigate('/quests')
        } catch (error) {
            console.error('Failed to update the quest', error)
        }
    }

    const handleCancel = () => {
        navigate('/Quests')
    }

    if (!isUserLoading && !currentUser) {
        return <Navigate to="/signin" replace />
    }

    if (!quest_id) return <p>No ID prov</p>
    if (isLoading) return <p>Loading Quest details...</p>
    if (isError)
        return (
            <p>
                Error loading Quest details:{' '}
                {error?.data?.message || 'Quest not found'}
            </p>
        )

    return (
        <div className="quest-detail-form">
            <h2 className="quest-detail-head" style={{ fontSize: '50px' }}>
                {quest.title}
            </h2>
            <input
                className="quest-input-title"
                type="text"
                value={questTitle}
                onChange={(e) => setQuestTitle(e.target.value)}
                placeholder="Update Quest Title"
            />
            <input
                className="quest-form-textarea"
                type="text"
                value={questDescription}
                onChange={(e) => setQuestDescription(e.target.value)}
                placeholder="Update Quest Description"
            />
            <label
                className="custom-checkbox-container"
                style={{ color: 'black', gap: '15px', padding: '10px' }}
            >
                Completed
                <input
                    type="checkbox"
                    className="custom-checkbox"
                    checked={questCompleted}
                    onChange={(e) => setQuestCompleted(e.target.checked)}
                />
                <span className="checkmark"></span>
            </label>
            <button className="quest-detail-button" onClick={handleQuestUpdate}>
                Save
            </button>
            <button className="quest-detail-button" onClick={handleCancel}>
                Cancel
            </button>
            <button className="quest-detail-button" onClick={handleQuestDelete}>
                Delete
            </button>
        </div>
    )
}
