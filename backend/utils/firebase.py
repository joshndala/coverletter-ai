import os
import firebase_admin
from firebase_admin import credentials, firestore, auth
from config.settings import settings

# Initialize Firebase Admin SDK only once for the entire application
# The service account requires a JSON file, not client-side config
try:
    # Check if already initialized
    firebase_app = firebase_admin.get_app()
except ValueError:
    # If not initialized, initialize with service account
    cred = credentials.Certificate(settings.FIREBASE_SERVICE_ACCOUNT_PATH)
    firebase_app = firebase_admin.initialize_app(cred)

# Create clients to use in other modules
firestore_db = firestore.client()
firebase_auth = auth

# Export the initialized app and clients