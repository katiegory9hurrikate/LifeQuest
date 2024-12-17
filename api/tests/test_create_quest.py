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
async def test_create_quest(
    mock_depends,
    mock_try_get_jwt_user_data,
    mock_decode_jwt,
    MockQuestQueries,
    client,
):
    # Setup mock user
    mock_user = JWTUserData(id=1, username="test_dude")
    mock_payload = JWTPayload(exp=1000000000, sub="test_dude", user=mock_user)
    mock_decode_jwt.return_value = mock_payload
    mock_try_get_jwt_user_data.return_value = mock_user

    # Configure Depends mock to return our mock_try_get_jwt_user_data
    mock_depends.side_effect = lambda x: (
        x if x != mock_try_get_jwt_user_data else mock_user
    )

    # Setup mock quest
    mock_quest = QuestResponse(
        id=1,
        title="Test the quest",
        description="a testing of quests",
        completed=False,
        user_id=1,
    )

    # Configure the mock questQueries
    mock_quest_queries = MockQuestQueries.return_value
    mock_quest_queries.create_quest.return_value = mock_quest

    # Simulate request
    response = client.post(
        "/api/quests/create",
        json={
            "title": "Test the quest",
            "description": "a testing of quests",
            "completed": False,
        },
        headers={"Cookie": "fast_api_token=whatever"},
    )

    # Assertions
    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}, body: {response.json()}"
    assert response.json() == {
        "id": 1,
        "title": "Test the quest",
        "description": "a testing of quests",
        "completed": False,
        "user_id": 1,
    }

    # Verify mocked methods were called
    mock_decode_jwt.assert_called_once()
    mock_quest_queries.create_quest.assert_called_once_with(
        user_id=1,
        title="Test the quest",
        description="a testing of quests",
        completed=False,
    )


@pytest.mark.asyncio
@patch("routers.quest_router.QuestQueries")
@patch("utils.authentication.decode_jwt")
@patch("utils.authentication.try_get_jwt_user_data")
@patch("fastapi.Depends")
async def test_create_quest_unauthenticated(
    mock_depends,
    mock_try_get_jwt_user_data,
    mock_decode_jwt,
    MockQuestQueries,
    client,
):
    # Setup mock to return None, simulating no authenticated user
    mock_try_get_jwt_user_data.return_value = None
    mock_depends.side_effect = lambda x: (
        x if x != mock_try_get_jwt_user_data else None
    )

    # Simulate request without authentication
    response = client.post(
        "/api/quests/create",
        json={
            "title": "Test the quest",
            "description": "a testing of quests",
            "completed": False,
        },
    )

    # Assertions
    assert (
        response.status_code == 401
    ), f"Expected 401 Unauthorized, got: {response.status_code}"
    assert response.json() == {"detail": "User is not logged in!!!"}

    # Verify that quest creation was not attempted
    MockQuestQueries.return_value.create_quest.assert_not_called()
