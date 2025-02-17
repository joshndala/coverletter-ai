from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class Waitlist(Base):
    __tablename__ = "waitlist"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, unique=True)
    status = Column(String(50), nullable=False, default='pending')
    invite_code = Column(UUID(as_uuid=True), default=uuid.uuid4)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    approved_at = Column(DateTime(timezone=True))

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), nullable=False, unique=True)
    firebase_uid = Column(String(128), nullable=False, unique=True)
    full_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Add relationship to current subscription
    current_subscription = relationship(
        "UserSubscription",
        primaryjoin="and_(User.id==UserSubscription.user_id, "
                   "UserSubscription.status=='active')",
        uselist=False
    )