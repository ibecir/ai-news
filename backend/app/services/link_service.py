"""
Link service for business logic.
"""
from datetime import datetime
from typing import Optional, List
from urllib.parse import urlparse
from sqlalchemy import select, func, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.link import Link, LinkStatus
from app.models.verification import Verification
from app.schemas.link import (
    LinkCreate, 
    LinkUpdate, 
    LinkWithVerification,
    VerificationSummary,
    LinkStats,
    PaginatedLinks,
)


class LinkService:
    """Service class for link operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, user_id: int, link_data: LinkCreate) -> Link:
        """Create a new link."""
        # Extract domain from URL
        parsed_url = urlparse(str(link_data.url))
        source_domain = parsed_url.netloc
        
        link = Link(
            user_id=user_id,
            url=str(link_data.url),
            source_domain=source_domain,
            status=LinkStatus.pending,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        self.db.add(link)
        await self.db.flush()
        await self.db.refresh(link)
        
        return link
    
    async def get_by_id(self, link_id: int, user_id: int) -> Optional[Link]:
        """Get link by ID (scoped to user)."""
        result = await self.db.execute(
            select(Link)
            .options(selectinload(Link.verification))
            .where(Link.id == link_id, Link.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_links(
        self, 
        user_id: int, 
        page: int = 1, 
        page_size: int = 10,
        status: Optional[LinkStatus] = None
    ) -> PaginatedLinks:
        """Get paginated links for a user."""
        # Build base query
        print("USEEEEEEEEER ID ISSS ", user_id)
        query = select(Link).where(Link.user_id == user_id)
        
        if status:
            query = query.where(Link.status == status)
        
        # Count total
        count_query = select(func.count(Link.id)).where(Link.user_id == user_id)
        if status:
            count_query = count_query.where(Link.status == status)
        
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0
        
        # Get paginated results
        offset = (page - 1) * page_size
        query = (
            query
            .options(selectinload(Link.verification))
            .order_by(desc(Link.created_at))
            .offset(offset)
            .limit(page_size)
        )
        
        result = await self.db.execute(query)
        links = result.scalars().all()
        
        # Convert to response schema
        items = []
        for link in links:
            verification_summary = None
            if link.verification:
                claims_count = 0
                if link.verification.claims:
                    claims_count = len(link.verification.claims) if isinstance(link.verification.claims, list) else 0
                
                verification_summary = VerificationSummary(
                    credibility_score=link.verification.credibility_score,
                    claims_count=claims_count,
                    verified_at=link.verification.verified_at,
                    summary=link.verification.summary,
                )
            
            items.append(LinkWithVerification(
                id=link.id,
                url=link.url,
                title=link.title,
                source_domain=link.source_domain,
                author=link.author,
                published_at=link.published_at,
                status=link.status,
                created_at=link.created_at,
                updated_at=link.updated_at,
                verification=verification_summary,
            ))
        
        total_pages = (total + page_size - 1) // page_size
        
        return PaginatedLinks(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
    
    async def update(
        self, 
        link_id: int, 
        user_id: int, 
        link_data: LinkUpdate
    ) -> Optional[Link]:
        """Update a link."""
        link = await self.get_by_id(link_id, user_id)
        if not link:
            return None
        
        if link_data.title is not None:
            link.title = link_data.title
        
        link.updated_at = datetime.utcnow()
        await self.db.flush()
        await self.db.refresh(link)
        
        return link
    
    async def delete(self, link_id: int, user_id: int) -> bool:
        """Delete a link."""
        link = await self.get_by_id(link_id, user_id)
        if not link:
            return False
        
        await self.db.delete(link)
        await self.db.flush()
        
        return True
    
    async def update_status(
        self, 
        link: Link, 
        status: LinkStatus, 
        error_message: Optional[str] = None
    ) -> Link:
        """Update link status."""
        link.status = status
        link.error_message = error_message
        link.updated_at = datetime.utcnow()
        await self.db.flush()
        await self.db.refresh(link)
        return link
    
    async def update_metadata(
        self,
        link: Link,
        title: Optional[str] = None,
        content: Optional[str] = None,
        author: Optional[str] = None,
        published_at: Optional[datetime] = None,
    ) -> Link:
        """Update link metadata after scraping."""
        if title:
            link.title = title
        if content:
            link.content = content
        if author:
            link.author = author
        if published_at:
            link.published_at = published_at
        
        link.updated_at = datetime.utcnow()
        await self.db.flush()
        await self.db.refresh(link)
        return link
    
    async def get_stats(self, user_id: int) -> LinkStats:
        """Get link statistics for a user."""
        # Total by status
        status_result = await self.db.execute(
            select(Link.status, func.count(Link.id))
            .where(Link.user_id == user_id)
            .group_by(Link.status)
        )
        status_counts = {str(row[0].value): row[1] for row in status_result.all()}
        
        total = sum(status_counts.values())
        
        # Average credibility
        avg_result = await self.db.execute(
            select(func.avg(Verification.credibility_score))
            .join(Link, Verification.link_id == Link.id)
            .where(Link.user_id == user_id)
            .where(Verification.credibility_score.isnot(None))
        )
        avg_credibility = avg_result.scalar()
        
        # Recent links
        recent_result = await self.db.execute(
            select(Link)
            .where(Link.user_id == user_id)
            .order_by(desc(Link.created_at))
            .limit(5)
        )
        recent_links = recent_result.scalars().all()
        
        return LinkStats(
            total_links=total,
            verified_links=status_counts.get("verified", 0),
            pending_links=status_counts.get("pending", 0) + status_counts.get("processing", 0),
            failed_links=status_counts.get("failed", 0),
            average_credibility=round(avg_credibility, 2) if avg_credibility else None,
            links_by_status=status_counts,
            recent_links=recent_links,
        )
    
    async def check_url_exists(self, user_id: int, url: str) -> bool:
        """Check if URL already exists for user."""
        result = await self.db.execute(
            select(func.count(Link.id))
            .where(Link.user_id == user_id, Link.url == url)
        )
        return (result.scalar() or 0) > 0
