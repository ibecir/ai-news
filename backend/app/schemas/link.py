"""
Link Pydantic schemas for request/response validation.
"""
from datetime import datetime
from typing import Optional, List, Any, Dict
from pydantic import BaseModel, HttpUrl, ConfigDict

from app.models.link import LinkStatus


# Request Schemas
class LinkCreate(BaseModel):
    """Schema for creating a new link."""
    url: HttpUrl
    title: Optional[str] = None


class LinkUpdate(BaseModel):
    """Schema for updating a link."""
    title: Optional[str] = None
    # URL cannot be updated, only metadata


# Response Schemas
class VerificationSummary(BaseModel):
    """Verification summary for link response."""
    credibility_score: Optional[float] = None
    claims_count: int = 0
    verified_at: Optional[datetime] = None
    summary: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)


class LinkBase(BaseModel):
    """Base link schema."""
    id: int
    url: str
    title: Optional[str] = None
    source_domain: Optional[str] = None
    author: Optional[str] = None
    published_at: Optional[datetime] = None
    status: LinkStatus
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class LinkResponse(LinkBase):
    """Link response schema."""
    pass


class LinkWithVerification(LinkBase):
    """Link response with verification details."""
    verification: Optional[VerificationSummary] = None


class LinkDetail(LinkBase):
    """Detailed link response including content."""
    content: Optional[str] = None
    error_message: Optional[str] = None
    verification: Optional["VerificationResponse"] = None


# Verification Response
class ClaimCheck(BaseModel):
    """Individual claim check result."""
    claim: str
    verdict: str  # verified, false, unverified, partially_true
    sources: List[str] = []
    explanation: Optional[str] = None


class VerificationResponse(BaseModel):
    """Full verification response."""
    id: int
    link_id: int
    credibility_score: Optional[float] = None
    claims: Optional[List[ClaimCheck]] = None
    sources_checked: Optional[List[str]] = None
    summary: Optional[str] = None
    verified_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


# Dashboard Stats
class LinkStats(BaseModel):
    """Statistics about user's links."""
    total_links: int
    verified_links: int
    pending_links: int
    failed_links: int
    average_credibility: Optional[float] = None
    links_by_status: Dict[str, int] = {}
    recent_links: List[LinkResponse] = []


# Pagination
class PaginatedLinks(BaseModel):
    """Paginated links response."""
    items: List[LinkWithVerification]
    total: int
    page: int
    page_size: int
    total_pages: int
