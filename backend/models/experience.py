from sqlalchemy import Column, String, Boolean, DateTime, Date, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class Experience(Base):
    __tablename__ = "experiences"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    location = Column(String(255))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date)
    is_current = Column(Boolean, default=False)
    description = Column(Text)
    # Store combined text for embedding generation
    content_for_embedding = Column(Text, nullable=False)
    # Store the embedding vector (assuming 1536 dimensions for text-embedding-ada-002)
    embedding = Column(Vector(dim=1536))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="experiences")

class ExperienceSkill(Base):
    __tablename__ = "experience_skills"
    
    experience_id = Column(UUID(as_uuid=True), ForeignKey("experiences.id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    experience = relationship("Experience", backref="skills")
    skill = relationship("Skill")