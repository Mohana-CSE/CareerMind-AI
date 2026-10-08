import re
from typing import List, Dict, Tuple, Optional, Any
from app.data.skill_taxonomy import CANONICAL_SKILL_KNOWLEDGE

def normalize_text(text: str) -> str:
    """Normalize skill string by removing punctuation and extra spaces."""
    cleaned = re.sub(r'[^a-zA-Z0-9+#.\s]', ' ', text.lower())
    return ' '.join(cleaned.split())

def get_tokens(text: str) -> set:
    """Extract informative tokens, filtering minor stop words."""
    stopwords = {"and", "with", "using", "for", "in", "of", "to", "the", "a", "an", "on", "developer", "engineering"}
    norm = normalize_text(text)
    return {token for token in norm.split() if token not in stopwords and len(token) > 1}

class SemanticSkillMatcher:
    """Intelligent semantic skill matcher capable of fuzzy, conceptual, and synonym matching."""

    @classmethod
    def compute_similarity(cls, candidate_skill: str, target_skill: str) -> Tuple[float, str]:
        """
        Calculates semantic similarity between a candidate's skill and a target role requirement.
        Returns (similarity_score [0.0 - 1.0], rationale).
        """
        c_norm = normalize_text(candidate_skill)
        t_norm = normalize_text(target_skill)

        # 1. Exact normalized match
        if c_norm == t_norm:
            return 1.0, f"Exact match for required capability '{target_skill}'."

        # 2. Check Canonical Knowledge Base synonyms
        for key, info in CANONICAL_SKILL_KNOWLEDGE.items():
            canonical_name = info["canonical"].lower()
            synonyms = [s.lower() for s in info.get("synonyms", [])]
            
            # If target skill matches canonical or synonym
            target_matches_concept = (t_norm == canonical_name or t_norm in synonyms or any(s in t_norm for s in synonyms))
            
            # If candidate skill matches canonical or synonym
            candidate_matches_concept = (c_norm == canonical_name or c_norm in synonyms or any(s in c_norm for s in synonyms))

            if target_matches_concept and candidate_matches_concept:
                return 0.95, f"Recognized '{candidate_skill}' as semantically equivalent to '{target_skill}' based on tech taxonomy."

            # Specific handling for the user's example:
            # "RESTful services using Spring Framework" and "Spring Boot REST API"
            if "spring" in c_norm and "spring" in t_norm:
                if "rest" in c_norm and "rest" in t_norm:
                    return 0.92, f"Recognized '{candidate_skill}' as covering '{target_skill}' (Spring REST microservices ecosystem)."
                return 0.85, f"Strong ecosystem alignment: '{candidate_skill}' shares core architecture with '{target_skill}'."

        # 3. Direct substring containment
        if t_norm in c_norm or c_norm in t_norm:
            longer = max(len(t_norm), len(c_norm))
            shorter = min(len(t_norm), len(c_norm))
            ratio = shorter / longer
            score = max(0.80, min(0.95, 0.70 + (ratio * 0.25)))
            return score, f"'{candidate_skill}' satisfies requirements for '{target_skill}'."

        # 4. Token Overlap / Jaccard similarity
        c_tokens = get_tokens(candidate_skill)
        t_tokens = get_tokens(target_skill)

        if not c_tokens or not t_tokens:
            return 0.0, "No semantic connection found."

        intersection = c_tokens.intersection(t_tokens)
        union = c_tokens.union(t_tokens)
        jaccard = len(intersection) / len(union) if union else 0.0

        if jaccard >= 0.5:
            score = 0.75 + (jaccard * 0.20)
            return round(score, 2), f"High semantic token overlap ({', '.join(intersection)}) between skills."
        elif jaccard > 0:
            score = 0.50 + (jaccard * 0.25)
            return round(score, 2), f"Partial overlap in foundational concept ({', '.join(intersection)})."

        # 5. Check if they are related technologies in knowledge graph
        for key, info in CANONICAL_SKILL_KNOWLEDGE.items():
            if key in t_norm:
                related = [r.lower() for r in info.get("related", [])]
                if any(r in c_norm for r in related):
                    return 0.55, f"Candidate has prerequisite capability '{candidate_skill}' related to '{target_skill}'."

        return 0.0, "Skill gap identified."

    @classmethod
    def analyze_skill_gap(cls, user_skills: List[str], required_skills: List[str], role_title: str) -> Dict[str, Any]:
        """
        Compares user's extracted skills against the target role's required skills.
        Identifies matched, partial, and missing skills, calculates priorities and justifications.
        """
        matched_results = []
        missing_results = []
        all_user_skills_clean = [s.strip() for s in user_skills if s and s.strip()]

        for req in required_skills:
            best_score = 0.0
            best_match_skill = None
            best_reason = ""

            # Compare against each user skill
            for user_skill in all_user_skills_clean:
                score, reason = cls.compute_similarity(user_skill, req)
                if score > best_score:
                    best_score = score
                    best_match_skill = user_skill
                    best_reason = reason

            # Retrieve taxonomy information for why this skill is important
            taxonomy_info = None
            req_lower = req.lower()
            for key, info in CANONICAL_SKILL_KNOWLEDGE.items():
                if key in req_lower or req_lower in key:
                    taxonomy_info = info
                    break

            category = taxonomy_info["category"] if taxonomy_info else "Technical Skill"
            why_important = taxonomy_info["why_important"] if taxonomy_info else f"Crucial component for success in {role_title}."
            default_priority = taxonomy_info["importance"] if taxonomy_info else "Medium"

            if best_score >= 0.75:
                # Fully matched
                matched_results.append({
                    "skill_name": req,
                    "user_skill_matched": best_match_skill,
                    "similarity_score": round(best_score, 2),
                    "status": "matched",
                    "priority": default_priority,
                    "category": category,
                    "reason": best_reason
                })
            elif best_score >= 0.40:
                # Partially matched
                matched_results.append({
                    "skill_name": req,
                    "user_skill_matched": best_match_skill,
                    "similarity_score": round(best_score, 2),
                    "status": "partial",
                    "priority": default_priority,
                    "category": category,
                    "reason": f"Partial capability: {best_reason}. Needs focused practice to achieve production level."
                })
            else:
                # Missing skill
                # Calculate priority dynamically:
                # If first 4 core skills of role, prioritize as High
                idx = required_skills.index(req)
                priority = "High" if idx < 4 else default_priority

                missing_results.append({
                    "skill_name": req,
                    "user_skill_matched": None,
                    "similarity_score": 0.0,
                    "status": "missing",
                    "priority": priority,
                    "category": category,
                    "reason": why_important
                })

        total_req = len(required_skills)
        matched_count = len([m for m in matched_results if m["status"] == "matched"])
        partial_count = len([m for m in matched_results if m["status"] == "partial"])
        
        # Effective match percentage (full match = 100%, partial = 50%)
        effective_matched = matched_count + (partial_count * 0.5)
        match_percentage = round((effective_matched / total_req * 100), 1) if total_req > 0 else 0.0

        high_priority_missing = [
            m["skill_name"] for m in missing_results if m["priority"].lower() == "high"
        ]

        return {
            "role_title": role_title,
            "total_required": total_req,
            "matched_count": len(matched_results),
            "missing_count": len(missing_results),
            "match_percentage": match_percentage,
            "matched_skills": matched_results,
            "missing_skills": missing_results,
            "current_skills": all_user_skills_clean,
            "high_priority_missing": high_priority_missing
        }
