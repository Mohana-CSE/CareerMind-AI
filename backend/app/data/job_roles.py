"""Standard Target Job Roles Taxonomy for CareerMind AI"""

JOB_ROLES_DATABASE = [
    {
        "id": "java-fullstack",
        "title": "Java Full Stack Developer",
        "category": "Software Engineering",
        "description": "Designs, builds, and maintains full-stack enterprise applications utilizing robust Java backends (Spring Boot, Hibernate) and modern interactive web frontends.",
        "required_skills": [
            "Java",
            "Spring Boot",
            "REST APIs",
            "SQL",
            "Hibernate/JPA",
            "React",
            "JavaScript",
            "Git",
            "Microservices",
            "Docker",
            "Maven/Gradle",
            "Unit Testing (JUnit)"
        ],
        "core_technologies": ["Java 17+", "Spring Boot", "React", "PostgreSQL", "Docker", "REST"],
        "average_salary": "$95,000 - $140,000 / yr",
        "market_demand": "Very High"
    },
    {
        "id": "frontend-react",
        "title": "Frontend React Developer",
        "category": "Web Development",
        "description": "Specializes in building responsive, high-performance user interfaces using React, modern JavaScript/TypeScript, CSS frameworks, and state management libraries.",
        "required_skills": [
            "JavaScript (ES6+)",
            "TypeScript",
            "React",
            "HTML5 & CSS3",
            "Tailwind CSS",
            "Redux / Zustand",
            "REST APIs",
            "Responsive Web Design",
            "Git",
            "Webpack / Vite",
            "Testing (Jest / React Testing Library)",
            "Web Performance Optimization"
        ],
        "core_technologies": ["React", "TypeScript", "Tailwind CSS", "Vite", "Next.js"],
        "average_salary": "$85,000 - $130,000 / yr",
        "market_demand": "High"
    },
    {
        "id": "backend-python",
        "title": "Python Backend & API Engineer",
        "category": "Backend Engineering",
        "description": "Architects resilient scalable server-side systems, microservices, and asynchronous API endpoints using Python, FastAPI/Django, and relational/NoSQL datastores.",
        "required_skills": [
            "Python",
            "FastAPI",
            "Django / Flask",
            "RESTful APIs",
            "PostgreSQL",
            "MongoDB",
            "Redis",
            "Docker",
            "Git",
            "Asynchronous Programming (asyncio)",
            "Celery / Message Queues",
            "PyTest & TDD"
        ],
        "core_technologies": ["Python", "FastAPI", "PostgreSQL", "Docker", "Redis"],
        "average_salary": "$95,000 - $145,000 / yr",
        "market_demand": "Very High"
    },
    {
        "id": "ai-ml-engineer",
        "title": "AI & Machine Learning Engineer",
        "category": "Artificial Intelligence",
        "description": "Researches, trains, and deploys predictive machine learning models, deep learning architectures, and LLM applications into production infrastructure.",
        "required_skills": [
            "Python",
            "Machine Learning",
            "Deep Learning",
            "PyTorch / TensorFlow",
            "Data Preprocessing & Pandas",
            "Scikit-Learn",
            "NLP (Natural Language Processing)",
            "Large Language Models (LLMs)",
            "Vector Databases & Embeddings",
            "Model Deployment (Docker / FastAPI)",
            "Git",
            "Mathematics & Statistics"
        ],
        "core_technologies": ["Python", "PyTorch", "HuggingFace", "LangChain", "Vector DBs"],
        "average_salary": "$115,000 - $170,000 / yr",
        "market_demand": "Skyrocketing"
    },
    {
        "id": "mern-fullstack",
        "title": "Full Stack MERN Developer",
        "category": "Full Stack Engineering",
        "description": "Builds end-to-end full stack web platforms using the JavaScript ecosystem: MongoDB, Express.js, React, and Node.js.",
        "required_skills": [
            "JavaScript",
            "TypeScript",
            "React",
            "Node.js",
            "Express.js",
            "MongoDB",
            "REST APIs",
            "Authentication (JWT / OAuth)",
            "Tailwind CSS",
            "Git",
            "Docker Basics",
            "State Management"
        ],
        "core_technologies": ["MongoDB", "Express.js", "React", "Node.js", "TypeScript"],
        "average_salary": "$90,000 - $135,000 / yr",
        "market_demand": "High"
    },
    {
        "id": "devops-cloud",
        "title": "DevOps & Cloud Engineer",
        "category": "Infrastructure & Cloud",
        "description": "Automates CI/CD pipelines, container orchestration, and cloud infrastructure management for high availability and reliability.",
        "required_skills": [
            "Linux / Bash",
            "Docker",
            "Kubernetes",
            "CI/CD (GitHub Actions / Jenkins)",
            "AWS / Azure / GCP",
            "Infrastructure as Code (Terraform)",
            "Git",
            "Monitoring (Prometheus / Grafana)",
            "Networking & Security Basics",
            "Python or Go Scripting"
        ],
        "core_technologies": ["Docker", "Kubernetes", "AWS", "Terraform", "GitHub Actions"],
        "average_salary": "$105,000 - $160,000 / yr",
        "market_demand": "Very High"
    },
    {
        "id": "data-analyst",
        "title": "Data Analyst & Business Intelligence",
        "category": "Data & Analytics",
        "description": "Extracts actionable business insights from raw data using SQL, statistical modeling, data visualization dashboards, and Python.",
        "required_skills": [
            "SQL (Advanced)",
            "Python",
            "Excel & Spreadsheets",
            "Power BI / Tableau",
            "Data Cleaning (Pandas)",
            "Exploratory Data Analysis",
            "Statistics & Probability",
            "Communication & Storytelling",
            "Git"
        ],
        "core_technologies": ["SQL", "Python", "PowerBI", "Tableau", "Pandas"],
        "average_salary": "$75,000 - $115,000 / yr",
        "market_demand": "High"
    }
]

def get_all_roles():
    return JOB_ROLES_DATABASE

def get_role_by_id(role_id: str):
    for role in JOB_ROLES_DATABASE:
        if role["id"].lower() == role_id.lower():
            return role
    return None
