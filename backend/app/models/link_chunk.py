"""
LinkChunk database model for RAG embeddings.
"""
from datetime import datetime
from sqlalchemy import Text, DateTime, ForeignKey, Integer, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import TYPE_CHECKING, Optional

from app.db.session import Base

if TYPE_CHECKING:
    from app.models.link import Link


class LinkChunk(Base):
    """LinkChunk model for storing text chunks and their embeddings."""
    
    __tablename__ = "link_chunks"
    
    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    link_id: Mapped[int] = mapped_column(
        ForeignKey("links.id"), 
        nullable=False, 
        index=True
    )
    
    # Chunk content
    chunk_text: Mapped[str] = mapped_column(Text, nullable=False)
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    
    # Vector embedding stored as binary (can be converted to pgvector later)
    embedding: Mapped[Optional[bytes]] = mapped_column(LargeBinary, nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    
    # Relationship
    link: Mapped["Link"] = relationship("Link", back_populates="chunks")
    
    def __repr__(self) -> str:
        return f"<LinkChunk(id={self.id}, link_id={self.link_id}, index={self.chunk_index})>"
