from datetime import datetime, timedelta
from typing import Optional
from passlib.context import CryptContext
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from models.auth import User
import os
from dotenv import load_dotenv
import logging

# Import Firebase for authentication
from utils.firebase import firebase_auth

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Password hashing for local accounts (if needed)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def verify_firebase_token(token: str):
    """Verify Firebase ID token and return user info"""
    try:
        logger.info("Verifying Firebase token")
        # Verify the Firebase token
        decoded_token = firebase_auth.verify_id_token(token)
        logger.info(f"Token verified successfully for user: {decoded_token.get('email')}")
        return decoded_token
    except Exception as e:
        logger.error(f"Firebase token verification failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid Firebase token: {str(e)}"
        )

async def get_or_create_user_from_firebase(db: Session, token: str):
    """Get or create user from Firebase token"""
    try:
        logger.info("Processing user from Firebase token")
        # Verify the token
        decoded_token = await verify_firebase_token(token)
        
        # Extract user info
        firebase_uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        display_name = decoded_token.get("name", "")
        
        logger.info(f"Firebase UID: {firebase_uid}, Email: {email}")
        
        if not firebase_uid or not email:
            logger.error("Missing user information in token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user information"
            )
        
        # Find user by firebase_uid
        user = db.query(User).filter(User.firebase_uid == firebase_uid).first()
        
        # If not found by firebase_uid, try by email
        if not user:
            logger.info(f"User not found by firebase_uid, searching by email: {email}")
            user = db.query(User).filter(User.email == email).first()
            
            # If found by email but firebase_uid doesn't match, update it
            if user and user.firebase_uid != firebase_uid:
                logger.info(f"Updating firebase_uid for existing user: {email}")
                user.firebase_uid = firebase_uid
                db.commit()
        
        # If user still not found, create a new one
        if not user:
            logger.info(f"Creating new user with email: {email}")
            import uuid
            user = User(
                id=uuid.uuid4(),
                email=email,
                firebase_uid=firebase_uid,
                full_name=display_name,
                is_active=True
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info(f"New user created successfully: {email}")
        else:
            logger.info(f"Existing user found: {email}")
        
        return user
    except Exception as e:
        logger.error(f"Error in get_or_create_user_from_firebase: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}"
        )