import json
import requests
from typing import Dict, Any, List, Optional
from app.core.config import settings

class AIService:
    """Provides optional LLM augmentation with fallback to local NLP engine."""

    @classmethod
    def enhance_resume_extraction(cls, raw_text: str, current_skills: List[str]) -> Dict[str, Any]:
        """Optionally calls LLM to refine skills and summary if API key is present."""
        if not settings.GEMINI_API_KEY and not settings.OPENAI_API_KEY:
            # Local engine already extracted skills
            return {
                "skills": current_skills,
                "summary": "Extracted through CareerMind AI High-Precision Semantic NLP Engine."
            }

        # Try Gemini API if key is present
        if settings.GEMINI_API_KEY:
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={settings.GEMINI_API_KEY}"
                prompt = f"""
                You are an expert technical recruiter and resume analyzer.
                Analyze the following resume text and return a JSON object with:
                1. "skills": list of technical skills, frameworks, languages, tools.
                2. "summary": 2-sentence executive summary of the candidate's technical profile.

                Resume Text:
                {raw_text[:3000]}
                Return ONLY valid JSON.
                """
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {"response_mime_type": "application/json"}
                }
                resp = requests.post(url, json=payload, timeout=8)
                if resp.status_code == 200:
                    data = resp.json()
                    content = data["candidates"][0]["content"]["parts"][0]["text"]
                    parsed = json.loads(content)
                    combined = list(set(current_skills + parsed.get("skills", [])))
                    return {
                        "skills": sorted(combined),
                        "summary": parsed.get("summary", "")
                    }
            except Exception as e:
                print(f"[AI Service] Gemini fallback warning: {e}")

        return {
            "skills": current_skills,
            "summary": "Profile analyzed with CareerMind AI Semantic Extraction Engine."
        }
