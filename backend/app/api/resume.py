from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from typing import Optional, List
from datetime import datetime
import uuid
from pydantic import BaseModel
from app.models.schemas import ResumeAnalysis
from app.services.resume_parser import ResumeParser
from app.services.ai_service import AIService
from app.core.database import db_manager
from app.api.deps import get_current_user, get_optional_user

router = APIRouter()

class ManualResumeInput(BaseModel):
    raw_text: str
    target_role: Optional[str] = None

@router.post("/upload", response_model=ResumeAnalysis)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: Optional[dict] = Depends(get_optional_user)
):
    """
    Upload and parse PDF or text resume.
    Extracts skills, education, projects, certifications, and experience.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file was selected.")
    
    filename_lower = file.filename.lower()
    if not (filename_lower.endswith(".pdf") or filename_lower.endswith(".txt")):
        raise HTTPException(
            status_code=400,
            detail="Unsupported file format. Please upload a PDF (.pdf) or text (.txt) document."
        )

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="The uploaded resume file is empty.")

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds the 10MB limit.")

    try:
        if filename_lower.endswith(".pdf"):
            raw_text = ResumeParser.extract_text_from_pdf(content)
        else:
            raw_text = content.decode("utf-8", errors="ignore")
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

    # Extract sections
    extracted_skills = ResumeParser.extract_skills_from_text(raw_text)
    education = ResumeParser.extract_education(raw_text)
    projects = ResumeParser.extract_projects(raw_text, extracted_skills)
    certifications = ResumeParser.extract_certifications(raw_text)
    experience = ResumeParser.extract_experience(raw_text)

    # Optional AI enhancement
    enhanced = AIService.enhance_resume_extraction(raw_text, extracted_skills)
    final_skills = enhanced.get("skills", extracted_skills)

    user_id = str(current_user["_id"]) if current_user else "guest-user"

    resume_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "filename": file.filename,
        "skills": final_skills,
        "education": education,
        "projects": projects,
        "certifications": certifications,
        "experience": experience,
        "summary": enhanced.get("summary", "Resume processed successfully."),
        "raw_text_preview": raw_text[:500],
        "extracted_at": datetime.utcnow().isoformat()
    }

    resumes_col = db_manager.get_collection("resumes")
    # Replace existing or insert
    resumes_col.update_one({"user_id": user_id}, {"$set": resume_doc}, upsert=True)

    return {
        "id": resume_doc["_id"],
        "user_id": user_id,
        "filename": resume_doc["filename"],
        "skills": resume_doc["skills"],
        "education": resume_doc["education"],
        "projects": resume_doc["projects"],
        "certifications": resume_doc["certifications"],
        "experience": resume_doc["experience"],
        "summary": resume_doc["summary"],
        "extracted_at": resume_doc["extracted_at"]
    }

@router.post("/sample-demo", response_model=ResumeAnalysis)
def load_sample_demo_resume(current_user: Optional[dict] = Depends(get_optional_user)):
    """Provides a realistic sample student resume for quick hackathon/live evaluation testing."""
    sample_text = """
    Rahul Sharma - Computer Science Undergraduate
    Email: rahul.sharma@example.com | Bengaluru, India
    
    TECHNICAL SKILLS:
    Languages: Java, JavaScript, Python, SQL, HTML5, CSS3
    Frameworks & Tools: React.js, RESTful services using Spring Framework, Git, Node.js basics, Tailwind CSS
    Databases: MySQL, PostgreSQL
    Concepts: Object-Oriented Programming (OOP), Data Structures and Algorithms, Database Management
    
    EDUCATION:
    Bachelor of Technology in Computer Science and Engineering
    Vellore Institute of Technology, 2021 - 2025 | CGPA: 8.4/10
    
    ACADEMIC PROJECTS:
    1. E-Commerce Order Portal:
       Designed modular microservices and RESTful services using Spring Framework with MySQL database backend.
       Built dynamic responsive customer catalog using React.js and Tailwind CSS.
    2. Real-Time Chat System:
       Developed real-time chat application with Node.js and WebSocket communication.
    
    CERTIFICATIONS:
    - HackerRank Problem Solving (Gold Badge)
    - Oracle Certified Associate Java SE 8
    
    EXPERIENCE:
    Software Engineering Intern at CloudTech Labs (3 Months)
    - Assisted senior engineers in debugging REST APIs and creating unit test cases using JUnit.
    """
    extracted_skills = ResumeParser.extract_skills_from_text(sample_text)
    education = ResumeParser.extract_education(sample_text)
    projects = ResumeParser.extract_projects(sample_text, extracted_skills)
    certifications = ResumeParser.extract_certifications(sample_text)
    experience = ResumeParser.extract_experience(sample_text)

    user_id = str(current_user["_id"]) if current_user else "guest-user"

    resume_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "filename": "sample_student_resume.pdf",
        "skills": extracted_skills,
        "education": education,
        "projects": projects,
        "certifications": certifications,
        "experience": experience,
        "summary": "Sample CS student resume loaded for demonstration.",
        "extracted_at": datetime.utcnow().isoformat()
    }

    resumes_col = db_manager.get_collection("resumes")
    resumes_col.update_one({"user_id": user_id}, {"$set": resume_doc}, upsert=True)

    return {
        "id": resume_doc["_id"],
        "user_id": user_id,
        "filename": resume_doc["filename"],
        "skills": resume_doc["skills"],
        "education": resume_doc["education"],
        "projects": resume_doc["projects"],
        "certifications": resume_doc["certifications"],
        "experience": resume_doc["experience"],
        "summary": resume_doc["summary"],
        "extracted_at": resume_doc["extracted_at"]
    }

@router.get("/current", response_model=ResumeAnalysis)
def get_current_resume(current_user: Optional[dict] = Depends(get_optional_user)):
    user_id = str(current_user["_id"]) if current_user else "guest-user"
    resumes_col = db_manager.get_collection("resumes")
    resume = resumes_col.find_one({"user_id": user_id})
    if not resume:
        # Fallback to sample resume if not uploaded yet
        return load_sample_demo_resume(current_user)
    
    return {
        "id": str(resume.get("_id", "")),
        "user_id": user_id,
        "filename": resume.get("filename", "uploaded_resume.pdf"),
        "skills": resume.get("skills", []),
        "education": resume.get("education", []),
        "projects": resume.get("projects", []),
        "certifications": resume.get("certifications", []),
        "experience": resume.get("experience", []),
        "summary": resume.get("summary", ""),
        "extracted_at": resume.get("extracted_at", "")
    }
