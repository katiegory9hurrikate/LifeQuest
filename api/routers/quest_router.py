from fastapi import (
    status,
    APIRouter,
    HTTPException,
    Depends,
)


from utils.exceptions import UserDatabaseException

from models.jwt import JWTUserData

from utils.authentication import try_get_jwt_user_data, Optional

from queries.quest_queries import QuestQueries

from models.quests import QuestResponse, QuestRequest, UpdateQuestRequest

from models.users import UserResponse


router = APIRouter(tags=["quest"], prefix="/api/quests")


def get_quest_queries():
    return QuestQueries()


@router.post("/create", response_model=QuestResponse)
async def create_quest(
    new_quest: QuestRequest,
    user: Optional[JWTUserData] = Depends(try_get_jwt_user_data),
    queries: QuestQueries = Depends(get_quest_queries),
) -> QuestResponse:
    """
    Creates a new quest when someone submits the quest creation form
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is not logged in!!!",
        )
    # Create the quest in the database
    try:
        quest = queries.create_quest(
            user_id=user.id,
            title=new_quest.title,
            description=new_quest.description,
            completed=new_quest.completed,
        )
    except UserDatabaseException as e:
        print(e)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

    # Convert the new quest to a quest
    quest_out = QuestResponse(**quest.model_dump())
    return quest_out


@router.get("/mine", response_model=list[QuestResponse])
async def get_all_quests(
    user: UserResponse = Depends(try_get_jwt_user_data),
    queries: QuestQueries = Depends(get_quest_queries),
) -> list[QuestResponse]:
    """
    Fetch all quests assigned to the authenticated user
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is not logged in!!!",
        )

    quests = queries.get_all_user_quests(user_id=user.id)
    return quests


@router.get("/mine/{quest_id}", response_model=QuestResponse)
async def get_quest_by_id(
    quest_id: int,
    user: UserResponse = Depends(try_get_jwt_user_data),
    queries: QuestQueries = Depends(get_quest_queries),
) -> QuestResponse:
    """
    Fetch a specific quest assigned to the authenticated user
    """
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is not logged in!!!",
        )
    quest = queries.get_quest_by_id(quest_id)
    if not quest or quest.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="QUEST NOT FOUND!!!",
        )
    return quest


@router.put("/mine/{quest_id}", response_model=QuestResponse)
def update_user_quest_details(
    quest_id: int,
    update: UpdateQuestRequest,
    quest: QuestQueries = Depends(),
    user: UserResponse = Depends(try_get_jwt_user_data),
) -> QuestResponse:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User is not logged in!!!",
        )
    updated_quest_details = quest.update_user_quest_details(
        user_id=user.id,
        quest_id=quest_id,
        title=update.title,
        description=update.description,
        completed=update.completed,
    )
    if not updated_quest_details:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not able to update quest",
        )
    return updated_quest_details


@router.delete("/mine/{quest_id}")
async def delete_user_quest_by_id(
    quest_id: int,
    user: UserResponse = Depends(try_get_jwt_user_data),
    queries: QuestQueries = Depends(get_quest_queries),
) -> None:
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User Not Logged In!!!",
        )
    quest = queries.get_quest_by_id(quest_id)
    if not quest or quest.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Quest Not Found"
        )
    quest = queries.delete_user_quest_by_id(quest_id)
    return None
