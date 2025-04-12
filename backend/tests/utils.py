"""
Utility functions for testing.
"""
import json
from typing import Dict, Any, Optional, List
from fastapi.testclient import TestClient
import uuid


def create_experience(
    client: TestClient,
    auth_headers: Dict[str, str],
    experience_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Create an experience using the API and return the created experience data.
    """
    response = client.post(
        "/api/experiences",
        headers=auth_headers,
        json=experience_data
    )
    
    if response.status_code != 201:
        raise Exception(f"Failed to create experience: {response.text}")
    
    return response.json()


def get_experiences(
    client: TestClient,
    auth_headers: Dict[str, str]
) -> List[Dict[str, Any]]:
    """
    Get all experiences for the authenticated user.
    """
    response = client.get(
        "/api/experiences",
        headers=auth_headers
    )
    
    if response.status_code != 200:
        raise Exception(f"Failed to get experiences: {response.text}")
    
    return response.json()


def get_experience(
    client: TestClient,
    auth_headers: Dict[str, str],
    experience_id: uuid.UUID
) -> Dict[str, Any]:
    """
    Get a specific experience by ID.
    """
    response = client.get(
        f"/api/experiences/{experience_id}",
        headers=auth_headers
    )
    
    if response.status_code != 200:
        raise Exception(f"Failed to get experience: {response.text}")
    
    return response.json()


def update_experience(
    client: TestClient,
    auth_headers: Dict[str, str],
    experience_id: uuid.UUID,
    update_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Update an experience by ID.
    """
    response = client.put(
        f"/api/experiences/{experience_id}",
        headers=auth_headers,
        json=update_data
    )
    
    if response.status_code != 200:
        raise Exception(f"Failed to update experience: {response.text}")
    
    return response.json()


def delete_experience(
    client: TestClient,
    auth_headers: Dict[str, str],
    experience_id: uuid.UUID
) -> None:
    """
    Delete an experience by ID.
    """
    response = client.delete(
        f"/api/experiences/{experience_id}",
        headers=auth_headers
    )
    
    if response.status_code != 204:
        raise Exception(f"Failed to delete experience: {response.text}") 