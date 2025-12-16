"""
User Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict


# Request Schemas
class UserLogin(BaseModel):
    """Schema for user login request."""
    email: EmailStr


class UserCreate(BaseModel):
    """Schema for creating a new user."""
    email: EmailStr
    name: Optional[str] = None


class UserUpdate(BaseModel):
    """Schema for updating user details."""
    name: Optional[str] = None


# Response Schemas
class UserBase(BaseModel):
    """Base user schema."""
    id: int
    email: str
    name: Optional[str] = None
    created_at: datetime
    last_login_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


class UserResponse(UserBase):
    """User response schema."""
    pass


class UserWithStats(UserBase):
    """User response with statistics."""
    total_links: int = 0
    verified_links: int = 0
    pending_links: int = 0
