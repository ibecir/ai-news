"""
Common Pydantic schemas for API responses.
"""
from typing import Any, Generic, Optional, TypeVar
from pydantic import BaseModel

T = TypeVar("T")


class APIResponse(BaseModel, Generic[T]):
    """Standard API response wrapper."""
    success: bool
    message: str
    data: Optional[T] = None


class ErrorResponse(BaseModel):
    """Error response schema."""
    success: bool = False
    message: str
    error_code: Optional[str] = None
    details: Optional[Any] = None


class MessageResponse(BaseModel):
    """Simple message response."""
    success: bool = True
    message: str


# Query Request
class QueryRequest(BaseModel):
    """Request schema for RAG queries."""
    question: str


class QueryResponse(BaseModel):
    """Response schema for RAG queries."""
    question: str
    answer: str
    sources: list[str] = []
