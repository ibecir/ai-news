"""
User database model.
"""
from datetime import datetime
from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.link import Link
    from app.models.link_query import LinkQuery


class User(Base):
    """User model for email-based authentication."""
    
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
    # Relationships
    links: Mapped[List["Link"]] = relationship("Link", back_populates="user", cascade="all, delete-orphan")
    queries: Mapped[List["LinkQuery"]] = relationship("LinkQuery", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email})>"
