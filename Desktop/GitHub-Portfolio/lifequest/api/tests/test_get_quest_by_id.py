import pytest
from main import app
from fastapi.testclient import TestClient
from unittest.mock import patch
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
async def test_get_quest_by_id(
    mock_depends,
    mock_try_get_jwt_user_data,
    mock_decode_jwt,
    MockQuestQueries,
    client,
):

    # MOCK AUTH/JWT:
    mock_user = JWTUserData(id=3, username="Herbert")
    mock_payload = JWTPayload(exp=30000, sub="Herbert", user=mock_user)
    mock_decode_jwt.return_value = mock_payload
    mock_try_get_jwt_user_data.return_value = mock_user

    mock_depends.side_effect = lambda x: (
        x if x != mock_try_get_jwt_user_data else mock_user
    )

    # MOCK QUEST:
    mock_quest = QuestResponse(
        id=3,
        title="I want to... SING!",
        description="NO! NO SINGING!!!",
        completed=False,
        user_id=3,
    )

    mock_quest_queries = MockQuestQueries.return_value
    mock_quest_queries.get_quest_by_id.return_value = mock_quest

    # RESPONSE:
    response = client.get(
        "api/quests/mine/3", headers={"Cookie": "fast_api_token=whatever"}
    )

    assert (
        response.status_code == 200
    ), f"Unexpected status code: {response.status_code}, body: {response.json()}"
    assert response.json() == {
        "id": 3,
        "title": "I want to... SING!",
        "description": "NO! NO SINGING!!!",
        "completed": False,
        "user_id": 3,
    }

    mock_decode_jwt.assert_called_once()
    mock_quest_queries.get_quest_by_id.assert_called_once_with(3)


@pytest.mark.asyncio
@patch("routers.quest_router.QuestQueries")
@patch("utils.authentication.try_get_jwt_user_data")
@patch("fastapi.Depends")
async def test_get_quest_by_id_unauthenticated(
    mock_depends,
    mock_try_get_jwt_user_data,
    MockQuestQueries,
    client,
):

    # MOCK AUTH/JWT:
    mock_try_get_jwt_user_data.return_value = None

    mock_depends.side_effect = lambda x: (
        x if x != mock_try_get_jwt_user_data else None
    )

    response = client.get("api/quests/mine/3")

    assert response.status_code == 401

    MockQuestQueries.return_value.get_quest_by_id.assert_not_called()
