from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer, Float
from sqlalchemy.dialects.postgresql import UUID
from pgvector.sqlalchemy import Vector
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class JobApplication(Base):
    __tablename__ = "job_applications"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    company_name = Column(String(255), nullable=False)
    job_title = Column(String(255), nullable=False)
    job_description = Column(Text, nullable=False)
    # Store combined text for embedding generation (job title + description)
    content_for_embedding = Column(Text, nullable=False)
    # Store the embedding vector
    embedding = Column(Vector(dim=1536))
    cover_letter = Column(Text)
    status = Column(String(50), default='draft')
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="job_applications")

class JobApplicationExperience(Base):
    __tablename__ = "job_application_experiences"
    
    job_application_id = Column(UUID(as_uuid=True), ForeignKey("job_applications.id", ondelete="CASCADE"), primary_key=True)
    experience_id = Column(UUID(as_uuid=True), ForeignKey("experiences.id", ondelete="CASCADE"), primary_key=True)
    relevance_order = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    similarity_score = Column(Float)

    job_application = relationship("JobApplication", backref="selected_experiences")
    experience = relationship("Experience")

class JobApplicationSkill(Base):
    __tablename__ = "job_application_skills"
    
    job_application_id = Column(UUID(as_uuid=True), ForeignKey("job_applications.id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
    relevance_order = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job_application = relationship("JobApplication", backref="selected_skills")
    skill = relationship("Skill")