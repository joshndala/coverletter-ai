from sqlalchemy import Column, Integer, String, Text, ARRAY, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class CoverLetter(Base):
    __tablename__ = "cover_letters"

    id = Column(Integer, primary_key=True, index=True)
    company_name = Column(String, index=True)
    hiring_manager = Column(String, nullable=True)
    job_description = Column(Text)
    generated_content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    experiences = relationship("Experience", back_populates="cover_letter")

class Experience(Base):
    __tablename__ = "experiences"

    id = Column(Integer, primary_key=True, index=True)
    cover_letter_id = Column(Integer, ForeignKey("cover_letters.id"))
    title = Column(String)
    description = Column(Text)
    skills = Column(ARRAY(String))
    duration = Column(String)
    
    cover_letter = relationship("CoverLetter", back_populates="experiences")