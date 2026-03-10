from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.database import get_db
from database.models import Project, Event
from .storage import StorageDep

router = APIRouter(prefix="/projects", tags=["Project Image Uploading"])
event_router = APIRouter(prefix="/events", tags=["Event Image Uploading"])

ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"]

@router.put("/{project_id}/image")
async def update_project_image(
    project_id: int, 
    storage: StorageDep,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Uploads a JPEG/PNG image for a specific project and updates the image_path.
    Validates file type and project existence before processing.
    """
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file.content_type}. Only JPEG and PNG are allowed."
        )

    project = await db.get(Project, project_id)
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Project not found"
        )

    try:
        file_url = await storage.upload(file, file.filename)
        project.image_path = file_url
        await db.commit()
        await db.refresh(project)
        return {
            "message": "Image uploaded successfully",
            "project_id": project_id,
            "image_url": file_url
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"An error occurred during upload: {str(e)}"
        )

@event_router.put("/{event_id}/image")
async def update_event_image(
    event_id: int,
    storage: StorageDep,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Uploads a JPEG/PNG image for a specific project and updates the image_path.
    Validates file type and project existence before processing.
    """
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file.content_type}. Only JPEG and PNG are allowed."
        )

    event = await db.get(Event, event_id)
    if not event:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Event not found"
        )

    try:
        file_url = await storage.upload(file, file.filename)
        event.image_path = file_url
        await db.commit()
        await db.refresh(event)
        return {
            "message": "Image uploaded successfully",
            "event_id": event_id,
            "image_url": file_url
        }

    except Exception as e:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=f"An error occurred during upload: {str(e)}"
        )
