from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime
import uuid
from app.models.schemas import UserRegister, UserLogin, UserResponse, TokenResponse
from app.core.security import get_password_hash, verify_password, create_access_token
from app.core.database import db_manager
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(user_in: UserRegister):
    users_col = db_manager.get_collection("users")
    
    # Check if email already registered
    existing_user = users_col.find_one({"email": user_in.email.lower()})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "name": user_in.name.strip(),
        "email": user_in.email.lower(),
        "hashed_password": get_password_hash(user_in.password),
        "target_role": user_in.target_role or "java-fullstack",
        "created_at": datetime.utcnow().isoformat()
    }
    users_col.insert_one(user_doc)

    token = create_access_token({"sub": user_id, "email": user_doc["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_doc["name"],
            "email": user_doc["email"],
            "target_role": user_doc["target_role"],
            "created_at": user_doc["created_at"]
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(user_in: UserLogin):
    users_col = db_manager.get_collection("users")
    user_doc = users_col.find_one({"email": user_in.email.lower()})
    
    if not user_doc or not verify_password(user_in.password, user_doc.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )

    user_id = str(user_doc["_id"])
    token = create_access_token({"sub": user_id, "email": user_doc["email"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user_id,
            "name": user_doc["name"],
            "email": user_doc["email"],
            "target_role": user_doc.get("target_role", "java-fullstack"),
            "created_at": user_doc.get("created_at")
        }
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: dict = Depends(get_current_user)):
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "target_role": user.get("target_role", "java-fullstack"),
        "created_at": user.get("created_at")
    }
