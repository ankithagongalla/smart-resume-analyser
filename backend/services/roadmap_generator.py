# =========================================================
# PERSONALIZED CAREER ROADMAP GENERATOR
# Evidence-aware skill-gap based roadmap
# =========================================================


# =========================================================
# RESOURCE DATABASE
# =========================================================

def get_resource(skill_name):

    skill = str(skill_name).strip().lower()

    resources = {

        "javascript": {
            "provider": "MDN Web Docs",
            "resource": "JavaScript Guide",
            "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
            "practice": "Build an interactive JavaScript web application."
        },

        "python": {
            "provider": "Python Official",
            "resource": "Python Tutorial",
            "url": "https://docs.python.org/3/tutorial/",
            "practice": "Build a small Python application using functions and data structures."
        },

        "sql": {
            "provider": "W3Schools",
            "resource": "SQL Tutorial",
            "url": "https://www.w3schools.com/sql/",
            "practice": "Create a database and solve SQL queries using joins and aggregation."
        },

        "react": {
            "provider": "React Official",
            "resource": "React Learn",
            "url": "https://react.dev/learn",
            "practice": "Build a React dashboard using components, state and API calls."
        },

        "html": {
            "provider": "MDN Web Docs",
            "resource": "HTML Basics",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
            "practice": "Create a responsive multi-page website using HTML."
        },

        "css": {
            "provider": "MDN Web Docs",
            "resource": "CSS Basics",
            "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
            "practice": "Create a responsive website using CSS layouts and animations."
        },

        "node.js": {
            "provider": "Node.js Official",
            "resource": "Learn Node.js",
            "url": "https://nodejs.org/learn",
            "practice": "Build a REST API using Node.js and Express."
        },

        "nodejs": {
            "provider": "Node.js Official",
            "resource": "Learn Node.js",
            "url": "https://nodejs.org/learn",
            "practice": "Build a REST API using Node.js and Express."
        },

        "mongodb": {
            "provider": "MongoDB University",
            "resource": "MongoDB Skills",
            "url": "https://learn.mongodb.com/skills",
            "practice": "Create a MongoDB database and perform CRUD operations."
        }
    }

    return resources.get(
        skill,
        {
            "provider": "Recommended Learning",
            "resource": f"{skill_name} learning resources",
            "url": None,
            "practice": f"Build a small practical project using {skill_name}."
        }
    )


# =========================================================
# NORMALIZE SKILL
# =========================================================

def normalize_skill(skill):

    if isinstance(skill, dict):

        return (
            skill.get("required_skill")
            or skill.get("name")
            or skill.get("skill")
            or "Unknown Skill"
        )

    return str(skill).strip()


# =========================================================
# DETERMINE CATEGORY
# =========================================================

def determine_category(skill):

    name = str(skill).lower()

    # IMPORTANT:
    # Check specific categories before generic
    # "development" / "software" matching.

    if any(word in name for word in [
        "web",
        "html",
        "css",
        "javascript",
        "react",
        "web page",
        "web platform"
    ]):
        return "Web Development"

    if any(word in name for word in [
        "database",
        "data base",
        "sql",
        "mongodb"
    ]):
        return "Database"

    if any(word in name for word in [
        "programming",
        "coding",
        "software development",
        "development"
    ]):
        return "Programming"

    if any(word in name for word in [
        "git",
        "version",
        "operating system",
        "server",
        "application server"
    ]):
        return "Tools"

    if any(word in name for word in [
        "ai",
        "machine learning",
        "artificial intelligence"
    ]):
        return "AI / ML"

    if any(word in name for word in [
        "cloud",
        "aws",
        "azure"
    ]):
        return "Cloud"

    return "Other"


# =========================================================
# DETERMINE IMPORTANCE
# =========================================================

def determine_importance(
    skill,
    original_skill=None
):

    if isinstance(original_skill, dict):

        importance = original_skill.get(
            "importance"
        )

        if importance:
            return importance

    name = str(skill).lower()

    high_priority = [

        "programming",
        "javascript",
        "python",
        "sql",
        "database",
        "web platform",
        "web page",
        "development",
        "software"
    ]

    for item in high_priority:

        if item in name:
            return "High"

    return "Medium"


# =========================================================
# CAREER NAME
# =========================================================

def get_career_name(career):

    if isinstance(career, dict):

        return (
            career.get("name")
            or career.get("title")
            or career.get("career_name")
            or ""
        )

    if isinstance(career, str):
        return career

    return ""


# =========================================================
# GENERATE ROADMAP
# =========================================================

def generate_roadmap(
    missing_skills,
    career=None,
    readiness_score=None
):

    # -----------------------------------------------------
    # No skill gaps
    # -----------------------------------------------------

    if not missing_skills:

        return {

            "success": True,

            "message":
                "No skill gaps found.",

            "career_name":
                get_career_name(career),

            "total_steps": 0,

            "roadmap": [],

            "progress": 100
        }

    # -----------------------------------------------------
    # Learning order
    # -----------------------------------------------------

    category_order = {

        "Programming": 1,

        "Web Development": 2,

        "Database": 3,

        "Tools": 4,

        "AI / ML": 5,

        "Cloud": 6,

        "Other": 7
    }

    normalized = []

    # -----------------------------------------------------
    # Normalize missing skills
    # -----------------------------------------------------

    for item in missing_skills:

        skill_name = normalize_skill(item)

        if not skill_name:
            continue

        category = determine_category(
            skill_name
        )

        importance = determine_importance(
            skill_name,
            item
        )

        normalized.append({

            "skill": skill_name,

            "category": category,

            "importance": importance,

            "original": item
        })

    # -----------------------------------------------------
    # Sort by importance and category
    # -----------------------------------------------------

    normalized = sorted(

        normalized,

        key=lambda item: (
            0
            if item["importance"] == "High"
            else 1,

            category_order.get(
                item["category"],
                99
            )
        )
    )

    # -----------------------------------------------------
    # Remove duplicate skills
    # -----------------------------------------------------

    unique_skills = []

    seen = set()

    for item in normalized:

        key = item["skill"].strip().lower()

        if key in seen:
            continue

        seen.add(key)

        unique_skills.append(item)

    # -----------------------------------------------------
    # Create roadmap
    # -----------------------------------------------------

    roadmap = []

    for index, item in enumerate(
        unique_skills,
        start=1
    ):

        skill_name = item["skill"]

        category = item["category"]

        importance = item["importance"]

        original = item["original"]

        resource = get_resource(
            skill_name
        )

        # -------------------------------------------------
        # Evidence information
        # -------------------------------------------------

        gap_status = "Missing"

        match_type = "missing"

        if isinstance(original, dict):

            gap_status = original.get(
                "status",
                "missing"
            )

            match_type = original.get(
                "match_type",
                "missing"
            )

        # -------------------------------------------------
        # Objective
        # -------------------------------------------------

        objective = (
            f"Learn the fundamentals of "
            f"{skill_name} and apply it "
            f"in a practical {category.lower()} project."
        )

        # -------------------------------------------------
        # Roadmap step
        # -------------------------------------------------

        roadmap.append({

            "step": index,

            "skill": skill_name,

            "category": category,

            "importance": importance,

            "gap_status": gap_status,

            "match_type": match_type,

            "objective": objective,

            "learning_resource": {

                "provider":
                    resource["provider"],

                "name":
                    resource["resource"],

                "url":
                    resource["url"]
            },

            "practice_project":
                resource["practice"],

            "assessment": {

                "type":
                    "Self Assessment",

                "status":
                    "Not Started",

                "score":
                    None
            },

            "progress": 0,

            "status":
                "Not Started"
        })

    # -----------------------------------------------------
    # Final response
    # -----------------------------------------------------

    return {

        "success": True,

        "message":
            "Personalized evidence-based "
            "career roadmap generated successfully.",

        "career_name":
            get_career_name(career),

        "career":
            career,

        "readiness_score":
            readiness_score,

        "total_steps":
            len(roadmap),

        "progress":
            0,

        "roadmap":
            roadmap
    }