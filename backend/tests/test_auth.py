"""
Tests for authentication functionality.
"""
import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock


def test_login_success(client: TestClient, monkeypatch):
    """Test successful login."""
    # Mock the authentication service
    def mock_verify_id_token(token, app=None):
        return {"uid": "test_firebase_uid", "email": "test@example.com"}
    
    # Apply the mock
    monkeypatch.setattr("firebase_admin.auth.verify_id_token", mock_verify_id_token)
    
    # Send login request
    response = client.post(
        "/api/auth/login",
        json={"token": "test_firebase_token"}
    )
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "token_type" in data
    assert data["token_type"] == "bearer"


def test_login_invalid_token(client: TestClient, monkeypatch):
    """Test login with invalid token."""
    # Mock the authentication service to raise an exception
    def mock_verify_id_token(token, app=None):
        raise ValueError("Invalid token")
    
    # Apply the mock
    monkeypatch.setattr("firebase_admin.auth.verify_id_token", mock_verify_id_token)
    
    # Send login request
    response = client.post(
        "/api/auth/login",
        json={"token": "invalid_token"}
    )
    
    # Check response
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert "invalid" in data["detail"].lower()


def test_get_current_user_success(client: TestClient, auth_headers, monkeypatch):
    """Test getting the current authenticated user."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Get current user
    response = client.get("/api/auth/me", headers=auth_headers)
    
    # Check response
    assert response.status_code == 200
    data = response.json()
    assert data["uid"] == "test_firebase_uid"


def test_get_current_user_unauthorized(client: TestClient):
    """Test getting current user without authentication."""
    # Get current user without auth headers
    response = client.get("/api/auth/me")
    
    # Check response
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert "not authenticated" in data["detail"].lower()


def test_protected_route_with_valid_token(client: TestClient, auth_headers, monkeypatch):
    """Test accessing a protected route with a valid token."""
    # Mock the authentication middleware to return our test user
    def mock_get_current_user():
        return {"uid": "test_firebase_uid"}
    
    # Apply the mock
    monkeypatch.setattr("routers.auth.get_current_user", mock_get_current_user)
    
    # Access a protected route (experiences endpoint)
    response = client.get("/api/experiences", headers=auth_headers)
    
    # Check response
    assert response.status_code == 200


def test_protected_route_without_token(client: TestClient):
    """Test accessing a protected route without a token."""
    # Access a protected route without auth headers
    response = client.get("/api/experiences")
    
    # Check response
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert "not authenticated" in data["detail"].lower()


def test_token_validation_logic():
    """Test the token validation logic directly."""
    from datetime import datetime, timedelta
    import jwt
    from routers.auth import validate_token
    
    # Create a test token
    secret_key = "test_secret_key"
    algorithm = "HS256"
    
    # Valid token (not expired)
    payload = {
        "sub": "test_firebase_uid",
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }
    valid_token = jwt.encode(payload, secret_key, algorithm=algorithm)
    
    # Expired token
    expired_payload = {
        "sub": "test_firebase_uid",
        "exp": datetime.utcnow() - timedelta(minutes=15)
    }
    expired_token = jwt.encode(expired_payload, secret_key, algorithm=algorithm)
    
    # Test with valid token
    with patch("routers.auth.SECRET_KEY", secret_key), \
         patch("routers.auth.ALGORITHM", algorithm):
        result = validate_token(valid_token)
        assert result["uid"] == "test_firebase_uid"
    
    # Test with expired token
    with patch("routers.auth.SECRET_KEY", secret_key), \
         patch("routers.auth.ALGORITHM", algorithm), \
         pytest.raises(Exception) as excinfo:
        validate_token(expired_token)
    
    assert "token" in str(excinfo.value).lower()
    assert "expired" in str(excinfo.value).lower() or "invalid" in str(excinfo.value).lower() 