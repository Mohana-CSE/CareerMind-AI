from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from app.core.config import settings
from app.core.database import get_db_status
from app.api import auth, resume, roles, skill_gap, readiness, roadmap, jobs

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="CareerMind AI - Skill Gap Analyzer and Adaptive Career Roadmap API",
    version="1.0.0"
)

# Enable CORS for React frontend (Vite defaults to port 5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler for clean JSON errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[CareerMind Error] Unhandled Exception: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": f"An error occurred while processing your request: {str(exc)}"}
    )

# Include API Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(roles.router, prefix="/api/roles", tags=["Target Roles"])
app.include_router(skill_gap.router, prefix="/api/skill-gap", tags=["Skill Gap Analysis"])
app.include_router(readiness.router, prefix="/api/readiness", tags=["Career Readiness"])
app.include_router(roadmap.router, prefix="/api/roadmap", tags=["Adaptive Roadmap"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Job Opportunities"])

@app.get("/")
def root():
    return {
        "project": "CareerMind AI",
        "description": "Skill Gap Analyzer and Adaptive Career Roadmap",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

@app.get("/api/health")
def health_check():
    db_info = get_db_status()
    return {
        "status": "healthy",
        "service": "CareerMind AI Backend",
        "database": db_info
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
