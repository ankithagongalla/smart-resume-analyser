# =========================================================
# SKILL MAPPER
# Maps resume skills to O*NET skills and technologies
# =========================================================

import re


# ---------------------------------------------------------
# NORMALIZE SKILL NAME
# ---------------------------------------------------------

def normalize_skill(skill):

    if not skill:
        return ""

    skill = str(skill).lower().strip()

    replacements = {
        "javascript": "js",
        "java script": "js",
        "typescript": "ts",

        "react.js": "react",
        "reactjs": "react",

        "node.js": "node",
        "nodejs": "node",

        "express.js": "express",
        "expressjs": "express",

        "mongodb": "mongo",

        "postgresql": "postgres",

        "mysql database": "mysql",

        "git version control": "git",
        "github": "git",

        "html5": "html",
        "css3": "css",
    }

    skill = replacements.get(skill, skill)

    # Remove punctuation except + and #
    skill = re.sub(r"[^a-z0-9+#.\s]", "", skill)

    # Remove extra spaces
    skill = re.sub(r"\s+", " ", skill).strip()

    return skill


# ---------------------------------------------------------
# RELATED SKILL GROUPS
# ---------------------------------------------------------

SKILL_GROUPS = {

    # -----------------------------------------------------
    # FRONTEND
    # -----------------------------------------------------

    "html": {
        "html",
        "html5",
        "web page creation",
        "web page creation and editing",
        "web page creation and editing software",
    },

    "css": {
        "css",
        "css3",
        "stylesheet",
        "web styling",
    },

    "javascript": {
        "javascript",
        "js",
        "ecmascript",
    },

    "typescript": {
        "typescript",
        "ts",
    },

    "react": {
        "react",
        "reactjs",
        "react.js",
    },

    # -----------------------------------------------------
    # BACKEND
    # -----------------------------------------------------

    "node": {
        "node",
        "nodejs",
        "node.js",
    },

    "express": {
        "express",
        "expressjs",
        "express.js",
    },

    "python": {
        "python",
        "python programming",
    },

    "java": {
        "java",
        "java programming",
    },

    # -----------------------------------------------------
    # DATABASE
    # -----------------------------------------------------

    "sql": {
        "sql",
        "mysql",
        "postgres",
        "postgresql",
        "database query",
        "database user interface and query",
        "database user interface and query software",
    },

    "database": {
        "database",
        "database management",
        "dbms",
        "database management system",
        "database management system software",
    },

    "mongo": {
        "mongo",
        "mongodb",
    },

    # -----------------------------------------------------
    # VERSION CONTROL
    # -----------------------------------------------------

    "git": {
        "git",
        "github",
        "version control",
        "file versioning",
        "file versioning software",
    },

    # -----------------------------------------------------
    # CLOUD
    # -----------------------------------------------------

    "cloud": {
        "cloud",
        "cloud computing",
        "cloud-based management",
        "cloud-based management software",
        "cloud-based data access and sharing",
        "cloud-based data access and sharing software",
    },

    # -----------------------------------------------------
    # TESTING
    # -----------------------------------------------------

    "testing": {
        "testing",
        "software testing",
        "program testing",
        "program testing software",
    },

    # -----------------------------------------------------
    # API
    # -----------------------------------------------------

    "api": {
        "api",
        "rest api",
        "restful api",
        "web api",
    },

    # -----------------------------------------------------
    # SECURITY
    # -----------------------------------------------------

    "security": {
        "security",
        "web security",
        "cybersecurity",
        "application security",
    },

    # -----------------------------------------------------
    # DEVELOPMENT ENVIRONMENT
    # -----------------------------------------------------

    "development_environment": {
        "development environment",
        "development environment software",
        "ide",
        "integrated development environment",
        "vs code",
        "visual studio code",
    },

    # -----------------------------------------------------
    # WEB PLATFORM
    # -----------------------------------------------------

    "web_platform": {
        "web platform",
        "web platform development",
        "web platform development software",
        "web development",
        "web development software",
    },

    # -----------------------------------------------------
    # WEB PAGE
    # -----------------------------------------------------

    "web_page": {
        "web page",
        "web pages",
        "web page creation",
        "web page creation and editing",
        "web page creation and editing software",
        "website development",
        "website creation",
    },

    # -----------------------------------------------------
    # OBJECT ORIENTED DEVELOPMENT
    # -----------------------------------------------------

    "object_oriented": {
        "object oriented programming",
        "object oriented development",
        "object or component oriented development",
        "object or component oriented development software",
        "oop",
    },

    # -----------------------------------------------------
    # APPLICATION SERVER
    # -----------------------------------------------------

    "application_server": {
        "application server",
        "application server software",
    },

    # -----------------------------------------------------
    # OPERATING SYSTEM
    # -----------------------------------------------------

    "operating_system": {
        "operating system",
        "operating system software",
        "windows",
        "linux",
        "ubuntu",
        "macos",
    },

    # -----------------------------------------------------
    # BUSINESS INTELLIGENCE
    # -----------------------------------------------------

    "business_intelligence": {
        "business intelligence",
        "business intelligence software",
        "business intelligence and data analysis",
        "business intelligence and data analysis software",
        "power bi",
        "tableau",
    },

    # -----------------------------------------------------
    # DATA ANALYSIS
    # -----------------------------------------------------

    "data_analysis": {
        "data analysis",
        "data analytics",
        "analytical software",
        "analytical or scientific software",
    },

    # -----------------------------------------------------
    # FILE VERSIONING
    # -----------------------------------------------------

    "version_control": {
        "version control",
        "git",
        "github",
        "file versioning",
        "file versioning software",
    },

    # -----------------------------------------------------
    # PROJECT MANAGEMENT
    # -----------------------------------------------------

    "project_management": {
        "project management",
        "project management software",
    },
}


# ---------------------------------------------------------
# FIND CONCEPT
# ---------------------------------------------------------

def find_skill_concept(skill):

    normalized = normalize_skill(skill)

    if not normalized:
        return None

    for concept, aliases in SKILL_GROUPS.items():

        normalized_aliases = {
            normalize_skill(alias)
            for alias in aliases
        }

        if normalized in normalized_aliases:
            return concept

    return None


# ---------------------------------------------------------
# EXPLICIT O*NET RELATIONSHIPS
# ---------------------------------------------------------

RELATED_CONCEPTS = {

    # Resume HTML
    # → O*NET web page creation
    "html": {
        "web_page",
    },

    # Resume JavaScript
    # → O*NET web platform development
    "javascript": {
        "web_platform",
    },

    # Resume TypeScript
    # → O*NET web platform development
    "typescript": {
        "web_platform",
    },

    # Resume React
    # → O*NET web platform development
    "react": {
        "web_platform",
    },

    # Resume Node
    # → O*NET application server / web platform
    "node": {
        "application_server",
        "web_platform",
    },

    # Resume Git
    # → O*NET file versioning
    "git": {
        "version_control",
    },

    # Resume SQL
    # → O*NET database technologies
    "sql": {
        "database_query",
        "database_management",
    },

    # Resume database knowledge
    "database": {
        "database_management",
        "database_query",
    },

    # Resume Python
    # → O*NET development environment
    "python": {
        "development_environment",
    },

    # Resume Java
    "java": {
        "development_environment",
        "object_oriented",
    },

    # Resume cloud
    "cloud": {
        "cloud_management",
        "cloud_data_access",
    },

    # Resume testing
    "testing": {
        "program_testing",
    },

    # Resume security
    "security": {
        "security",
    },

    # Resume Power BI
    "business_intelligence": {
        "business_intelligence",
    },

    # Resume data analysis
    "data_analysis": {
        "analytical_software",
    },

    # Resume VS Code
    "development_environment": {
        "development_environment",
    },

    # Resume Linux / Windows etc.
    "operating_system": {
        "operating_system",
    },

    # Resume OOP
    "object_oriented": {
        "object_oriented",
    },
}


# ---------------------------------------------------------
# NORMALIZED O*NET CONCEPT NAMES
# ---------------------------------------------------------

ONET_CONCEPTS = {

    "web page creation and editing software":
        "web_page",

    "web platform development software":
        "web_platform",

    "file versioning software":
        "version_control",

    "database user interface and query software":
        "database_query",

    "data base user interface and query software":
        "database_query",

    "database management system software":
        "database_management",

    "data base management system software":
        "database_management",

    "object oriented database management software":
        "database_management",

    "object oriented data base management software":
        "database_management",

    "object or component oriented development software":
        "object_oriented",

    "development environment software":
        "development_environment",

    "program testing software":
        "program_testing",

    "application server software":
        "application_server",

    "operating system software":
        "operating_system",

    "business intelligence and data analysis software":
        "business_intelligence",

    "analytical or scientific software":
        "analytical_software",

    "cloud-based management software":
        "cloud_management",

    "cloud-based data access and sharing software":
        "cloud_data_access",

    "project management software":
        "project_management",
}


# ---------------------------------------------------------
# GET O*NET CONCEPT
# ---------------------------------------------------------

def find_onet_concept(skill):

    normalized = normalize_skill(skill)

    if normalized in ONET_CONCEPTS:
        return ONET_CONCEPTS[normalized]

    return find_skill_concept(normalized)


# ---------------------------------------------------------
# COMPARE TWO SKILLS
# ---------------------------------------------------------

def compare_skills(resume_skill, required_skill):

    resume_normalized = normalize_skill(resume_skill)
    required_normalized = normalize_skill(required_skill)

    # -----------------------------------------------------
    # 1. Exact match
    # -----------------------------------------------------

    if resume_normalized == required_normalized:
        return "exact"

    # -----------------------------------------------------
    # 2. Find concepts
    # -----------------------------------------------------

    resume_concept = find_skill_concept(
        resume_normalized
    )

    required_concept = find_onet_concept(
        required_normalized
    )

    # -----------------------------------------------------
    # 3. Same concept
    # -----------------------------------------------------

    if (
        resume_concept
        and required_concept
        and resume_concept == required_concept
    ):
        return "related"

    # -----------------------------------------------------
    # 4. Explicit relationship
    # -----------------------------------------------------

    if resume_concept and required_concept:

        allowed_related = RELATED_CONCEPTS.get(
            resume_concept,
            set()
        )

        if required_concept in allowed_related:
            return "related"

    # -----------------------------------------------------
    # 5. Partial textual match
    # -----------------------------------------------------

    if (
        resume_normalized
        and required_normalized
        and (
            resume_normalized in required_normalized
            or required_normalized in resume_normalized
        )
    ):
        return "partial"

    # -----------------------------------------------------
    # 6. No match
    # -----------------------------------------------------

    return "missing"


# ---------------------------------------------------------
# MAP REQUIRED SKILLS
# ---------------------------------------------------------

def map_required_skills(
    resume_skills,
    required_skills
):

    results = []

    # Make sure resume_skills is a list
    if not resume_skills:
        resume_skills = []

    for required in required_skills:

        best_match = None
        best_type = "missing"

        priority = {
            "exact": 3,
            "related": 2,
            "partial": 1,
            "missing": 0
        }

        for resume_skill in resume_skills:

            match_type = compare_skills(
                resume_skill,
                required
            )

            if priority[match_type] > priority[best_type]:

                best_type = match_type
                best_match = resume_skill

        results.append({

            "required_skill": required,

            "status": (
                "matched"
                if best_type != "missing"
                else "missing"
            ),

            "match_type": best_type,

            "resume_evidence": best_match

        })

    return results