"""
Pydantic schemas package.
"""
from app.schemas.user import (
    UserLogin,
    UserCreate,
    UserUpdate,
    UserBase,
    UserResponse,
    UserWithStats,
)
from app.schemas.link import (
    LinkCreate,
    LinkUpdate,
    LinkBase,
    LinkResponse,
    LinkWithVerification,
    LinkDetail,
    VerificationSummary,
    VerificationResponse,
    ClaimCheck,
    LinkStats,
    PaginatedLinks,
)
from app.schemas.common import (
    APIResponse,
    ErrorResponse,
    MessageResponse,
    QueryRequest,
    QueryResponse,
)

__all__ = [
    # User
    "UserLogin",
    "UserCreate",
    "UserUpdate",
    "UserBase",
    "UserResponse",
    "UserWithStats",
    # Link
    "LinkCreate",
    "LinkUpdate",
    "LinkBase",
    "LinkResponse",
    "LinkWithVerification",
    "LinkDetail",
    "VerificationSummary",
    "VerificationResponse",
    "ClaimCheck",
    "LinkStats",
    "PaginatedLinks",
    # Common
    "APIResponse",
    "ErrorResponse",
    "MessageResponse",
    "QueryRequest",
    "QueryResponse",
]
