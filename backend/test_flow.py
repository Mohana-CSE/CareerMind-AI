import urllib.request
import json

def get(url):
    req = urllib.request.Request(url)
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

def post(url, data=None):
    body = json.dumps(data or {}).encode('utf-8')
    req = urllib.request.Request(url, data=body, headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())

print("--- 1. Testing Roles Catalog ---")
roles = get("http://127.0.0.1:8001/api/roles/")
print(f"Success: {len(roles)} engineering roles loaded.")

print("--- 2. Testing Sample Resume Upload & Extraction ---")
resume = post("http://127.0.0.1:8001/api/resume/sample-demo")
print(f"Success: Extracted {len(resume.get('skills', []))} skills: {resume.get('skills', [])}")

print("--- 3. Testing Semantic Skill Gap Analysis (Java Full Stack) ---")
gap = get("http://127.0.0.1:8001/api/skill-gap/analyze?role_id=java-fullstack")
print(f"Success: Role: {gap['role_title']}")
print(f"Match %: {gap['match_percentage']}%")
print(f"Matched Skills count: {gap['matched_count']}")
print(f"Missing Skills count: {gap['missing_count']}")
print(f"Sample Matched Reason: {gap['matched_skills'][0]['reason']}")

print("--- 4. Testing Career Readiness Score ---")
readiness = get("http://127.0.0.1:8001/api/readiness/score?role_id=java-fullstack")
print(f"Success: Readiness Score = {readiness['overall_score']}/100, Tier: {readiness['tier']}")
print(f"Breakdown: {readiness['breakdown']}")

print("--- 5. Testing Adaptive Roadmap ---")
roadmap = get("http://127.0.0.1:8001/api/roadmap/current?role_id=java-fullstack")
print(f"Success: Generated {len(roadmap['milestones'])} Milestones with {roadmap['total_tasks']} total tasks.")
first_m = roadmap['milestones'][0]
print(f"Phase 1: {first_m['title']} (Skill: {first_m['skill_focus']}, Tasks: {len(first_m['practice_tasks'])})")

print("--- 6. Testing Progress Adaptation on Task Completion ---")
task_id = first_m['practice_tasks'][0]['id']
updated_roadmap = post(
    "http://127.0.0.1:8001/api/roadmap/task-progress?role_id=java-fullstack",
    {"milestone_id": first_m['id'], "task_id": task_id, "completed": True}
)
print(f"Success: Task marked complete. Overall Roadmap Progress: {updated_roadmap['overall_progress']}%")

print("--- 7. Testing Job Opportunities Matching ---")
jobs = get("http://127.0.0.1:8001/api/jobs/matched?role_id=java-fullstack")
print(f"Success: Found {len(jobs)} matched job opportunities.")
for j in jobs[:2]:
    print(f"  • {j['title']} @ {j['company']} ({j['match_percentage']}% match, {len(j['matched_skills'])} matched, {len(j['missing_skills'])} missing)")

print("\n>>> ALL API TESTS PASSED SUCCESSFULLY! <<<")
