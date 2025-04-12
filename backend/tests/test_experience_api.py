"""
Tests for the experience API endpoints.
"""
import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from datetime import date

# Add the parent directory to the Python path so we can import from the backend modules
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app
from routers.auth import get_current_user
from . import utils


def test_get_experiences_empty(client: TestClient, auth_headers, monkeypatch, test_user):
    """Test getting experiences when none exist."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": test_user["id"]}  # Use UUID from test_user
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Get experiences
    response = client.get("/api/experiences", headers=auth_headers)
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 0


def test_create_experience(client: TestClient, auth_headers, monkeypatch, test_user):
    """Test creating a new experience."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": test_user["id"]}  # Use UUID from test_user
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create experience data
    experience_data = {
        "company_name": "Test Company",
        "title": "Software Engineer",
        "location": "Remote",
        "start_date": "2023-01-01",
        "end_date": None,
        "is_current": True,
        "description": "Developing software applications"
    }
    
    # Create experience
    response = client.post(
        "/api/experiences", 
        headers=auth_headers, 
        json=experience_data
    )
    
    # Check response
    assert response.status_code == 201
    data = response.json()
    assert data["company_name"] == experience_data["company_name"]
    assert data["title"] == experience_data["title"]
    assert data["location"] == experience_data["location"]
    assert data["start_date"] == experience_data["start_date"]
    assert data["is_current"] == experience_data["is_current"]
    assert data["description"] == experience_data["description"]


def test_get_experiences(client: TestClient, auth_headers, monkeypatch, test_user, db: Session):
    """Test getting experiences after creating one."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": test_user["id"]}  # Use UUID from test_user
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create experience data
    experience_data = {
        "company_name": "Test Company",
        "title": "Software Engineer",
        "location": "Remote",
        "start_date": "2023-01-01",
        "end_date": None,
        "is_current": True,
        "description": "Developing software applications"
    }
    
    # Create experience
    created_experience = utils.create_experience(client, auth_headers, experience_data)
    
    # Get experiences
    response = client.get("/api/experiences", headers=auth_headers)
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == created_experience["id"]


def test_get_experience_by_id(client: TestClient, auth_headers, monkeypatch, test_user):
    """Test getting a specific experience by ID."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": test_user["id"]}  # Use UUID from test_user
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create experience data
    experience_data = {
        "company_name": "Test Company",
        "title": "Software Engineer",
        "location": "Remote",
        "start_date": "2023-01-01",
        "end_date": None,
        "is_current": True,
        "description": "Developing software applications"
    }
    
    # Create experience
    created_experience = utils.create_experience(client, auth_headers, experience_data)
    
    # Get experience by ID
    experience_id = created_experience["id"]
    response = client.get(f"/api/experiences/{experience_id}", headers=auth_headers)
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == experience_id


def test_update_experience(client: TestClient, auth_headers, monkeypatch, test_user):
    """Test updating an experience."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": test_user["id"]}  # Use UUID from test_user
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create experience data
    experience_data = {
        "company_name": "Original Company",
        "title": "Original Title",
        "location": "Original Location",
        "start_date": "2023-01-01",
        "end_date": None,
        "is_current": True,
        "description": "Original description"
    }
    
    # Create experience
    created_experience = utils.create_experience(client, auth_headers, experience_data)
    
    # Update data
    update_data = {
        "company_name": "Updated Company",
        "title": "Updated Title"
    }
    
    # Update experience
    experience_id = created_experience["id"]
    response = client.put(
        f"/api/experiences/{experience_id}", 
        headers=auth_headers, 
        json=update_data
    )
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["company_name"] == update_data["company_name"]
    assert data["title"] == update_data["title"]
    assert data["location"] == experience_data["location"]  # Unchanged field


def test_delete_experience(client: TestClient, auth_headers, monkeypatch, test_user):
    """Test deleting an experience."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": test_user["id"]}  # Use UUID from test_user
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create experience data
    experience_data = {
        "company_name": "Test Company",
        "title": "Software Engineer",
        "location": "Remote",
        "start_date": "2023-01-01",
        "end_date": None,
        "is_current": True,
        "description": "Developing software applications"
    }
    
    # Create experience
    created_experience = utils.create_experience(client, auth_headers, experience_data)
    
    # Delete experience
    experience_id = created_experience["id"]
    response = client.delete(f"/api/experiences/{experience_id}", headers=auth_headers)
    
    # Check response
    assert response.status_code == 204
    
    # Verify experience is deleted
    response = client.get(f"/api/experiences/{experience_id}", headers=auth_headers)
    assert response.status_code == 404


def test_get_nonexistent_experience(client: TestClient, auth_headers, monkeypatch, test_user):
    """Test getting a nonexistent experience."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": test_user["id"]}  # Use UUID from test_user
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Try to get a nonexistent experience
    response = client.get(
        "/api/experiences/00000000-0000-0000-0000-000000000000",
        headers=auth_headers
    )
    
    # Check response
    assert response.status_code == 404 