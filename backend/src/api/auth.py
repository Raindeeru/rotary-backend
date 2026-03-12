from typing import Annotated
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from auth import login
from auth.public_user import PublicUser
from auth.token import Token

router = APIRouter()

user_dependency = Annotated[PublicUser, Depends(login.get_current_user)]


@router.post("/login", response_model=Token, tags=["Authentication"])
async def login_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
    user = await login.authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=login.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = login.create_access_token(
        data={"sub": user.username}, 
        expires_delta=access_token_expires
    )

    return Token(
        access_token=access_token,
        token_type="bearer"
    )


@router.get("/user", response_model=PublicUser, tags=["Authentication"])
async def get_public_user(current_user: user_dependency):
    """
    This route is protected. It will only work if a valid 
    Bearer token is provided in the header.
    """
    return current_user
