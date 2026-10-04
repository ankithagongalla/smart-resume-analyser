# =========================================================
# SKILL ANALYZER
# =========================================================

from services.skill_normalizer import normalize_skill_name


# =========================================================
# ANALYZE SKILL GAP
# =========================================================

def analyze_skill_gap(resume_skills, required_skills):
    """
    Compare resume skills with career-required skills.

    Returns:
        matched_skills
        missing_skills
        readiness
    """

    # -----------------------------------------------------
    # SAFETY
    # -----------------------------------------------------

    if not isinstance(resume_skills, list):
        resume_skills = []

    if not isinstance(required_skills, list):
        required_skills = []

    # -----------------------------------------------------
    # NORMALIZE RESUME SKILLS
    # -----------------------------------------------------

    normalized_resume = set()

    for skill in resume_skills:

        if not skill:
            continue

        normalized = normalize_skill_name(skill)

        if normalized:
            normalized_resume.add(normalized)

    # -----------------------------------------------------
    # COMPARE SKILLS
    # -----------------------------------------------------

    matched_skills = []
    missing_skills = []

    for required in required_skills:

        # Support both:
        # "Python"
        #
        # OR:
        # {
        #   "name": "Python",
        #   "category": "Programming",
        #   "importance": "High"
        # }

        if isinstance(required, dict):

            skill_name = required.get("name", "")

            category = required.get(
                "category",
                ""
            )

            importance = required.get(
                "importance",
                "Medium"
            )

        else:

            skill_name = str(required)

            category = ""

            importance = "Medium"

        if not skill_name:
            continue

        normalized_required = normalize_skill_name(
            skill_name
        )

        skill_data = {

            "name": skill_name,

            "category": category,

            "importance": importance

        }

        # -------------------------------------------------
        # MATCHED
        # -------------------------------------------------

        if normalized_required in normalized_resume:

            matched_skills.append(
                skill_data
            )

        # -------------------------------------------------
        # MISSING
        # -------------------------------------------------

        else:

            missing_skills.append(
                skill_data
            )

    # -----------------------------------------------------
    # READINESS
    # -----------------------------------------------------

    total_skills = (
        len(matched_skills)
        + len(missing_skills)
    )

    if total_skills > 0:

        readiness = round(
            (
                len(matched_skills)
                / total_skills
            ) * 100
        )

    else:

        readiness = 0

    # -----------------------------------------------------
    # RESULT
    # -----------------------------------------------------

    return {

        "matched_skills":
            matched_skills,

        "missing_skills":
            missing_skills,

        "matched_count":
            len(matched_skills),

        "missing_count":
            len(missing_skills),

        "total_skills":
            total_skills,

        "readiness":
            readiness

    }


# =========================================================
# SIMPLE SKILL EXTRACTION
# =========================================================

def extract_skills(text, skill_list=None):
    """
    Extract known skills from resume text.
    """

    if not text:
        return []

    if skill_list is None:

        skill_list = [

            "Python",
            "Java",
            "C",
            "C++",
            "C#",
            "JavaScript",
            "TypeScript",

            "HTML",
            "HTML5",
            "CSS",
            "CSS3",
            "React",
            "React.js",
            "Angular",
            "Vue.js",
            "Node.js",
            "Express.js",
            "REST API",

            "SQL",
            "MySQL",
            "PostgreSQL",
            "MongoDB",
            "Oracle",

            "Git",
            "GitHub",
            "Docker",
            "Kubernetes",

            "Excel",
            "Power BI",
            "Tableau",
            "Pandas",
            "NumPy",

            "Machine Learning",
            "Deep Learning",
            "Artificial Intelligence",
            "AI",
            "NLP",
            "TensorFlow",
            "PyTorch",
            "Scikit-learn",
            "OpenCV",

            "AWS",
            "Azure",
            "Google Cloud",

            "Data Structures",
            "Algorithms",
            "DSA",
            "OOP",
            "Object Oriented Programming",

            "Operating Systems",
            "DBMS",
            "Computer Networks"

        ]

    text_lower = text.lower()

    found = []

    for skill in skill_list:

        if skill.lower() in text_lower:

            normalized = normalize_skill_name(
                skill
            )

            if normalized not in [
                normalize_skill_name(item)
                for item in found
            ]:

                found.append(skill)

    return found