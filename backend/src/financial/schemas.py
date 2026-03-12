from pydantic import BaseModel, computed_field, field_validator
from datetime import datetime
from typing import List, Optional

def strip_tz(v):
    if isinstance(v, str):
        v = datetime.fromisoformat(v.replace("Z", "+00:00"))
    if isinstance(v, datetime) and v.tzinfo:
        return v.replace(tzinfo=None)
    return v

class ExpenseBase(BaseModel):
    date_purchased: datetime
    location: str 
    description: str 
    category: str 
    quantity: int
    price: float

    @field_validator("date_purchased", mode="before")
    @classmethod
    def clean_date(cls, v):
        return strip_tz(v)

class ExpenseCreate(ExpenseBase):
    pass

class ExpenseUpdate(BaseModel):
    date_purchased: Optional[datetime] = None
    location: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    price: Optional[float] = None

    @field_validator("date_purchased", mode="before")
    @classmethod
    def clean_optional_date(cls, v):
        if v is not None:
            return strip_tz(v)
        return v

class ExpenseItemResponse(ExpenseBase):
    id: int
    project_id: int

    @computed_field
    def total(self) -> float:
        return self.quantity * self.price

class FinancialBreakdownResponse(BaseModel):
    project_id: int
    project_budget: float
    total_spent: float
    remaining_balance: float
    expenses: List[ExpenseItemResponse]