"""
User Detail API
"""

from fastapi import (
    Request,
    Response,
    status,
    APIRouter,
    HTTPException,
    Depends,
)

from queries.user_queries import UserQueries

from models.users import FullUserResponse, UserResponse

from utils.authentication import try_get_jwt_user_data


router = APIRouter(tags=["User"], prefix="/api/users")


@router.get("/{username}", response_model=FullUserResponse)
async def get_by_username(
    user: UserResponse = Depends(try_get_jwt_user_data),
    queries: UserQueries = Depends(),
) -> FullUserResponse:
    user = queries.get_by_username(user.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="USER NOT FOUND!!!"
        )
    return user
