from fastapi import APIRouter, HTTPException, Depends, Header, Body, Request, status
from sqlalchemy.orm import Session
from database import get_db
from models.auth import User
from services.auth_service import get_or_create_user_from_firebase
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["Authentication"])

# Quick debugging route (temporary)
@router.get("/debug-db-connection")
async def debug_db(db: Session = Depends(get_db)):
    try:
        result = db.execute("SELECT 1").scalar()
        return {"db_connected": result == 1}
    except Exception as e:
        return {"db_connected": False, "error": str(e)}


@router.get("/me")
async def get_current_user(request: Request, db: Session = Depends(get_db)):
    """Get current authenticated user"""
    logger.info("Me endpoint called")
    try:
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.error("Missing or invalid Authorization header")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Missing or invalid token"
            )
        
        token = auth_header.split(' ')[1]
        logger.info(f"Token received: {token[:10]}...")  # Log first few chars for debugging
        
        # Process the token and get user
        user = await get_or_create_user_from_firebase(db, token)
        
        # Return user data
        user_data = {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active
        }
        logger.info(f"Current user data retrieved: {user.email}")
        return user_data
        
    except Exception as e:
        logger.error(f"Error in me endpoint: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get user data: {str(e)}"
        )

@router.post("/register")
async def register_user(request: Request, db: Session = Depends(get_db)):
    """Register or authenticate a user with Firebase token"""
    logger.info("Register endpoint called")
    try:
        # Get token from header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.error("Missing or invalid Authorization header")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Missing or invalid token"
            )
        
        token = auth_header.split(' ')[1]
        logger.info(f"Token received: {token[:10]}...")  # Log first few chars for debugging
        
        # Additional data from request body
        body = await request.json()
        logger.info(f"Request body: {body}")
        
        # Process the token and create/get user
        user = await get_or_create_user_from_firebase(db, token)
        
        # Update user with additional data if provided
        if body and isinstance(body, dict):
            if 'full_name' in body and body['full_name']:
                logger.info(f"Updating full name for user: {user.email}")
                user.full_name = body['full_name']
                db.commit()
                db.refresh(user)
        
        # Return user data
        user_data = {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "is_active": user.is_active
        }
        logger.info(f"User registered/authenticated successfully: {user.email}")
        return user_data
        
    except Exception as e:
        logger.error(f"Error in register endpoint: {str(e)}")
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed: {str(e)}"
        )