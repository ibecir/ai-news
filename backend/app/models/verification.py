"""
Verification database model.
"""
from datetime import datetime
from sqlalchemy import Float, DateTime, ForeignKey, Text, ARRAY, String
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, List, Dict, Any

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.link import Link


class Verification(Base):
    """Verification model for storing fact-check results."""
    
    __tablename__ = "verifications"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    link_id: Mapped[int] = mapped_column(
        ForeignKey("links.id"), 
        unique=True, 
        nullable=False, 
        index=True
    )
    
    # Verification results
    credibility_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    
    # Claims checked - JSONB array of claim objects
    # Format: [{"claim": "...", "verdict": "verified|false|unverified", "sources": [...]}]
    claims: Mapped[Dict[str, Any] | None] = mapped_column(JSONB, nullable=True)
    
    # Sources used for verification
    sources_checked: Mapped[List[str] | None] = mapped_column(ARRAY(String), nullable=True)
    
    # Summary and notes
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    # Timestamps
    verified_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationship
    link: Mapped["Link"] = relationship("Link", back_populates="verification")
    
    def __repr__(self) -> str:
        return f"<Verification(id={self.id}, link_id={self.link_id}, score={self.credibility_score})>"
