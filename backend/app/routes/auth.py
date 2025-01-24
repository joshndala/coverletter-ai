# This file contains the routes for the authentication process.
from fastapi import APIRouter, Depends, HTTPException
from starlette.responses import RedirectResponse
from app.auth import oauth, get_current_user

router = APIRouter()

@router.get("/login/google")
async def google_login():
   return await oauth.google.authorize_redirect(
       redirect_uri="http://localhost:8000/auth/callback"
   )

@router.get("/auth/callback")
async def auth_callback():
   token = await oauth.google.authorize_access_token()
   user_info = await oauth.google.parse_id_token(token)
   # Store token securely and return it to frontend
   return {"token": token["id_token"]}

@router.get("/me")
async def read_users_me(current_user = Depends(get_current_user)):
   return current_user