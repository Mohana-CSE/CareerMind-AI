from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from app.models.schemas import TargetRole, RoleSelectionRequest
from app.data.job_roles import get_all_roles, get_role_by_id
from app.core.database import db_manager
from app.api.deps import get_optional_user

router = APIRouter()

@router.get("/", response_model=List[TargetRole])
def list_target_roles():
    """Retrieve catalog of target engineering roles."""
    return get_all_roles()

@router.get("/{role_id}", response_model=TargetRole)
def get_role_details(role_id: str):
    """Retrieve details and skill requirements for a specific target role."""
    role = get_role_by_id(role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Target job role not found.")
    return role

@router.post("/select")
def select_target_role(
    payload: RoleSelectionRequest,
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Update user's selected target job role."""
    role = get_role_by_id(payload.role_id)
    if not role:
        raise HTTPException(status_code=404, detail="Target job role not found.")

    user_id = str(current_user["_id"]) if current_user else "guest-user"
    users_col = db_manager.get_collection("users")
    users_col.update_one({"_id": user_id}, {"$set": {"target_role": payload.role_id}}, upsert=True)

    return {
        "message": f"Successfully set target role to '{role['title']}'",
        "selected_role": role
    }
