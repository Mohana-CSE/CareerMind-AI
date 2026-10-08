from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional
from app.models.schemas import RoadmapResponse, TaskProgressUpdate
from app.data.job_roles import get_role_by_id, get_all_roles
from app.services.semantic_matcher import SemanticSkillMatcher
from app.services.roadmap_generator import AdaptiveRoadmapGenerator
from app.core.database import db_manager
from app.api.deps import get_optional_user

router = APIRouter()

@router.get("/current", response_model=RoadmapResponse)
def get_current_roadmap(
    role_id: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Retrieves or generates the user's adaptive learning roadmap."""
    user_id = str(current_user["_id"]) if current_user else "guest-user"

    selected_role_id = role_id
    if not selected_role_id and current_user:
        selected_role_id = current_user.get("target_role")
    if not selected_role_id:
        selected_role_id = "java-fullstack"

    role = get_role_by_id(selected_role_id)
    if not role:
        role = get_all_roles()[0]

    roadmaps_col = db_manager.get_collection("roadmaps")
    existing_roadmap = roadmaps_col.find_one({"user_id": user_id, "role_title": role["title"]})

    if existing_roadmap:
        # Convert _id to id
        existing_roadmap["id"] = str(existing_roadmap.get("_id", existing_roadmap.get("id", "")))
        return existing_roadmap

    # Otherwise generate a fresh adaptive roadmap
    resumes_col = db_manager.get_collection("resumes")
    resume_doc = resumes_col.find_one({"user_id": user_id})
    user_skills = resume_doc.get("skills", []) if resume_doc else ["Java", "JavaScript", "SQL", "React"]

    skill_gap_data = SemanticSkillMatcher.analyze_skill_gap(
        user_skills=user_skills,
        required_skills=role["required_skills"],
        role_title=role["title"]
    )

    roadmap_data = AdaptiveRoadmapGenerator.generate_roadmap(
        user_skills=user_skills,
        missing_skills_info=skill_gap_data["missing_skills"],
        role_title=role["title"]
    )
    roadmap_data["user_id"] = user_id
    roadmaps_col.update_one(
        {"user_id": user_id, "role_title": role["title"]},
        {"$set": roadmap_data},
        upsert=True
    )
    return roadmap_data

@router.post("/task-progress", response_model=RoadmapResponse)
def update_task_progress(
    update: TaskProgressUpdate,
    role_id: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Updates completion status of a specific practice task in the roadmap.
    Adaptively recalculates milestone and overall progress.
    """
    user_id = str(current_user["_id"]) if current_user else "guest-user"

    selected_role_id = role_id or (current_user.get("target_role") if current_user else None) or "java-fullstack"
    role = get_role_by_id(selected_role_id) or get_all_roles()[0]

    roadmaps_col = db_manager.get_collection("roadmaps")
    roadmap = roadmaps_col.find_one({"user_id": user_id, "role_title": role["title"]})

    if not roadmap:
        # Generate initial roadmap first
        roadmap = get_current_roadmap(selected_role_id, current_user)

    updated_roadmap = AdaptiveRoadmapGenerator.update_task_progress(
        roadmap=roadmap,
        milestone_id=update.milestone_id,
        task_id=update.task_id,
        completed=update.completed
    )

    roadmaps_col.update_one(
        {"user_id": user_id, "role_title": role["title"]},
        {"$set": updated_roadmap},
        upsert=True
    )
    updated_roadmap["id"] = str(updated_roadmap.get("_id", updated_roadmap.get("id", "")))
    return updated_roadmap

@router.post("/regenerate", response_model=RoadmapResponse)
def regenerate_adaptive_roadmap(
    role_id: Optional[str] = Query(None),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """Forces regeneration of the adaptive roadmap with latest resume profile skills."""
    user_id = str(current_user["_id"]) if current_user else "guest-user"
    selected_role_id = role_id or (current_user.get("target_role") if current_user else None) or "java-fullstack"
    role = get_role_by_id(selected_role_id) or get_all_roles()[0]

    resumes_col = db_manager.get_collection("resumes")
    resume_doc = resumes_col.find_one({"user_id": user_id})
    user_skills = resume_doc.get("skills", []) if resume_doc else ["Java", "JavaScript", "SQL", "React"]

    skill_gap_data = SemanticSkillMatcher.analyze_skill_gap(
        user_skills=user_skills,
        required_skills=role["required_skills"],
        role_title=role["title"]
    )

    roadmap_data = AdaptiveRoadmapGenerator.generate_roadmap(
        user_skills=user_skills,
        missing_skills_info=skill_gap_data["missing_skills"],
        role_title=role["title"]
    )
    roadmap_data["user_id"] = user_id

    roadmaps_col = db_manager.get_collection("roadmaps")
    roadmaps_col.update_one(
        {"user_id": user_id, "role_title": role["title"]},
        {"$set": roadmap_data},
        upsert=True
    )
    return roadmap_data
