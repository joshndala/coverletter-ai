from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from firebase_admin import auth as firebase_auth
from database import get_db
from models.user import User

async def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    """Dependency to get the current user from Firebase token"""
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")
    
    token = authorization.replace("Bearer ", "")
    
    try:
        # Verify the Firebase token
        decoded_token = firebase_auth.verify_id_token(token)
        email = decoded_token.get("email")
        
        # Find user in your database
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return user
        
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")