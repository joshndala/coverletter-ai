from sqlalchemy import Column, String, DateTime, ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class Skill(Base):
    __tablename__ = "skills"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False, unique=True)
    category = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class UserSkill(Base):
    __tablename__ = "user_skills"
    
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    skill_id = Column(UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
    proficiency_level = Column(String(20))
    years_experience = Column(Numeric(4, 1))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="skills")
    skill = relationship("Skill", backref="user_skills")