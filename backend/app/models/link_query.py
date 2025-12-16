"""
LinkQuery database model for storing user Q&A interactions.
"""
from datetime import datetime
from sqlalchemy import Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.link import Link
    from app.models.user import User


class LinkQuery(Base):
    """LinkQuery model for storing questions and answers about links."""
    
    __tablename__ = "link_queries"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    link_id: Mapped[int] = mapped_column(
        ForeignKey("links.id"), 
        nullable=False, 
        index=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), 
        nullable=False, 
        index=True
    )
    
    # Q&A content
    question: Mapped[str] = mapped_column(Text, nullable=False)
    answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationships
    link: Mapped["Link"] = relationship("Link", back_populates="queries")
    user: Mapped["User"] = relationship("User", back_populates="queries")
    
    def __repr__(self) -> str:
        return f"<LinkQuery(id={self.id}, link_id={self.link_id}, question={self.question[:30]}...)>"
