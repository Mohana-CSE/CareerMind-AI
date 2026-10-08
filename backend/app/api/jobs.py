from fastapi import APIRouter, Depends, Query
from typing import List, Optional
from app.models.schemas import JobOpportunity
from app.data.job_listings import get_jobs_for_role, SEED_JOB_OPPORTUNITIES
from app.services.semantic_matcher import SemanticSkillMatcher
from app.core.database import db_manager
from app.api.deps import get_optional_user

router = APIRouter()

@router.get("/matched", response_model=List[JobOpportunity])
def get_matched_jobs(
    role_id: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Returns real job openings matching candidate's profile,
    showing match percentage and missing requirements for each job.
    """
    user_id = str(current_user["_id"]) if current_user else "guest-user"

    # Fetch user resume skills
    resumes_col = db_manager.get_collection("resumes")
    resume_doc = resumes_col.find_one({"user_id": user_id})
    user_skills = resume_doc.get("skills", []) if resume_doc else [
        "Java", "JavaScript", "SQL", "React", "RESTful services using Spring Framework", "Git"
    ]

    selected_role_id = role_id or (current_user.get("target_role") if current_user else None)
    
    # Retrieve relevant jobs
    candidate_jobs = get_jobs_for_role(selected_role_id)
    if not candidate_jobs or len(candidate_jobs) < 3:
        # Include full catalogue if role filter is too narrow
        candidate_jobs = SEED_JOB_OPPORTUNITIES

    results = []
    for job in candidate_jobs:
        req_skills = job["required_skills"]
        matched_in_job = []
        missing_in_job = []

        for req in req_skills:
            has_match = False
            for u_skill in user_skills:
                score, _ = SemanticSkillMatcher.compute_similarity(u_skill, req)
                if score >= 0.65:
                    has_match = True
                    break
            if has_match:
                matched_in_job.append(req)
            else:
                missing_in_job.append(req)

        match_pct = round((len(matched_in_job) / len(req_skills) * 100)) if req_skills else 100

        results.append({
            "id": job["id"],
            "title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "job_type": job["job_type"],
            "experience_level": job["experience_level"],
            "salary_range": job["salary_range"],
            "match_percentage": match_pct,
            "matched_skills": matched_in_job,
            "missing_skills": missing_in_job,
            "description": job["description"],
            "apply_url": job["apply_url"],
            "tags": job.get("tags", [])
        })

    # Sort by highest match percentage first
    results.sort(key=lambda j: j["match_percentage"], reverse=True)
    return results
