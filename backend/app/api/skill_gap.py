from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from app.models.schemas import SkillGapResponse
from app.data.job_roles import get_role_by_id, get_all_roles
from app.services.semantic_matcher import SemanticSkillMatcher
from app.services.resume_parser import ResumeParser
from app.core.database import db_manager
from app.api.deps import get_optional_user

router = APIRouter()

@router.get("/analyze", response_model=SkillGapResponse)
def analyze_skill_gap(
    role_id: Optional[str] = Query(None, description="Role ID to analyze against"),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Performs AI semantic skill gap analysis comparing candidate's extracted skills
    against target job role requirements.
    """
    user_id = str(current_user["_id"]) if current_user else "guest-user"

    # Determine target role
    selected_role_id = role_id
    if not selected_role_id and current_user:
        selected_role_id = current_user.get("target_role")
    if not selected_role_id:
        selected_role_id = "java-fullstack"

    role = get_role_by_id(selected_role_id)
    if not role:
        all_roles = get_all_roles()
        role = all_roles[0]

    # Fetch user's current resume
    resumes_col = db_manager.get_collection("resumes")
    resume_doc = resumes_col.find_one({"user_id": user_id})

    user_skills = []
    if resume_doc and "skills" in resume_doc:
        user_skills = resume_doc["skills"]
    else:
        # Default starter skills for demonstration if no resume uploaded yet
        user_skills = [
            "Java", "JavaScript", "SQL", "React",
            "RESTful services using Spring Framework", "Git", "HTML5 & CSS3"
        ]

    analysis = SemanticSkillMatcher.analyze_skill_gap(
        user_skills=user_skills,
        required_skills=role["required_skills"],
        role_title=role["title"]
    )

    # Cache analysis in db
    skill_gaps_col = db_manager.get_collection("skill_gaps")
    analysis_doc = dict(analysis)
    analysis_doc["user_id"] = user_id
    analysis_doc["role_id"] = role["id"]
    skill_gaps_col.update_one({"user_id": user_id, "role_id": role["id"]}, {"$set": analysis_doc}, upsert=True)

    return analysis
