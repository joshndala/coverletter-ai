import pytest
import os
import sys
from typing import Generator, Dict
import uuid
from fastapi import FastAPI, Depends
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from datetime import date

# Add the parent directory to the Python path so we can import from the backend modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base, get_db
from main import app
from models.experience import Experience
from models.skills import Skill
from models.auth import User
from routers.auth import get_current_user

# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

# Create a test engine with StaticPool to ensure connections are reused
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

# Create a test session factory
TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db() -> Generator[Session, None, None]:
    """
    Create a fresh database for each test function.
    """
    # Create all tables in the database
    Base.metadata.create_all(bind=engine)
    
    # Create a test session
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
        
    # Drop all tables after the test (ensures a clean state for next test)
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db: Session) -> Generator[TestClient, None, None]:
    """
    Create a test client with a database dependency override.
    """
    # Override the get_db dependency
    def _get_test_db():
        try:
            yield db
        finally:
            pass

    # Replace the get_db dependency with our test db
    app.dependency_overrides[get_db] = _get_test_db
    
    # Override the get_current_user dependency with a UUID
    app.dependency_overrides[get_current_user] = lambda: {"uid": uuid.uuid4()}
    
    # Create a test client
    with TestClient(app) as client:
        yield client
    
    # Remove the overrides after the test
    app.dependency_overrides.clear()


@pytest.fixture(scope="function")
def test_user(db: Session) -> Dict:
    """
    Create a test user and return its data.
    """
    user_id = uuid.uuid4()
    user = User(
        id=user_id,
        email="test@example.com",
        firebase_uid="test_firebase_uid",
        full_name="Test User",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return {
        "id": user_id,
        "email": "test@example.com",
        "firebase_uid": "test_firebase_uid",
        "full_name": "Test User"
    }


@pytest.fixture(scope="function")
def auth_headers() -> Dict[str, str]:
    """
    Create mock auth headers for testing authenticated endpoints.
    Note: This does not actually authenticate with Firebase.
    It creates a mock token that our test environment will accept.
    """
    return {"Authorization": "Bearer test_token"}


@pytest.fixture(scope="function")
def test_experience(db: Session, test_user: Dict) -> Dict:
    """
    Create a test experience and return its data.
    """
    experience_id = uuid.uuid4()
    
    # Create a test skill
    skill = Skill(id=uuid.uuid4(), name="Test Skill")
    db.add(skill)
    db.flush()
    
    # Create the experience
    experience = Experience(
        id=experience_id,
        user_id=test_user["id"],
        company_name="Test Company",
        title="Test Position",
        location="Test Location",
        start_date=date(2023, 1, 1),  # Use date object instead of string
        end_date=None,
        is_current=True,
        description="Test description",
        content_for_embedding="Test Company Test Position Test Location Test description"
    )
    db.add(experience)
    db.commit()
    db.refresh(experience)
    
    return {
        "id": experience_id,
        "company_name": "Test Company",
        "title": "Test Position",
        "location": "Test Location",
        "start_date": "2023-01-01",
        "is_current": True,
        "description": "Test description",
        "skills": [skill.name]
    } 