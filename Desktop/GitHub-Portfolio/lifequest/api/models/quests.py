from pydantic import BaseModel
from typing import Optional


class QuestRequest(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


class QuestResponse(BaseModel):
    id: int
    user_id: int
    title: str
    description: Optional[str] = None
    completed: bool


class UpdateQuestRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: bool = False
