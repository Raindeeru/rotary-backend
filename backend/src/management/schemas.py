from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ProjectBase(BaseModel):
    title: str
    description: str
    location: str
    start_date: datetime
    end_date: datetime
    status: str
    image_path: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    status: Optional[str] = None
    budget: Optional[float] = None

class ExpenseItem(BaseModel):
    id: int
    description: str
    category: str
    quantity: int
    price: float
    location: str
    date_purchased: datetime

class ProjectPublicResponse(ProjectBase):
    id: int
    total_expenses: float 
    remaining_balance: float

class ProjectMemberResponse(ProjectPublicResponse):
    expenses: List[ExpenseItem] = []
