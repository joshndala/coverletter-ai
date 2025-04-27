from sqlalchemy import Column, String, Text, ForeignKey, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    job_title = Column(String(255), nullable=False)
    company_name = Column(String(255), nullable=False, index=True)
    hiring_manager = Column(String(255), nullable=True)
    job_description = Column(Text, nullable=False)
    tone = Column(String(50), default='professional')
    max_length = Column(Integer, default=500)
    generated_content = Column(Text)
    status = Column(String(50), default='draft')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    user = relationship("User", backref="cover_letters")
    selected_experiences = relationship("CoverLetterExperience", back_populates="cover_letter")

class CoverLetterExperience(Base):
    __tablename__ = "cover_letter_experiences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cover_letter_id = Column(UUID(as_uuid=True), ForeignKey("cover_letters.id", ondelete="CASCADE"))
    experience_id = Column(UUID(as_uuid=True), ForeignKey("experiences.id", ondelete="CASCADE"))
    relevance_order = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    cover_letter = relationship("CoverLetter", back_populates="selected_experiences")
    experience = relationship("Experience")