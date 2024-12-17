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
async def test_delete_quest_authenticated(
    mock_depends,
    mock_try_get_jwt_user_data,
    mock_decode_jwt,
    MockQuestQueries,
    client,
):

    mock_user = JWTUserData(id=1, username="test_user")
    mock_payload = JWTPayload(exp=1000000000, sub="test_user", user=mock_user)
    mock_decode_jwt.return_value = mock_payload
    mock_try_get_jwt_user_data.return_value = mock_user

    mock_depends.side_effect = lambda x: (
        x if x != mock_try_get_jwt_user_data else mock_user
    )

    mock_quest = QuestResponse(
        id=1,
        title="Test the quest",
        description="a testing of quests",
        completed=False,
        user_id=1,
    )

    mock_quest_queries = MockQuestQueries.return_value
    mock_quest_queries.get_quest_by_id.return_value = mock_quest
    mock_quest_queries.delete_user_quest_by_id.return_value = None

    response = client.delete(
        "api/quests/mine/1", headers={"Cookie": "fast_api_token=whatever"}
    )

    print(response.json())
    assert response.status_code == 200
    assert response.json() == None

    mock_decode_jwt.assert_called_once()
    mock_quest_queries.delete_user_quest_by_id.assert_called_once_with(1)


@pytest.mark.asyncio
@patch("routers.quest_router.QuestQueries")
@patch("utils.authentication.decode_jwt")
@patch("utils.authentication.try_get_jwt_user_data")
@patch("fastapi.Depends")
async def test_delete_quest_unauthenticated(
    mock_depends,
    mock_try_get_jwt_user_data,
    mock_decode_jwt,
    MockQuestQueries,
    client,
):

    mock_try_get_jwt_user_data.return_value = None
    mock_depends.side_effect = lambda x: (
        x if x != mock_try_get_jwt_user_data else None
    )

    response = client.delete("api/quests/mine/1")

    assert (
        response.status_code == 401
    ), f"Expected 401 Unauthorized, got: {response.status_code}"
    assert response.json() == {"detail": "User Not Logged In!!!"}

    MockQuestQueries.return_value.delete_user_quest_by_id.assert_not_called()
