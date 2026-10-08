from typing import Dict, List, Any
import re

class CareerReadinessScorer:
    """Calculates comprehensive Career Readiness Score across 5 dimensions."""

    @classmethod
    def calculate_score(
        cls,
        resume_data: Dict[str, Any],
        skill_gap_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates multi-dimensional readiness score:
        - Role Alignment (30%)
        - Technical Skills (25%)
        - Projects & Portfolio (20%)
        - DSA & Problem Solving (15%)
        - Certifications & Prep (10%)
        """
        match_percentage = skill_gap_data.get("match_percentage", 0.0)
        user_skills = [s.lower() for s in resume_data.get("skills", [])]
        projects = resume_data.get("projects", [])
        certifications = resume_data.get("certifications", [])
        education = resume_data.get("education", [])

        # 1. Role Alignment (out of 100)
        role_alignment_score = min(100, int(match_percentage * 1.05))

        # 2. Technical Skills Foundation (out of 100)
        # Based on breadth of tech stack
        tech_count = len(user_skills)
        if tech_count >= 12:
            tech_score = 95
        elif tech_count >= 8:
            tech_score = 80 + (tech_count - 8) * 3
        elif tech_count >= 4:
            tech_score = 60 + (tech_count - 4) * 5
        else:
            tech_score = max(30, tech_count * 15)

        # 3. Projects & Practical Portfolio (out of 100)
        proj_count = len(projects)
        if proj_count >= 3:
            project_score = 92
        elif proj_count == 2:
            project_score = 82
        elif proj_count == 1:
            project_score = 68
        else:
            project_score = 40

        # 4. DSA & Problem Solving (out of 100)
        dsa_keywords = ["dsa", "algorithms", "data structures", "leetcode", "hackerrank", "codeforces", "competitive programming"]
        dsa_found = any(any(kw in s for kw in dsa_keywords) for s in user_skills)
        cert_dsa = any(any(kw in c.lower() for kw in dsa_keywords) for c in certifications)
        
        if dsa_found and cert_dsa:
            dsa_score = 90
        elif dsa_found or cert_dsa:
            dsa_score = 75
        elif any(s in ["python", "java", "c++", "c"] for s in user_skills):
            # Knows a core DSA language
            dsa_score = 55
        else:
            dsa_score = 40

        # 5. Certifications & Interview Prep (out of 100)
        cert_count = len(certifications)
        has_formal_edu = len(education) > 0
        cert_score = min(95, (cert_count * 25) + (25 if has_formal_edu else 10))

        # Overall Weighted Score (0 - 100)
        overall_score = round(
            (role_alignment_score * 0.30) +
            (tech_score * 0.25) +
            (project_score * 0.20) +
            (dsa_score * 0.15) +
            (cert_score * 0.10)
        )
        overall_score = max(10, min(100, overall_score))

        # Tier Evaluation
        if overall_score >= 85:
            tier = "Strong Hire (Top 10% Ready)"
        elif overall_score >= 70:
            tier = "Job-Ready Candidate"
        elif overall_score >= 50:
            tier = "Developing Competence"
        else:
            tier = "Early Foundation Stage"

        # Strengths & Improvement Areas
        strengths = []
        improvements = []
        recommendations = []

        if role_alignment_score >= 70:
            strengths.append(f"Strong match with core skills for {skill_gap_data.get('role_title', 'target role')}.")
        else:
            improvements.append("Significant gaps in target job role technical requirements.")
            recommendations.append("Prioritize the high-priority missing skills in Phase 1 of your roadmap.")

        if tech_score >= 75:
            strengths.append("Diverse technical toolkit across frontend, backend, or databases.")
        else:
            improvements.append("Tech stack needs broader exposure to standard frameworks.")
            recommendations.append("Build full-stack applications integrating both UI and server-side components.")

        if project_score >= 80:
            strengths.append("Good hands-on project portfolio demonstrating real-world applications.")
        else:
            improvements.append("Resume lacks demonstrable deployed portfolio projects.")
            recommendations.append("Deploy 1 end-to-end full stack project on Vercel/Render with live demo & GitHub link.")

        if dsa_score >= 75:
            strengths.append("Verified problem-solving capability (Data Structures & Algorithms).")
        else:
            improvements.append("Problem solving / coding interview practice needs strengthening.")
            recommendations.append("Solve 2-3 LeetCode problems weekly focusing on Arrays, HashMaps, and Trees.")

        if cert_count > 0:
            strengths.append("Industry certifications validate formal self-driven learning.")
        else:
            recommendations.append("Earn a recognized cloud or framework credential (e.g., AWS, Spring, or Meta certification).")

        return {
            "overall_score": overall_score,
            "tier": tier,
            "breakdown": {
                "technical_skills": tech_score,
                "role_alignment": role_alignment_score,
                "dsa_problem_solving": dsa_score,
                "projects_portfolio": project_score,
                "certifications_prep": cert_score
            },
            "strengths": strengths if strengths else ["Good foundational interest and growth mindset."],
            "improvement_areas": improvements if improvements else ["Refine advanced system design and performance tuning."],
            "quick_win_recommendations": recommendations[:3]
        }
