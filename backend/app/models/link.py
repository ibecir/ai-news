"""
Link database model.
"""
from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import String, Text, DateTime, ForeignKey, Enum, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List, Optional

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.verification import Verification
    from app.models.link_chunk import LinkChunk
    from app.models.link_query import LinkQuery


class LinkStatus(str, PyEnum):
    """Status of link processing."""
    pending = "pending"
    processing = "processing"
    scraped = "scraped"
    verified = "verified"
    failed = "failed"


class Link(Base):
    """Link model for storing news article URLs and metadata."""
    
    __tablename__ = "links"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False, index=True)
    
    # URL and extracted metadata
    url: Mapped[str] = mapped_column(Text, nullable=False)
    title: Mapped[str | None] = mapped_column(String(500), nullable=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    source_domain: Mapped[str | None] = mapped_column(String(255), nullable=True)
    author: Mapped[str | None] = mapped_column(String(255), nullable=True)
    published_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    
    # Processing status
    status: Mapped[LinkStatus] = mapped_column(
        Enum(LinkStatus), 
        default=LinkStatus.pending,
        nullable=False
    )
    error_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="links")
    verification: Mapped[Optional["Verification"]] = relationship(
        "Verification", 
        back_populates="link", 
        uselist=False,
        cascade="all, delete-orphan"
    )
    chunks: Mapped[List["LinkChunk"]] = relationship(
        "LinkChunk", 
        back_populates="link",
        cascade="all, delete-orphan"
    )
    queries: Mapped[List["LinkQuery"]] = relationship(
        "LinkQuery", 
        back_populates="link",
        cascade="all, delete-orphan"
    )
    
    def __repr__(self) -> str:
        return f"<Link(id={self.id}, url={self.url[:50]}..., status={self.status})>"
