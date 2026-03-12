from pydantic import BaseModel, field_validator
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

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def strip_timezone(cls, v):
        if isinstance(v, str):
            v = datetime.fromisoformat(v.replace("Z", "+00:00"))
        if isinstance(v, datetime) and v.tzinfo:
            return v.replace(tzinfo=None)
        return v

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

    @field_validator("start_date", "end_date", mode="before")
    @classmethod
    def strip_timezone_optional(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            v = datetime.fromisoformat(v.replace("Z", "+00:00"))
        if isinstance(v, datetime) and v.tzinfo:
            return v.replace(tzinfo=None)
        return v

class ExpenseCreate(BaseModel):
    description: str
    category: str
    quantity: int
    price: float
    location: str
    date_purchased: datetime

    @field_validator("date_purchased", mode="before")
    @classmethod
    def strip_timezone(cls, v):
        if isinstance(v, str):
            v = datetime.fromisoformat(v.replace("Z", "+00:00"))
        if isinstance(v, datetime) and v.tzinfo:
            return v.replace(tzinfo=None)
        return v

class ExpenseItem(BaseModel):
    id: int
    description: str
    category: str
    quantity: int
    price: float
    location: str
    date_purchased: datetime

    @field_validator("date_purchased", mode="before")
    @classmethod
    def strip_timezone(cls, v):
        if isinstance(v, str):
            v = datetime.fromisoformat(v.replace("Z", "+00:00"))
        if isinstance(v, datetime) and v.tzinfo:
            return v.replace(tzinfo=None)
        return v

class ProjectPublicResponse(ProjectBase):
    id: int
    total_expenses: float 
    remaining_balance: float

class ProjectMemberResponse(ProjectPublicResponse):
    expenses: List[ExpenseItem] = []