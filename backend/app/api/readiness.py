from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from app.models.schemas import ReadinessScoreResponse
from app.data.job_roles import get_role_by_id, get_all_roles
from app.services.semantic_matcher import SemanticSkillMatcher
from app.services.readiness_scorer import CareerReadinessScorer
from app.core.database import db_manager
from app.api.deps import get_optional_user

router = APIRouter()

@router.get("/score", response_model=ReadinessScoreResponse)
def get_readiness_score(
    role_id: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Computes holistic Career Readiness Score across 5 evaluation dimensions:
    Role Alignment, Technical Skills, DSA / Problem Solving, Projects, and Certifications.
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
        role = get_all_roles()[0]

    # Fetch user resume
    resumes_col = db_manager.get_collection("resumes")
    resume_doc = resumes_col.find_one({"user_id": user_id})
    if not resume_doc:
        resume_doc = {
            "skills": ["Java", "JavaScript", "SQL", "React", "RESTful services using Spring Framework", "Git"],
            "projects": [
                {"title": "E-Commerce Microservices", "technologies": ["Spring Boot", "MySQL", "React"]},
                {"title": "Realtime Chat App", "technologies": ["Node.js", "WebSocket"]}
            ],
            "certifications": ["HackerRank Problem Solving (Gold)"],
            "education": [{"degree": "B.Tech Computer Science", "institution": "University", "year": "2024"}]
        }

    # Analyze skill gap
    skill_gap_data = SemanticSkillMatcher.analyze_skill_gap(
        user_skills=resume_doc.get("skills", []),
        required_skills=role["required_skills"],
        role_title=role["title"]
    )

    score_result = CareerReadinessScorer.calculate_score(resume_doc, skill_gap_data)
    return score_result
