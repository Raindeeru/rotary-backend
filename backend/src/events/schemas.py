# schemas/events.py
from pydantic import BaseModel, field_validator
from datetime import datetime
from typing import Optional

# FR-27: Allowed event categories
ALLOWED_EVENT_TYPES = [
    "Meeting",
    "Project Schedule",
    "Induction Ceremony",
    "Rescheduling Notice"
]

# schemas/events.py (Add these to the bottom of your events schemas)
from pydantic import BaseModel, computed_field, ConfigDict
from datetime import datetime
from typing import List, Optional

class EventExpenseBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    date_purchased: datetime
    location: str
    description: str
    category: str
    quantity: int
    price: float

class EventExpenseCreate(EventExpenseBase):
    pass

class EventExpenseUpdate(BaseModel):
    date_purchased: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None

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
    budget: float = 0.0 # Added to match your DB earlier
    image_path: Optional[str] = None # <--- ADD THIS

    @field_validator('event_type')
    def validate_event_type(cls, v):
        if v not in ALLOWED_EVENT_TYPES:
            raise ValueError(f"event_type must be one of {ALLOWED_EVENT_TYPES}")
        return v

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
    event_type: Optional[str] = None
    budget: Optional[float] = None # Added for consistency
    image_path: Optional[str] = None # <--- ADD THIS

class EventResponse(EventBase):
    id: int
    admin_id: Optional[int]
    
    # Ensure this model can read from SQLAlchemy objects
    model_config = ConfigDict(from_attributes=True)
