import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime

# Knowledge base of practical learning resources and coding tasks mapped to skills
SKILL_LEARNING_LIBRARY = {
    "spring boot": {
        "title": "Mastering Spring Boot & Enterprise Microservices",
        "description": "Learn Spring Boot architecture, dependency injection, annotations, starter packs, and building RESTful microservices.",
        "resources": [
            {"title": "Spring Boot Official Guides", "type": "documentation", "url": "https://spring.io/guides"},
            {"title": "Spring Boot Masterclass (freeCodeCamp)", "type": "video", "url": "https://www.freecodecamp.org/news/spring-boot-tutorial"},
            {"title": "Baeldung Spring Boot Tutorials", "type": "article", "url": "https://www.baeldung.com/spring-boot"}
        ],
        "tasks": [
            {"title": "Initialize a Spring Boot project with Web, Lombok, and DevTools", "type": "coding", "difficulty": "Easy", "description": "Use Spring Initializr to create an app with REST controllers returning JSON responses."},
            {"title": "Build a CRUD REST API with DTO pattern and Validation", "type": "coding", "difficulty": "Medium", "description": "Implement @RestController, @PathVariable, @RequestBody, and Bean Validation (@NotNull, @Size)."},
            {"title": "Handle Exceptions with @ControllerAdvice", "type": "coding", "difficulty": "Medium", "description": "Create standard global error responses with HTTP status codes 400, 404, 500."},
            {"title": "Spring Boot Mock Interview Questions", "type": "interview", "difficulty": "Medium", "description": "Review Spring Bean scopes, IoC Container, Spring Boot autoconfiguration, and Actuator."}
        ]
    },
    "sql": {
        "title": "Relational Database Design & Advanced SQL",
        "description": "Master SQL querying, schema normalization (3NF), joins, indexing, and transactional integrity (ACID).",
        "resources": [
            {"title": "SQL Tutorial (PostgreSQL)", "type": "documentation", "url": "https://www.postgresqltutorial.com"},
            {"title": "Mode Analytics SQL Tutorial", "type": "article", "url": "https://mode.com/sql-tutorial"},
            {"title": "LeetCode Database Problem Set", "type": "coding", "url": "https://leetcode.com/problemset/database"}
        ],
        "tasks": [
            {"title": "Solve 5 SQL LeetCode Easy & Medium problems", "type": "coding", "difficulty": "Medium", "description": "Practice INNER/LEFT JOINs, GROUP BY, HAVING, and window functions (RANK, DENSE_RANK)."},
            {"title": "Design a Normalized E-Commerce Database Schema", "type": "project", "difficulty": "Medium", "description": "Create Users, Products, Orders, OrderItems tables with foreign keys and unique constraints."},
            {"title": "Explain Indexing and B-Tree Query Optimization", "type": "interview", "difficulty": "Hard", "description": "Explain how indexes speed up searches and trade-offs on INSERT/UPDATE."}
        ]
    },
    "rest apis": {
        "title": "Production RESTful API Architecture",
        "description": "Design secure, idempotent, stateless RESTful APIs following HTTP specifications and industry standards.",
        "resources": [
            {"title": "RESTful API Design Best Practices", "type": "article", "url": "https://restfulapi.net"},
            {"title": "OpenAPI / Swagger Specification", "type": "documentation", "url": "https://swagger.io/specification"}
        ],
        "tasks": [
            {"title": "Implement JWT Authentication & Refresh Tokens", "type": "coding", "difficulty": "Medium", "description": "Secure API endpoints with Bearer tokens and role-based authorization."},
            {"title": "Write API Documentation with Swagger / OpenAPI", "type": "project", "difficulty": "Easy", "description": "Annotate endpoints with request/response schemas and examples."},
            {"title": "Idempotency and HTTP Status Code Interview Prep", "type": "interview", "difficulty": "Medium", "description": "Understand GET vs POST vs PUT vs PATCH vs DELETE semantics and safe methods."}
        ]
    },
    "react": {
        "title": "Modern React & Component-Driven UIs",
        "description": "Master modern React with Hooks (useState, useEffect, useMemo, custom hooks), component composition, and responsive state.",
        "resources": [
            {"title": "React Official Documentation", "type": "documentation", "url": "https://react.dev"},
            {"title": "Full React Course (freeCodeCamp)", "type": "video", "url": "https://www.freecodecamp.org/news/react-course"},
            {"title": "Kent C. Dodds React Articles", "type": "article", "url": "https://kentcdodds.com/blog"}
        ],
        "tasks": [
            {"title": "Build a Filterable Dashboard UI with Custom Hooks", "type": "coding", "difficulty": "Medium", "description": "Implement search filter, pagination, and debounce logic using custom hooks."},
            {"title": "Global State Management with Context or Zustand", "type": "coding", "difficulty": "Medium", "description": "Manage user session and theme state globally without prop drilling."},
            {"title": "React Lifecycle and Virtual DOM Interview Prep", "type": "interview", "difficulty": "Medium", "description": "Be ready to explain Reconciliation, Fiber, Virtual DOM, and hook dependency arrays."}
        ]
    },
    "docker": {
        "title": "Containerization with Docker & Multi-Stage Builds",
        "description": "Containerize backend and frontend services for clean local reproduction and cloud deployments.",
        "resources": [
            {"title": "Docker Getting Started Guide", "type": "documentation", "url": "https://docs.docker.com/get-started"},
            {"title": "Docker Crash Course", "type": "video", "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo"}
        ],
        "tasks": [
            {"title": "Write a multi-stage Dockerfile for your application", "type": "coding", "difficulty": "Medium", "description": "Build an optimized small container image (under 150MB) using alpine base."},
            {"title": "Configure multi-container orchestration with Docker Compose", "type": "project", "difficulty": "Medium", "description": "Run API server, database (Postgres/Mongo), and Redis together with one command."},
            {"title": "Docker Container vs Virtual Machine Interview Prep", "type": "interview", "difficulty": "Easy", "description": "Clarify namespaces, cgroups, kernel sharing, and layer caching."}
        ]
    },
    "fastapi": {
        "title": "High-Performance Asynchronous Python APIs with FastAPI",
        "description": "Leverage Python type hinting, Pydantic data schemas, and async/await for modern backend APIs.",
        "resources": [
            {"title": "FastAPI Official Documentation", "type": "documentation", "url": "https://fastapi.tiangolo.com"},
            {"title": "Pydantic Documentation", "type": "documentation", "url": "https://docs.pydantic.dev"}
        ],
        "tasks": [
            {"title": "Build Asynchronous Endpoints with Dependency Injection", "type": "coding", "difficulty": "Medium", "description": "Use Depends() for database sessions, authentication, and request logging."},
            {"title": "Implement Background Tasks and File Processing", "type": "coding", "difficulty": "Medium", "description": "Handle async file uploads and long-running background tasks safely."}
        ]
    },
    "machine learning": {
        "title": "Applied Machine Learning & Predictive Modeling",
        "description": "Master feature engineering, Scikit-Learn pipelines, regression, classification, and cross-validation.",
        "resources": [
            {"title": "Scikit-Learn User Guide", "type": "documentation", "url": "https://scikit-learn.org/stable/user_guide.html"},
            {"title": "Kaggle Learn - Machine Learning", "type": "course", "url": "https://www.kaggle.com/learn"}
        ],
        "tasks": [
            {"title": "End-to-End Scikit-Learn Pipeline", "type": "coding", "difficulty": "Medium", "description": "Build pipeline with StandardScaler, OneHotEncoder, and RandomForestClassifier with GridSearchCV."},
            {"title": "Evaluate Model with Precision, Recall, and ROC-AUC", "type": "coding", "difficulty": "Medium", "description": "Analyze confusion matrix and choose appropriate metric for imbalanced data."}
        ]
    },
    "large language models (llms)": {
        "title": "Generative AI, RAG Systems & LLM Application Development",
        "description": "Build modern AI applications using LangChain, vector embeddings, chunking strategies, and retrieval-augmented generation.",
        "resources": [
            {"title": "LangChain Documentation", "type": "documentation", "url": "https://python.langchain.com"},
            {"title": "DeepLearning.AI Short Courses on LLMs", "type": "course", "url": "https://www.deeplearning.ai/short-courses"}
        ],
        "tasks": [
            {"title": "Build a Document Q&A RAG Pipeline", "type": "project", "difficulty": "Hard", "description": "Embed PDF documents into Chroma/FAISS and answer questions with citation sources."},
            {"title": "Implement Structured Output Parsing with Function Calling", "type": "coding", "difficulty": "Medium", "description": "Prompt LLM to return strictly validated Pydantic JSON objects."}
        ]
    }
}

class AdaptiveRoadmapGenerator:
    """Generates customized, adaptive learning path based on user's current skills and gaps."""

    @classmethod
    def generate_roadmap(
        cls,
        user_skills: List[str],
        missing_skills_info: List[Dict[str, Any]],
        role_title: str
    ) -> Dict[str, Any]:
        """
        Creates an ordered, adaptive roadmap.
        Skills user already has are omitted from early fundamentals.
        Missing skills are ordered logically from foundation to advanced integration.
        """
        milestones = []
        user_skills_lower = {s.lower() for s in user_skills}

        # Sort missing skills: High priority first, then Medium, then Low
        priority_weights = {"high": 1, "medium": 2, "low": 3}
        sorted_gaps = sorted(
            missing_skills_info,
            key=lambda x: priority_weights.get(x.get("priority", "medium").lower(), 2)
        )

        phase_num = 1

        # Generate milestones for each missing gap or clustered gaps
        for item in sorted_gaps:
            skill_name = item["skill_name"]
            key_lower = skill_name.lower()

            # Find matching library item
            library_match = None
            for lib_key, lib_val in SKILL_LEARNING_LIBRARY.items():
                if lib_key in key_lower or key_lower in lib_key:
                    library_match = lib_val
                    break

            if library_match:
                title = library_match["title"]
                desc = library_match["description"]
                resources = library_match["resources"]
                tasks_raw = library_match["tasks"]
            else:
                title = f"Mastering {skill_name} for {role_title}"
                desc = f"Understand core principles, industry conventions, and practical implementation of {skill_name}."
                resources = [
                    {"title": f"{skill_name} Official Documentation", "type": "documentation", "url": f"https://www.google.com/search?q={skill_name}+official+docs"},
                    {"title": f"{skill_name} Practical Guide", "type": "article", "url": f"https://dev.to/t/{skill_name.lower().replace(' ', '')}"}
                ]
                tasks_raw = [
                    {"title": f"Study {skill_name} Fundamentals and Syntax", "type": "reading", "difficulty": "Easy", "description": f"Read core chapters and understand fundamental building blocks of {skill_name}."},
                    {"title": f"Build a hands-on {skill_name} mini-project", "type": "coding", "difficulty": "Medium", "description": f"Create a working standalone demo utilizing {skill_name}."},
                    {"title": f"Review {skill_name} common interview questions", "type": "interview", "difficulty": "Medium", "description": f"Prepare for top 10 technical questions asked in {role_title} interviews."}
                ]

            # Construct practice tasks with IDs
            practice_tasks = []
            for t_idx, t in enumerate(tasks_raw):
                practice_tasks.append({
                    "id": f"task-p{phase_num}-{t_idx+1}",
                    "title": t["title"],
                    "type": t.get("type", "coding"),
                    "difficulty": t.get("difficulty", "Medium"),
                    "description": t["description"],
                    "completed": False,
                    "resources": resources
                })

            milestones.append({
                "id": f"milestone-phase-{phase_num}",
                "phase_number": phase_num,
                "title": f"Phase {phase_num}: {title}",
                "skill_focus": skill_name,
                "priority": item.get("priority", "Medium"),
                "description": desc,
                "estimated_days": 7 if item.get("priority") == "High" else 5,
                "practice_tasks": practice_tasks,
                "completed": False,
                "progress_percent": 0
            })
            phase_num += 1

        # Add Capstone Portfolio Project Milestone at the end
        capstone_tasks = [
            {
                "id": f"task-p{phase_num}-1",
                "title": f"Architect End-to-End {role_title} Portfolio Project",
                "type": "project",
                "difficulty": "Hard",
                "description": f"Combine all mastered skills into a cohesive, deployed application showcasing full-stack capabilities.",
                "completed": False,
                "resources": [{"title": "GitHub Portfolio Showcase Guide", "type": "article", "url": "https://github.com"}]
            },
            {
                "id": f"task-p{phase_num}-2",
                "title": f"Write Comprehensive Readme & System Architecture Diagram",
                "type": "project",
                "difficulty": "Medium",
                "description": "Document your project architecture, API specs, database schema, and live demo link.",
                "completed": False,
                "resources": []
            },
            {
                "id": f"task-p{phase_num}-3",
                "title": "Comprehensive Technical Mock Interview",
                "type": "interview",
                "difficulty": "Hard",
                "description": "Conduct simulated technical round covering all foundational skills, design trade-offs, and live coding.",
                "completed": False,
                "resources": []
            }
        ]

        milestones.append({
            "id": f"milestone-phase-{phase_num}",
            "phase_number": phase_num,
            "title": f"Phase {phase_num}: Full-Stack Capstone & Interview Readiness",
            "skill_focus": f"{role_title} Capstone",
            "priority": "High",
            "description": "Bring all individual skills together into a production-grade deployed portfolio project that wows recruiters.",
            "estimated_days": 10,
            "practice_tasks": capstone_tasks,
            "completed": False,
            "progress_percent": 0
        })

        # Calculate totals
        total_tasks = sum(len(m["practice_tasks"]) for m in milestones)
        completed_tasks = sum(
            len([t for t in m["practice_tasks"] if t["completed"]]) for m in milestones
        )

        return {
            "id": str(uuid.uuid4()),
            "role_title": role_title,
            "milestones": milestones,
            "total_tasks": total_tasks,
            "completed_tasks": completed_tasks,
            "overall_progress": 0,
            "last_updated": datetime.utcnow().isoformat()
        }

    @classmethod
    def update_task_progress(
        cls,
        roadmap: Dict[str, Any],
        milestone_id: str,
        task_id: str,
        completed: bool
    ) -> Dict[str, Any]:
        """
        Updates task completion status, recalculates milestone and overall progress adaptively.
        """
        milestones = roadmap.get("milestones", [])
        for m in milestones:
            if m["id"] == milestone_id:
                for t in m["practice_tasks"]:
                    if t["id"] == task_id:
                        t["completed"] = completed
                
                # Recalculate milestone progress
                m_total = len(m["practice_tasks"])
                m_done = len([t for t in m["practice_tasks"] if t["completed"]])
                m["progress_percent"] = round((m_done / m_total * 100)) if m_total > 0 else 0
                m["completed"] = (m_done == m_total)

        # Recalculate overall roadmap
        total_tasks = sum(len(m["practice_tasks"]) for m in milestones)
        completed_tasks = sum(
            len([t for t in m["practice_tasks"] if t["completed"]]) for m in milestones
        )
        roadmap["total_tasks"] = total_tasks
        roadmap["completed_tasks"] = completed_tasks
        roadmap["overall_progress"] = round((completed_tasks / total_tasks * 100)) if total_tasks > 0 else 0
        roadmap["last_updated"] = datetime.utcnow().isoformat()
        return roadmap
