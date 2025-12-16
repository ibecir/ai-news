"""
User service for business logic.
"""
from datetime import datetime
from typing import Optional
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.models.link import Link, LinkStatus
from app.schemas.user import UserCreate, UserWithStats


class UserService:
    """Service class for user operations."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_by_email(self, email: str) -> Optional[User]:
        """Get user by email address."""
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def create(self, user_data: UserCreate) -> User:
        """Create a new user."""
        user = User(
            email=user_data.email,
            name=user_data.name,
            created_at=datetime.utcnow(),
        )
        self.db.add(user)
        await self.db.flush()
        await self.db.refresh(user)
        return user
    
    async def update_last_login(self, user: User) -> User:
        """Update user's last login timestamp."""
        user.last_login_at = datetime.utcnow()
        await self.db.flush()
        await self.db.refresh(user)
        return user
    
    async def get_user_stats(self, user_id: int) -> dict:
        """Get user statistics."""
        # Total links
        total_result = await self.db.execute(
            select(func.count(Link.id)).where(Link.user_id == user_id)
        )
        total_links = total_result.scalar() or 0
        
        # Links by status
        status_result = await self.db.execute(
            select(Link.status, func.count(Link.id))
            .where(Link.user_id == user_id)
            .group_by(Link.status)
        )
        status_counts = {str(row[0].value): row[1] for row in status_result.all()}
        
        # Average credibility
        from app.models.verification import Verification
        avg_result = await self.db.execute(
            select(func.avg(Verification.credibility_score))
            .join(Link, Verification.link_id == Link.id)
            .where(Link.user_id == user_id)
            .where(Verification.credibility_score.isnot(None))
        )
        avg_credibility = avg_result.scalar()
        
        stats = {
            "total_links": total_links,
            "verified_links": status_counts.get("verified", 0),
            "pending_links": status_counts.get("pending", 0) + status_counts.get("processing", 0),
            "failed_links": status_counts.get("failed", 0),
            "average_credibility": round(avg_credibility, 2) if avg_credibility else None,
            "links_by_status": status_counts,
        }
        
        return stats
    
    async def get_user_with_stats(self, user: User) -> UserWithStats:
        """Get user with their statistics."""
        stats = await self.get_user_stats(user.id)
        return UserWithStats(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
            last_login_at=user.last_login_at,
            **stats
        )
