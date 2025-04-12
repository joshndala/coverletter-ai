"""
Tests for the skills API endpoints.
"""
import pytest
import uuid
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from . import utils


def test_get_skills_empty(client: TestClient, auth_headers, monkeypatch):
    """Test getting skills when there are none."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Get skills
    response = client.get("/api/skills", headers=auth_headers)
    
    # Check response
    assert response.status_code == 200
    assert response.json() == []


def test_create_skill(client: TestClient, auth_headers, monkeypatch):
    """Test creating a new skill."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create skill data
    skill_data = {
        "name": "Python",
        "level": 5
    }
    
    # Create skill
    response = client.post(
        "/api/skills", 
        headers=auth_headers, 
        json=skill_data
    )
    
    # Check response
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == skill_data["name"]
    assert data["level"] == skill_data["level"]
    assert "id" in data


def test_get_skills(client: TestClient, auth_headers, monkeypatch):
    """Test getting skills after creating some."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create multiple skills
    skill_data_list = [
        {"name": "Python", "level": 5},
        {"name": "FastAPI", "level": 4},
        {"name": "SQLAlchemy", "level": 3}
    ]
    
    created_skills = []
    for skill_data in skill_data_list:
        response = client.post("/api/skills", headers=auth_headers, json=skill_data)
        assert response.status_code == 201
        created_skills.append(response.json())
    
    # Get skills
    response = client.get("/api/skills", headers=auth_headers)
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert len(data) == len(skill_data_list)
    
    # Verify all skills are returned
    skill_names = [skill["name"] for skill in data]
    for skill_data in skill_data_list:
        assert skill_data["name"] in skill_names


def test_get_skill_by_id(client: TestClient, auth_headers, monkeypatch):
    """Test getting a specific skill by ID."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create skill data
    skill_data = {
        "name": "Python",
        "level": 5
    }
    
    # Create skill
    response = client.post("/api/skills", headers=auth_headers, json=skill_data)
    assert response.status_code == 201
    created_skill = response.json()
    
    # Get skill by ID
    skill_id = created_skill["id"]
    response = client.get(f"/api/skills/{skill_id}", headers=auth_headers)
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == created_skill["id"]
    assert data["name"] == skill_data["name"]
    assert data["level"] == skill_data["level"]


def test_update_skill(client: TestClient, auth_headers, monkeypatch):
    """Test updating a skill."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create skill data
    skill_data = {
        "name": "Original Skill",
        "level": 3
    }
    
    # Create skill
    response = client.post("/api/skills", headers=auth_headers, json=skill_data)
    assert response.status_code == 201
    created_skill = response.json()
    
    # Update data
    update_data = {
        "name": "Updated Skill",
        "level": 4
    }
    
    # Update skill
    skill_id = created_skill["id"]
    response = client.put(
        f"/api/skills/{skill_id}", 
        headers=auth_headers, 
        json=update_data
    )
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == update_data["name"]
    assert data["level"] == update_data["level"]
    assert data["id"] == created_skill["id"]


def test_delete_skill(client: TestClient, auth_headers, monkeypatch):
    """Test deleting a skill."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Create skill data
    skill_data = {
        "name": "Skill to Delete",
        "level": 2
    }
    
    # Create skill
    response = client.post("/api/skills", headers=auth_headers, json=skill_data)
    assert response.status_code == 201
    created_skill = response.json()
    
    # Delete skill
    skill_id = created_skill["id"]
    response = client.delete(f"/api/skills/{skill_id}", headers=auth_headers)
    
    # Check response
    assert response.status_code == 204
    
    # Verify it's deleted by trying to get it
    response = client.get(f"/api/skills/{skill_id}", headers=auth_headers)
    assert response.status_code == 404


def test_get_nonexistent_skill(client: TestClient, auth_headers, monkeypatch):
    """Test getting a non-existent skill by ID."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Generate a random ID that doesn't exist
    nonexistent_id = uuid.uuid4()
    
    # Try to get it
    response = client.get(f"/api/skills/{nonexistent_id}", headers=auth_headers)
    
    # Check response
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_skill_validation(client: TestClient, auth_headers, monkeypatch):
    """Test validation for skill creation."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Test invalid level (outside range 1-5)
    invalid_skill_data = {
        "name": "Python",
        "level": 6  # invalid level
    }
    
    response = client.post(
        "/api/skills",
        headers=auth_headers,
        json=invalid_skill_data
    )
    
    assert response.status_code == 422  # Validation error
    
    # Test missing name
    missing_name_data = {
        "level": 3
    }
    
    response = client.post(
        "/api/skills",
        headers=auth_headers,
        json=missing_name_data
    )
    
    assert response.status_code == 422  # Validation error 