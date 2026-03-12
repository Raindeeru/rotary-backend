from pydantic import BaseModel, field_validator, computed_field, ConfigDict
from datetime import datetime
from typing import List, Optional

ALLOWED_EVENT_TYPES = [
    "Meeting",
    "Project Schedule",
    "Induction Ceremony",
    "Rescheduling Notice"
]

class EventExpenseBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    date_purchased: datetime
    location: str
    description: str
    category: str
    quantity: int
    price: float

    @field_validator("date_purchased", mode="before")
    @classmethod
    def strip_timezone(cls, v):
        if isinstance(v, str):
            v = datetime.fromisoformat(v.replace("Z", "+00:00"))
        if isinstance(v, datetime) and v.tzinfo:
            return v.replace(tzinfo=None)
        return v

class EventExpenseCreate(EventExpenseBase):
    pass

class EventExpenseUpdate(BaseModel):
    date_purchased: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None

    @field_validator("date_purchased", mode="before")
    @classmethod
    def strip_timezone_optional(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            v = datetime.fromisoformat(v.replace("Z", "+00:00"))
        if isinstance(v, datetime) and v.tzinfo:
            return v.replace(tzinfo=None)
        return v

class EventExpenseResponse(EventExpenseBase):
    id: int
    event_id: int

    @computed_field
    def total(self) -> float:
        return self.quantity * self.price

class EventFinancialBreakdownResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    event_id: int
    total_spent: float
    expenses: List[EventExpenseResponse]

class EventBase(BaseModel):
    title: str
    description: str
    date: datetime
    event_type: str 
    budget: float = 0.0
    image_path: Optional[str] = None

    @field_validator('event_type')
    @classmethod
    def validate_event_type(cls, v):
        if v not in ALLOWED_EVENT_TYPES:
            raise ValueError(f"event_type must be one of {ALLOWED_EVENT_TYPES}")
        return v

    @field_validator("date", mode="before")
    @classmethod
    def strip_timezone(cls, v):
        if isinstance(v, str):
            v = datetime.fromisoformat(v.replace("Z", "+00:00"))
        if isinstance(v, datetime) and v.tzinfo:
            return v.replace(tzinfo=None)
        return v

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    event_type: Optional[str] = None
    budget: Optional[float] = None
    image_path: Optional[str] = None

    @field_validator("date", mode="before")
    @classmethod
    def strip_timezone_optional(cls, v):
        if v is None:
            return v
        if isinstance(v, str):
            v = datetime.fromisoformat(v.replace("Z", "+00:00"))
        if isinstance(v, datetime) and v.tzinfo:
            return v.replace(tzinfo=None)
        return v

class EventResponse(EventBase):
    id: int
    admin_id: Optional[int]
    
    model_config = ConfigDict(from_attributes=True)