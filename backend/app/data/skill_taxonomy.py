"""
Skill Taxonomy and Semantic Knowledge Base for CareerMind AI
Enables semantic matching beyond literal keywords (e.g., 'Spring Framework REST' <-> 'Spring Boot REST API')
"""

from typing import Dict, List, Set, Any

CANONICAL_SKILL_KNOWLEDGE = {
    "spring boot": {
        "canonical": "Spring Boot",
        "category": "Backend Framework",
        "synonyms": [
            "spring framework", "spring", "spring boot rest api", "spring boot microservices",
            "restful services using spring framework", "spring mvc", "spring data", "spring security"
        ],
        "related": ["java", "rest apis", "hibernate/jpa", "microservices", "maven/gradle"],
        "importance": "High",
        "why_important": "Industry-standard enterprise Java microservices framework powering high-volume backend architectures."
    },
    "java": {
        "canonical": "Java",
        "category": "Programming Language",
        "synonyms": ["core java", "java 8", "java 11", "java 17", "java 21", "j2se", "j2ee", "jvm languages"],
        "related": ["spring boot", "junit", "hibernate/jpa", "object-oriented programming", "oop"],
        "importance": "High",
        "why_important": "Foundation for enterprise software, scalable microservices, and modern Android development."
    },
    "rest apis": {
        "canonical": "REST APIs",
        "category": "API Architecture",
        "synonyms": [
            "restful api", "rest api", "restful web services", "restful services", "api development",
            "json apis", "rest endpoints", "restful architecture", "http apis"
        ],
        "related": ["fastapi", "spring boot", "express.js", "postman", "swagger/openapi"],
        "importance": "High",
        "why_important": "Crucial standard protocol for frontend-backend communication and microservices integration."
    },
    "react": {
        "canonical": "React",
        "category": "Frontend Framework",
        "synonyms": [
            "react.js", "reactjs", "react hooks", "react router", "react frontend", "modern react", "next.js"
        ],
        "related": ["javascript (es6+)", "typescript", "tailwind css", "redux / zustand", "html5 & css3"],
        "importance": "High",
        "why_important": "Most requested client-side UI library in modern software engineering."
    },
    "javascript (es6+)": {
        "canonical": "JavaScript (ES6+)",
        "category": "Programming Language",
        "synonyms": ["javascript", "js", "vanilla javascript", "ecmascript", "es6", "modern javascript"],
        "related": ["typescript", "react", "node.js", "html5 & css3"],
        "importance": "High",
        "why_important": "The fundamental engine of the modern web and browser environment."
    },
    "typescript": {
        "canonical": "TypeScript",
        "category": "Programming Language",
        "synonyms": ["ts", "typescript typing", "typed javascript"],
        "related": ["javascript (es6+)", "react", "node.js", "angular"],
        "importance": "High",
        "why_important": "Brings compile-time type safety to JavaScript, vastly reducing production runtime bugs."
    },
    "sql": {
        "canonical": "SQL",
        "category": "Database",
        "synonyms": [
            "structured query language", "postgresql", "mysql", "relational databases", "sqlite",
            "database queries", "rdbms", "sql server"
        ],
        "related": ["hibernate/jpa", "database normalization", "indexing", "stored procedures"],
        "importance": "High",
        "why_important": "Core standard for querying, persisting, and managing relational business data."
    },
    "hibernate/jpa": {
        "canonical": "Hibernate/JPA",
        "category": "ORM & Data Access",
        "synonyms": ["hibernate", "jpa", "java persistence api", "spring data jpa", "orm"],
        "related": ["java", "spring boot", "sql"],
        "importance": "Medium",
        "why_important": "Abstracts relational SQL interactions into object-oriented Java entities seamlessly."
    },
    "docker": {
        "canonical": "Docker",
        "category": "DevOps & Containers",
        "synonyms": ["docker containers", "containerization", "docker-compose", "dockerfile", "containers"],
        "related": ["kubernetes", "ci/cd", "devops", "cloud"],
        "importance": "High",
        "why_important": "Ensures reproducible environments across development, testing, and cloud deployments."
    },
    "kubernetes": {
        "canonical": "Kubernetes",
        "category": "DevOps & Cloud",
        "synonyms": ["k8s", "container orchestration", "helm", "kube"],
        "related": ["docker", "devops", "aws / azure / gcp"],
        "importance": "High",
        "why_important": "De facto industry container orchestration platform for running multi-instance distributed apps."
    },
    "git": {
        "canonical": "Git",
        "category": "Version Control",
        "synonyms": ["github", "gitlab", "version control", "vcs", "source code management", "git branching"],
        "related": ["ci/cd", "collaboration", "code review"],
        "importance": "High",
        "why_important": "Essential collaboration tool used in virtually 100% of professional engineering teams."
    },
    "python": {
        "canonical": "Python",
        "category": "Programming Language",
        "synonyms": ["python 3", "python scripting", "core python", "py"],
        "related": ["fastapi", "django", "machine learning", "pandas", "data science"],
        "importance": "High",
        "why_important": "Premier language for AI/ML, data pipelines, backend APIs, and automation scripts."
    },
    "fastapi": {
        "canonical": "FastAPI",
        "category": "Backend Framework",
        "synonyms": ["fastapi rest api", "fast api", "starlette/pydantic", "python async api"],
        "related": ["python", "rest apis", "pydantic", "asyncio"],
        "importance": "High",
        "why_important": "Modern, lightning-fast asynchronous Python web framework with automated OpenAPI docs."
    },
    "machine learning": {
        "canonical": "Machine Learning",
        "category": "Artificial Intelligence",
        "synonyms": ["ml", "scikit-learn", "predictive modeling", "supervised learning", "unsupervised learning"],
        "related": ["deep learning", "python", "data preprocessing & pandas", "math & statistics"],
        "importance": "High",
        "why_important": "Empowers applications to discover patterns and make automated decisions from data."
    },
    "deep learning": {
        "canonical": "Deep Learning",
        "category": "Artificial Intelligence",
        "synonyms": ["neural networks", "pytorch", "tensorflow", "keras", "cnn", "rnn", "transformers"],
        "related": ["machine learning", "pytorch / tensorflow", "computer vision", "nlp"],
        "importance": "High",
        "why_important": "Foundational paradigm behind LLMs, speech, vision, and advanced multimodal models."
    },
    "large language models (llms)": {
        "canonical": "Large Language Models (LLMs)",
        "category": "Artificial Intelligence",
        "synonyms": ["llm", "generative ai", "genai", "gpt", "rag", "langchain", "prompt engineering", "llamaindex"],
        "related": ["vector databases & embeddings", "nlp", "python"],
        "importance": "High",
        "why_important": "The frontier of AI applications: text synthesis, reasoning, code generation, and RAG architectures."
    },
    "mongodb": {
        "canonical": "MongoDB",
        "category": "Database",
        "synonyms": ["mongo", "nosql", "document database", "mongoose", "motor", "mongodb atlas"],
        "related": ["node.js", "express.js", "python", "rest apis"],
        "importance": "Medium",
        "why_important": "Popular flexible NoSQL document database suited for dynamic JSON schema payloads."
    },
    "microservices": {
        "canonical": "Microservices",
        "category": "System Architecture",
        "synonyms": ["microservice architecture", "distributed systems", "event-driven architecture", "service mesh"],
        "related": ["docker", "rest apis", "kafka", "spring boot"],
        "importance": "Medium",
        "why_important": "Enables modular, independently scalable, and fault-tolerant organizational software systems."
    },
    "tailwind css": {
        "canonical": "Tailwind CSS",
        "category": "Frontend Styling",
        "synonyms": ["tailwind", "utility css", "css3", "postcss"],
        "related": ["react", "html5 & css3", "responsive web design"],
        "importance": "Medium",
        "why_important": "Rapid utility-first CSS framework enabling sleek, responsive UI without styling collisions."
    },
    "html5 & css3": {
        "canonical": "HTML5 & CSS3",
        "category": "Web Core",
        "synonyms": ["html", "html5", "css", "css3", "web markup", "flexbox", "css grid"],
        "related": ["javascript (es6+)", "responsive web design"],
        "importance": "High",
        "why_important": "The foundational layout and visual presentation standards of every web application."
    },
    "ci/cd (github actions / jenkins)": {
        "canonical": "CI/CD (GitHub Actions / Jenkins)",
        "category": "DevOps",
        "synonyms": ["ci/cd", "continuous integration", "continuous deployment", "github actions", "jenkins", "gitlab ci"],
        "related": ["git", "docker", "unit testing"],
        "importance": "Medium",
        "why_important": "Automates automated testing, builds, and zero-downtime deployment pipelines."
    }
}

# General skill keywords for resume extraction
POPULAR_EXTRACTABLE_SKILLS = [
    "Python", "Java", "JavaScript", "TypeScript", "C++", "C#", "C", "Go", "Rust", "PHP", "Ruby", "Kotlin", "Swift",
    "React", "React.js", "Angular", "Vue.js", "Next.js", "Node.js", "Express.js", "FastAPI", "Django", "Flask",
    "Spring Boot", "Spring Framework", "Hibernate", "JPA", "ASP.NET", "GraphQL", "REST APIs", "RESTful Web Services",
    "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle", "Cassandra", "DynamoDB", "Elasticsearch",
    "HTML", "HTML5", "CSS", "CSS3", "Tailwind CSS", "Bootstrap", "Sass", "Material UI", "Redux", "Zustand",
    "Docker", "Kubernetes", "AWS", "Azure", "Google Cloud", "GCP", "Linux", "Git", "GitHub", "GitLab", "CI/CD",
    "Jenkins", "GitHub Actions", "Terraform", "Ansible", "Nginx", "Apache",
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP", "Natural Language Processing",
    "Computer Vision", "PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "Pandas", "NumPy", "OpenCV",
    "Large Language Models", "LLMs", "Generative AI", "LangChain", "Vector Databases", "Embeddings", "RAG",
    "Data Structures", "Algorithms", "DSA", "System Design", "Microservices", "OOP", "Object-Oriented Programming",
    "Unit Testing", "JUnit", "PyTest", "Jest", "TDD", "Agile", "Scrum", "Jira"
]
