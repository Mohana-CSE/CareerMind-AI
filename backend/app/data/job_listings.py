"""Curated job opportunities for career matching"""

SEED_JOB_OPPORTUNITIES = [
    {
        "id": "job-1",
        "role_id": "java-fullstack",
        "title": "Junior Java Full Stack Developer",
        "company": "Infosys / FinTech Edge",
        "location": "Bengaluru, India (Hybrid)",
        "job_type": "Full-Time",
        "experience_level": "0-2 Years / Entry Level",
        "salary_range": "₹6,00,000 - ₹9,50,000 / yr",
        "required_skills": ["Java", "Spring Boot", "REST APIs", "SQL", "React", "Git"],
        "description": "Looking for passionate early-career developers to join our Digital Banking platform team building scalable Spring Boot microservices and React dashboards.",
        "apply_url": "https://careers.infosys.com",
        "tags": ["FinTech", "Spring Boot", "React", "Enterprise"]
    },
    {
        "id": "job-2",
        "role_id": "java-fullstack",
        "title": "Associate Software Engineer - Java / Cloud",
        "company": "Capgemini",
        "location": "Hyderabad / Remote",
        "job_type": "Full-Time",
        "experience_level": "Fresh Graduate / 0-1 yr",
        "salary_range": "₹5,50,000 - ₹8,00,000 / yr",
        "required_skills": ["Java", "Spring Boot", "Hibernate/JPA", "SQL", "Docker", "Git"],
        "description": "Develop and maintain mission-critical cloud enterprise portals. You will receive mentorship in microservice architectures and CI/CD pipelines.",
        "apply_url": "https://www.capgemini.com/careers",
        "tags": ["Cloud", "Microservices", "Java", "Docker"]
    },
    {
        "id": "job-3",
        "role_id": "frontend-react",
        "title": "Frontend Engineer - UI/UX & Web Apps",
        "company": "Razorpay",
        "location": "Bengaluru, India",
        "job_type": "Full-Time",
        "experience_level": "0-2 Years",
        "salary_range": "₹9,00,000 - ₹14,00,000 / yr",
        "required_skills": ["JavaScript (ES6+)", "TypeScript", "React", "Tailwind CSS", "REST APIs", "Git"],
        "description": "Build world-class developer dashboards and payment checkout experiences. We love clean code, accessible UI components, and pixel perfection.",
        "apply_url": "https://razorpay.com/jobs",
        "tags": ["FinTech", "Payments", "Design Systems", "React"]
    },
    {
        "id": "job-4",
        "role_id": "frontend-react",
        "title": "React Web Developer (Intern to Full-time)",
        "company": "Swiggy",
        "location": "Bengaluru (Hybrid)",
        "job_type": "Full-Time / Internship",
        "experience_level": "0-1 yr",
        "salary_range": "₹7,00,000 - ₹11,00,000 / yr",
        "required_skills": ["JavaScript (ES6+)", "React", "HTML5 & CSS3", "Tailwind CSS", "Redux / Zustand"],
        "description": "Work on ultra-fast consumer-facing delivery apps, real-time tracking feeds, and responsive desktop web apps serving millions of users daily.",
        "apply_url": "https://careers.swiggy.com",
        "tags": ["Consumer Tech", "High Traffic", "React", "Vite"]
    },
    {
        "id": "job-5",
        "role_id": "backend-python",
        "title": "Python Backend Developer (FastAPI / Cloud)",
        "company": "Postman",
        "location": "Remote / Bengaluru",
        "job_type": "Full-Time",
        "experience_level": "1-3 Years",
        "salary_range": "₹12,00,000 - ₹18,00,000 / yr",
        "required_skills": ["Python", "FastAPI", "PostgreSQL", "Docker", "RESTful APIs", "Git"],
        "description": "Power the API platform used by 30M+ developers worldwide. Design robust APIs, improve database query performance, and write clean asynchronous Python.",
        "apply_url": "https://www.postman.com/company/careers",
        "tags": ["Developer Tools", "FastAPI", "High Concurrency"]
    },
    {
        "id": "job-6",
        "role_id": "ai-ml-engineer",
        "title": "Associate AI / ML Engineer",
        "company": "Fractal Analytics",
        "location": "Mumbai / Bengaluru",
        "job_type": "Full-Time",
        "experience_level": "0-2 Years",
        "salary_range": "₹8,50,000 - ₹13,00,000 / yr",
        "required_skills": ["Python", "Machine Learning", "PyTorch / TensorFlow", "NLP", "Pandas", "Scikit-Learn"],
        "description": "Join our AI research and deployment lab. Build NLP models, predictive customer behavior analytics, and generative AI workflow prototypes.",
        "apply_url": "https://fractal.ai/careers",
        "tags": ["AI Research", "NLP", "Predictive Analytics"]
    },
    {
        "id": "job-7",
        "role_id": "mern-fullstack",
        "title": "Full Stack MERN Developer",
        "company": "Zomato",
        "location": "Gurugram / Remote",
        "job_type": "Full-Time",
        "experience_level": "0-2 Years",
        "salary_range": "₹8,00,000 - ₹12,50,000 / yr",
        "required_skills": ["JavaScript", "React", "Node.js", "Express.js", "MongoDB", "REST APIs"],
        "description": "Build high-speed merchant and internal operational web applications. End-to-end responsibility from database schema design to React UI.",
        "apply_url": "https://www.zomato.com/careers",
        "tags": ["E-Commerce", "MERN", "Microservices"]
    },
    {
        "id": "job-8",
        "role_id": "devops-cloud",
        "title": "Junior DevOps Engineer",
        "company": "CloudKite / TCS",
        "location": "Pune / Remote",
        "job_type": "Full-Time",
        "experience_level": "0-2 Years",
        "salary_range": "₹6,50,000 - ₹10,00,000 / yr",
        "required_skills": ["Linux / Bash", "Docker", "Kubernetes", "AWS / Azure / GCP", "CI/CD", "Git"],
        "description": "Help our engineering teams deliver software safely and quickly. Manage container registries, automate GitHub Actions pipelines, and monitor telemetry.",
        "apply_url": "https://tcs.com/careers",
        "tags": ["DevOps", "Kubernetes", "AWS", "CI/CD"]
    }
]

def get_jobs_for_role(role_id: str = None):
    if not role_id:
        return SEED_JOB_OPPORTUNITIES
    return [job for job in SEED_JOB_OPPORTUNITIES if job["role_id"].lower() == role_id.lower()]
