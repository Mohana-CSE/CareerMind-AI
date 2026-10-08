from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import decode_access_token
from app.core.database import db_manager

security_scheme = HTTPBearer(auto_error=False)

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    """Extracts authenticated user from Bearer JWT token."""
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials are required.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload invalid.",
        )
    
    users_col = db_manager.get_collection("users")
    user = users_col.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found.",
        )
    return user

def get_optional_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    """Extracts authenticated user if token present, or returns None."""
    if not credentials:
        return None
    try:
        token = credentials.credentials
        payload = decode_access_token(token)
        if not payload:
            return None
        user_id = payload.get("sub")
        users_col = db_manager.get_collection("users")
        return users_col.find_one({"_id": user_id})
    except Exception:
        return None
