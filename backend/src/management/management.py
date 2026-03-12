from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from database.database import get_db
from database.models import Project, ProjectExpense
from auth.login import require_admin
from auth.public_user import PublicUser
from fastapi.security import OAuth2PasswordBearer

from .schemas import (
    ProjectCreate,
    ProjectMemberResponse,
    ProjectUpdate,
    ProjectPublicResponse
)

router = APIRouter(prefix="/projects", tags=["Projects"])

oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="login", auto_error=False)

async def get_optional_user(token: str = Depends(oauth2_scheme_optional)):
    if token:
        from auth.login import verify_token_and_get_user
        try:
            return await verify_token_and_get_user(token)
        except:
            return None
    return None


@router.get("/", response_model=List[ProjectPublicResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    """FR-7: Includes image_path in the summary list."""
    result = await db.execute(select(Project))
    projects = result.scalars().all()
    response_list = []

    for project in projects:
        exp_result = await db.execute(
            select(ProjectExpense).where(ProjectExpense.project_id == project.id)
        )
        expenses = exp_result.scalars().all()
        
        total_spent = sum([exp.price * exp.quantity for exp in expenses])
        budget = getattr(project, 'budget', 10000.0)
        remaining = budget - total_spent
        
        project_data = {
            "id": project.id,
            "title": project.title,
            "description": project.description,
            "location": project.location,
            "start_date": project.start_date,
            "end_date": project.end_date,
            "status": project.status,
            "image_path": project.image_path,  
            "total_expenses": total_spent,
            "remaining_balance": remaining
        }
        response_list.append(project_data)
    return response_list

@router.get("/{project_id}")
async def get_project_details(
    project_id: int, 
    db: AsyncSession = Depends(get_db),
    current_user: PublicUser = Depends(get_optional_user)
):
    """FR-10 & FR-11: Includes image_path in the detailed view."""
    project = await db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    expenses_result = await db.execute(
        select(ProjectExpense).where(ProjectExpense.project_id == project_id)
    )
    expenses = expenses_result.scalars().all()
    
    total_spent = sum([exp.price * exp.quantity for exp in expenses])
    budget = getattr(project, 'budget', 10000.0)
    remaining = budget - total_spent

    base_data = {
        "id": project.id,
        "title": project.title,
        "description": project.description,
        "location": project.location,
        "start_date": project.start_date,
        "end_date": project.end_date,
        "status": project.status,
        "image_path": project.image_path,  
        "total_expenses": total_spent,
        "remaining_balance": remaining
    }

    if current_user and current_user.role in ["Member", "Admin"]:
        base_data["expenses"] = expenses
        return ProjectMemberResponse(**base_data)
    
    return ProjectPublicResponse(**base_data)


@router.post("/", dependencies=[require_admin])
async def create_project(project_in: ProjectCreate, db: AsyncSession = Depends(get_db)):
    if project_in.status not in ["Planned", "Ongoing", "Completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    new_project = Project(**project_in.model_dump())
    db.add(new_project)
    await db.commit()
    return {"message": "Project created successfully"}

@router.put("/{project_id}", dependencies=[require_admin])
async def update_project(project_id: int, project_in: ProjectUpdate, db: AsyncSession = Depends(get_db)):
    project = await db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project_in.status and project_in.status not in ["Planned", "Ongoing", "Completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    update_data = project_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)

    await db.commit()
    return {"message": "Project updated successfully"}

@router.delete("/{project_id}", dependencies=[require_admin])
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    project = await db.get(Project, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    await db.delete(project)
    await db.commit()
    return {"message": "Project deleted successfully"}
