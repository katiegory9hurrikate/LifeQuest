import pytest
from unittest.mock import patch
from fastapi.testclient import TestClient
from main import app
from models.jwt import JWTUserData, JWTPayload
from models.quests import QuestResponse


@pytest.fixture
def client():
    return TestClient(app)


@pytest.mark.asyncio
@patch("routers.quest_router.QuestQueries")
@patch("utils.authentication.decode_jwt")
@patch("utils.authentication.try_get_jwt_user_data")
@patch("fastapi.Depends")
async def test_get_all_quests(
    mock_depends,
    mock_try_get_jwt_user_data,
    mock_decode_jwt,
    MockQuestQueries,
    client,
):

    mock_user = JWTUserData(id=2, username="Mr Sir")
    mock_payload = JWTPayload(exp=20000, sub="Mr Sir", user=mock_user)
    mock_decode_jwt.return_value = mock_payload
    mock_try_get_jwt_user_data.return_value = mock_user

    mock_depends.side_effect = lambda x: (
        x if x != mock_try_get_jwt_user_data else mock_user
    )

    mock_quest = QuestResponse(
        id=1,
        title="My quest",
        description="Do this thing",
        completed=False,
        user_id=2,
    )

    mock_quest_two = QuestResponse(
        id=2,
        title="Next quest",
        description="Another quest to do",
        completed=True,
        user_id=2,
    )

    mock_quest_queries = MockQuestQueries.return_value
    mock_quest_queries.get_all_user_quests.return_value = [
        mock_quest,
        mock_quest_two,
    ]

    response = client.get(
        "api/quests/mine", headers={"Cookie": "fast_api_token=whatever"}
    )

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": 1,
            "title": "My quest",
            "description": "Do this thing",
            "completed": False,
            "user_id": 2,
        },
        {
            "id": 2,
            "title": "Next quest",
            "description": "Another quest to do",
            "completed": True,
            "user_id": 2,
        },
    ]

    mock_decode_jwt.assert_called_once()
    mock_quest_queries.get_all_user_quests.assert_called_once_with(user_id=2)


@pytest.mark.asyncio
@patch("routers.quest_router.QuestQueries")
@patch("utils.authentication.try_get_jwt_user_data")
@patch("fastapi.Depends")
async def test_get_all_user_quests_unauthenticated(
    mock_depends, mock_try_get_jwt_user_data, MockQuestQueries, client
):
    # Set mock to return None, simulates unauthenticated user
    mock_try_get_jwt_user_data.return_value = None
    mock_depends.side_effect = lambda x: (
        x if x != mock_try_get_jwt_user_data else None
    )

    # Simulate unauthenticated request
    response = client.get("api/quests/mine")

    # Assertions
    assert response.status_code == 401

    # Verify that get all quests was not requested
    MockQuestQueries.return_value.get_all_user_quests.assert_not_called()
