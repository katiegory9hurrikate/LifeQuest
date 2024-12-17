"""
Pydantic Models for Users.
"""

from pydantic import BaseModel


class UserRequest(BaseModel):
    """
    Represents a the parameters needed to create a new user
    """

    username: str
    password: str
    first_name: str
    email: str


class UserResponse(BaseModel):
    """
    Represents a user, with the password not included
    """

    id: int
    username: str


class FullUserResponse(BaseModel):
    """
    Represents a complete query of user details
    """

    id: int
    username: str
    first_name: str
    email: str


class UserWithPw(BaseModel):
    """
    Represents a user with password included
    """

    id: int
    username: str
    password: str
    first_name: str
    email: str


class UserLogin(BaseModel):

    username: str
    password: str


class UserSignIn(BaseModel):
    username: str
    password: str
