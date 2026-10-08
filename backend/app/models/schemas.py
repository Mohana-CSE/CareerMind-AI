from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

# User Schemas
class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(..., min_length=5)
    password: str = Field(..., min_length=6)
    target_role: Optional[str] = None

class UserLogin(BaseModel):
    email: str = Field(..., min_length=5)
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    target_role: Optional[str] = None
    created_at: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Resume Schemas
class EducationItem(BaseModel):
    degree: Optional[str] = None
    institution: Optional[str] = None
    year: Optional[str] = None
    score: Optional[str] = None

class ProjectItem(BaseModel):
    title: str
    description: Optional[str] = None
    technologies: List[str] = []

class ExperienceItem(BaseModel):
    role: Optional[str] = None
    company: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None

class ResumeAnalysis(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    filename: Optional[str] = None
    skills: List[str] = []
    education: List[EducationItem] = []
    projects: List[ProjectItem] = []
    certifications: List[str] = []
    experience: List[ExperienceItem] = []
    summary: Optional[str] = None
    extracted_at: Optional[str] = None

# Target Role Schemas
class TargetRole(BaseModel):
    id: str
    title: str
    category: str
    description: str
    required_skills: List[str]
    core_technologies: List[str]
    average_salary: Optional[str] = None
    market_demand: Optional[str] = "High"

class RoleSelectionRequest(BaseModel):
    role_id: str

# Skill Gap Schemas
class SkillMatch(BaseModel):
    skill_name: str
    user_skill_matched: Optional[str] = None
    similarity_score: float = 0.0
    status: str  # "matched", "partial", "missing"
    priority: str  # "high", "medium", "low"
    category: Optional[str] = "Technical"
    reason: Optional[str] = None

class SkillGapResponse(BaseModel):
    role_title: str
    total_required: int
    matched_count: int
    missing_count: int
    match_percentage: float
    matched_skills: List[SkillMatch]
    missing_skills: List[SkillMatch]
    current_skills: List[str]
    high_priority_missing: List[str]

# Readiness Score Schemas
class ScoreBreakdown(BaseModel):
    technical_skills: int
    role_alignment: int
    dsa_problem_solving: int
    projects_portfolio: int
    certifications_prep: int

class ReadinessScoreResponse(BaseModel):
    overall_score: int
    tier: str
    breakdown: ScoreBreakdown
    strengths: List[str]
    improvement_areas: List[str]
    quick_win_recommendations: List[str]

# Roadmap Schemas
class ResourceItem(BaseModel):
    title: str
    type: str  # "documentation", "video", "course", "article"
    url: str

class PracticeTask(BaseModel):
    id: str
    title: str
    type: str  # "coding", "project", "quiz", "interview"
    difficulty: str  # "Easy", "Medium", "Hard"
    description: str
    completed: bool = False
    resources: List[ResourceItem] = []

class RoadmapMilestone(BaseModel):
    id: str
    phase_number: int
    title: str
    skill_focus: str
    priority: str  # "High", "Medium", "Low"
    description: str
    estimated_days: int
    practice_tasks: List[PracticeTask]
    completed: bool = False
    progress_percent: int = 0

class RoadmapResponse(BaseModel):
    id: str
    role_title: str
    milestones: List[RoadmapMilestone]
    total_tasks: int
    completed_tasks: int
    overall_progress: int
    last_updated: Optional[str] = None

class TaskProgressUpdate(BaseModel):
    milestone_id: str
    task_id: str
    completed: bool

# Job Opportunities Schemas
class JobOpportunity(BaseModel):
    id: str
    title: str
    company: str
    location: str
    job_type: str
    experience_level: str
    salary_range: str
    match_percentage: int
    matched_skills: List[str]
    missing_skills: List[str]
    description: str
    apply_url: str
    tags: List[str] = []
