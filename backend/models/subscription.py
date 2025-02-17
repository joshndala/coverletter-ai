from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Integer, Numeric
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
from database import Base

class SubscriptionTier(Base):
    __tablename__ = "subscription_tiers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), nullable=False, unique=True)  #"Free", "Premium"
    price = Column(Numeric(10, 2), nullable=False)  # Monthly price
    features = Column(String(255), nullable=False)  # Feature list or limitations
    max_cover_letters = Column(Integer, nullable=False)  # Monthly limit
    is_active = Column(Boolean, default=True)  # To disable tiers without deleting
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

class UserSubscription(Base):
    __tablename__ = "user_subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tier_id = Column(UUID(as_uuid=True), ForeignKey("subscription_tiers.id"), nullable=False)
    status = Column(String(50), nullable=False, default='active')  # active, cancelled, expired
    start_date = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    end_date = Column(DateTime(timezone=True))  # For fixed-term subscriptions
    is_auto_renewal = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    user = relationship("User", backref="subscriptions")
    tier = relationship("SubscriptionTier")

class UserUsage(Base):
    __tablename__ = "user_usage"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    cover_letters_generated = Column(Integer, default=0)  # Monthly count
    usage_period = Column(DateTime(timezone=True), nullable=False)  # Start of the month
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", backref="usage_records")