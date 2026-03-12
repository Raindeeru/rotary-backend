from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update
from sqlalchemy import select
from typing import List, Optional

from database.database import get_db
from database.models import User
from auth.login import require_admin, require_member_or_admin
from auth.login import get_current_user
from auth.public_user import PublicUser

from auth.login import (get_current_user,
                        authenticate_user,
                        get_password_hash,
                        require_admin,
                        require_member_or_admin)


from pydantic import BaseModel, Field



class MemberPublicResponse(BaseModel):
    name: str
    vocation: str


class MemberFullResponse(MemberPublicResponse):
    id: int
    username: str
    email: str
    role: str
    status: str


class MemberProfileUpdate(BaseModel):
    name: Optional[str] = None
    vocation: Optional[str] = None
    email: Optional[str] = None

class AdminMemberUpdate(MemberProfileUpdate):
    role: Optional[str] = None
    status: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)


router = APIRouter(prefix="/members", tags=["Members Directory"])


from sqlalchemy.exc import IntegrityError

@router.post("/invite", dependencies=[require_admin])
async def invite_member(
    username: str,
    email: str,
    name: str,
    vocation: str,
    role: str = "Member",
    db: AsyncSession = Depends(get_db)
):
    temp_password = "password"
    hashed_pwd = get_password_hash(temp_password)

    new_user = User(
        username=username,
        name=name,
        vocation=vocation,
        email=email,
        role=role,
        hash=hashed_pwd,
        status="Active"
    )

    try:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with that email or username already exists."
        )
    except Exception as e:
        await db.rollback()
        print(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An internal server error occurred."
        )

    return {
        "message": f"Successfully invited {username}.",
        "temporary_password": temp_password
    }

@router.put("/change-password")
async def change_password(
    request: PasswordChangeRequest,
    current_user: PublicUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Allows an authenticated user to change their own password.
    Perfect for users logging in with their temporary 'changeme123' password.
    """
    is_valid = await authenticate_user(current_user.username, request.current_password)

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect current password."
        )

    new_hashed_password = get_password_hash(request.new_password)

    try:
        stmt = (
            update(User)
            .where(User.id == current_user.id)
            .values(hash=new_hashed_password)
        )
        await db.execute(stmt)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update password."
        )

    return {"message": "Password updated successfully."}


@router.get("/public", response_model=List[MemberPublicResponse])
async def get_public_directory(db: AsyncSession = Depends(get_db)):
    """FR-22: Public users view a basic directory (name and vocation only)."""
    result = await db.execute(select(User).where(User.status == "Active"))
    members = result.scalars().all()
    return members


@router.get("/", response_model=List[MemberFullResponse], dependencies=[require_member_or_admin])
async def get_full_directory(
    vocation: Optional[str] = None, 
    db: AsyncSession = Depends(get_db)
):
    """FR-23: Members view the full directory and can search by vocation."""
    query = select(User)
    
    if vocation:
        query = query.where(User.vocation.ilike(f"%{vocation}%"))
        
    result = await db.execute(query)
    return result.scalars().all()

@router.put("/me", response_model=MemberFullResponse)
async def update_own_profile(
    profile_data: MemberProfileUpdate,
    current_user: PublicUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """FR-24: Members shall be able to update their own profile information."""
    user = await db.get(User, current_user.id)
    
    update_data = profile_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    await db.commit()
    await db.refresh(user)
    return user

@router.put("/{user_id}", response_model=MemberFullResponse, dependencies=[require_admin])
async def update_member_record(
    user_id: int,
    update_data: AdminMemberUpdate,
    db: AsyncSession = Depends(get_db)
):
    """FR-25: Administrators shall be able to update member records."""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    data = update_data.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(user, key, value)

    await db.commit()
    await db.refresh(user)
    return user

@router.delete("/{user_id}", dependencies=[require_admin])
async def remove_member_record(user_id: int, db: AsyncSession = Depends(get_db)):
    """FR-25: Administrators shall be able to remove member records."""
    user = await db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await db.delete(user)
    await db.commit()
    return {"message": "Member record successfully removed."}
