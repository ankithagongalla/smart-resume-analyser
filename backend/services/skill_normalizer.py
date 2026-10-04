# =========================================================
# SKILL NORMALIZER
# =========================================================
# Converts different names/variations of the same skill
# into one standard skill name.
# =========================================================


# =========================================================
# SKILL ALIASES
# =========================================================

SKILL_ALIASES = {

    # -----------------------------------------------------
    # PROGRAMMING
    # -----------------------------------------------------

    "python": "python",

    "java": "java",

    "c": "c",

    "c++": "c++",
    "cpp": "c++",
    "c plus plus": "c++",

    "c#": "c#",
    "c sharp": "c#",

    "javascript": "javascript",
    "java script": "javascript",
    "js": "javascript",

    "typescript": "typescript",
    "type script": "typescript",


    # -----------------------------------------------------
    # WEB DEVELOPMENT
    # -----------------------------------------------------

    "html": "html",
    "html5": "html",
    "hypertext markup language": "html",

    "css": "css",
    "css3": "css",
    "cascading style sheets": "css",

    "react": "react",
    "react.js": "react",
    "reactjs": "react",
    "react js": "react",

    "angular": "angular",
    "angular.js": "angular",
    "angularjs": "angular",

    "vue": "vue.js",
    "vue.js": "vue.js",
    "vuejs": "vue.js",

    "node": "node.js",
    "node.js": "node.js",
    "nodejs": "node.js",

    "express": "express.js",
    "express.js": "express.js",
    "expressjs": "express.js",

    "rest api": "rest api",
    "rest apis": "rest api",
    "restful api": "rest api",
    "restful apis": "rest api",

    "responsive web design": "responsive web design",
    "responsive design": "responsive web design",


    # -----------------------------------------------------
    # DATABASE
    # -----------------------------------------------------

    "sql": "sql",
    "structured query language": "sql",

    "mysql": "mysql",
    "my sql": "mysql",

    "postgresql": "postgresql",
    "postgres": "postgresql",

    "mongodb": "mongodb",
    "mongo db": "mongodb",
    "mongo": "mongodb",

    "oracle": "oracle",
    "oracle database": "oracle",


    # -----------------------------------------------------
    # TOOLS
    # -----------------------------------------------------

    "git": "git",
    "git scm": "git",

    "github": "github",
    "git hub": "github",

    "vs code": "vs code",
    "vscode": "vs code",
    "visual studio code": "vs code",

    "docker": "docker",

    "kubernetes": "kubernetes",
    "k8s": "kubernetes",


    # -----------------------------------------------------
    # DATA / ANALYTICS
    # -----------------------------------------------------

    "excel": "excel",
    "microsoft excel": "excel",

    "power bi": "power bi",
    "powerbi": "power bi",

    "tableau": "tableau",

    "pandas": "pandas",

    "numpy": "numpy",

    "data visualization": "data visualization",


    # -----------------------------------------------------
    # AI / MACHINE LEARNING
    # -----------------------------------------------------

    "artificial intelligence": "artificial intelligence",
    "artificial intelligence (ai)": "artificial intelligence",
    "ai": "artificial intelligence",

    "machine learning": "machine learning",
    "machine-learning": "machine learning",
    "ml": "machine learning",

    "deep learning": "deep learning",
    "deep-learning": "deep learning",
    "dl": "deep learning",

    "natural language processing": "nlp",
    "natural language processing (nlp)": "nlp",
    "nlp": "nlp",

    "tensorflow": "tensorflow",
    "tensor flow": "tensorflow",

    "pytorch": "pytorch",

    "scikit-learn": "scikit-learn",
    "scikit learn": "scikit-learn",
    "sklearn": "scikit-learn",

    "opencv": "opencv",
    "open cv": "opencv",


    # -----------------------------------------------------
    # CLOUD
    # -----------------------------------------------------

    "aws": "aws",
    "amazon web services": "aws",

    "azure": "azure",
    "microsoft azure": "azure",

    "google cloud": "google cloud",
    "google cloud platform": "google cloud",
    "gcp": "google cloud",


    # -----------------------------------------------------
    # COMPUTER SCIENCE
    # -----------------------------------------------------

    "data structure": "data structures",
    "data structures": "data structures",

    "dsa": "data structures",

    "algorithm": "algorithms",
    "algorithms": "algorithms",

    "object oriented programming":
        "object oriented programming",

    "object-oriented programming":
        "object oriented programming",

    "oop":
        "object oriented programming",

    "operating system":
        "operating systems",

    "operating systems":
        "operating systems",

    "os":
        "operating systems",

    "database management system":
        "dbms",

    "database management systems":
        "dbms",

    "dbms":
        "dbms",

    "computer networks":
        "computer networks",

    "computer networking":
        "computer networks",


    # -----------------------------------------------------
    # MECHANICAL
    # -----------------------------------------------------

    "autocad": "autocad",
    "auto cad": "autocad",

    "solidworks": "solidworks",
    "solid works": "solidworks",

    "catia": "catia",

    "mechanical design":
        "mechanical design",

    "engineering drawing":
        "engineering drawing",

    "gd&t":
        "gd&t",

    "geometric dimensioning and tolerancing":
        "gd&t",

    "manufacturing processes":
        "manufacturing processes",


    # -----------------------------------------------------
    # CIVIL
    # -----------------------------------------------------

    "staad.pro": "staad.pro",
    "staad pro": "staad.pro",

    "structural analysis":
        "structural analysis",

    "surveying":
        "surveying",

    "revit":
        "revit",

    "quantity estimation":
        "quantity estimation",

    "construction management":
        "construction management",


    # -----------------------------------------------------
    # ELECTRICAL
    # -----------------------------------------------------

    "matlab": "matlab",
    "mat lab": "matlab",

    "simulink": "simulink",

    "circuit design":
        "circuit design",

    "circuit designing":
        "circuit design",

    "power system":
        "power systems",

    "power systems":
        "power systems",

    "control system":
        "control systems",

    "control systems":
        "control systems",

    "plc": "plc",

    "programmable logic controller":
        "plc",

    "electrical machines":
        "electrical machines",


    # -----------------------------------------------------
    # ELECTRONICS / EMBEDDED
    # -----------------------------------------------------

    "embedded system":
        "embedded systems",

    "embedded systems":
        "embedded systems",

    "microcontroller":
        "microcontrollers",

    "microcontrollers":
        "microcontrollers",

    "arduino":
        "arduino",

    "raspberry pi":
        "raspberry pi",
}


# =========================================================
# NORMALIZE ONE SKILL
# =========================================================

def normalize_skill(skill):

    if skill is None:
        return ""

    value = str(skill).strip().lower()

    if not value:
        return ""

    return SKILL_ALIASES.get(
        value,
        value
    )


# =========================================================
# COMPATIBILITY FUNCTION
# =========================================================
# Your existing skill_analyzer.py expects this name.
# Keep it so we don't have to change other files.
# =========================================================

def normalize_skill_name(skill):

    return normalize_skill(skill)


# =========================================================
# NORMALIZE MULTIPLE SKILLS
# =========================================================

def normalize_skills(skills):

    if not isinstance(
        skills,
        list
    ):
        return []

    normalized = []

    for skill in skills:

        value = normalize_skill(
            skill
        )

        if (
            value
            and value not in normalized
        ):

            normalized.append(
                value
            )

    return normalized


# =========================================================
# CHECK TWO SKILLS
# =========================================================

def skills_match(
    skill_a,
    skill_b
):

    normalized_a = normalize_skill(
        skill_a
    )

    normalized_b = normalize_skill(
        skill_b
    )

    return (
        normalized_a != ""
        and normalized_a == normalized_b
    )