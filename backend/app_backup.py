from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import pdfplumber
import re
import os
import tempfile


# =========================================================
# APP SETUP
# =========================================================

app = Flask(__name__)

CORS(app)


# =========================================================
# DATABASE
# =========================================================

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///career_database.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


from models.career_models import db, Career, Skill

db.init_app(app)


# =========================================================
# HOME
# =========================================================

@app.route("/")
def home():

    return jsonify({
        "message": "Smart Resume Analyser Backend is running"
    })


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route("/api/health")
def health():

    return jsonify({
        "status": "success",
        "message": "Backend is connected"
    })


# =========================================================
# GET ALL CAREERS
# =========================================================



# =========================================================
# GET SKILLS FOR ONE CAREER
# =========================================================

@app.route(
    "/api/careers/<int:career_id>/skills",
    methods=["GET"]
)
def get_career_skills(career_id):

    try:

        career = Career.query.get(career_id)

        if career is None:

            return jsonify({
                "success": False,
                "error": "Career not found."
            }), 404

        skills = []

        for skill in career.skills:

            skills.append({
                "id": skill.id,
                "name": skill.name,
                "category": skill.category,
                "importance": skill.importance
            })

        return jsonify({

            "success": True,

            "career": {
                "id": career.id,
                "name": career.name,
                "domain": career.domain,
                "description": career.description
            },

            "skills": skills
        })

    except Exception as error:

        print(
            "CAREER SKILLS API ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


# =========================================================
# PDF TEXT EXTRACTION
# =========================================================

def extract_pdf_text(pdf_path):

    text = ""

    with pdfplumber.open(pdf_path) as pdf:

        for page in pdf.pages:

            page_text = page.extract_text()

            if page_text:

                text += page_text + "\n"

    return text


# =========================================================
# EMAIL
# =========================================================

def extract_email(text):

    match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    return match.group(0) if match else ""


# =========================================================
# PHONE
# =========================================================

def extract_phone(text):

    patterns = [

        r"\+91[\s-]?[6-9]\d{9}",

        r"\b[6-9]\d{9}\b"

    ]

    for pattern in patterns:

        match = re.search(pattern, text)

        if match:

            return match.group(0)

    return ""


# =========================================================
# NAME
# =========================================================

def extract_name(text):

    lines = [

        line.strip()

        for line in text.splitlines()

        if line.strip()

    ]

    for line in lines[:10]:

        if (

            len(line.split()) >= 2

            and len(line) < 60

            and "@" not in line

            and not re.search(r"\d", line)

        ):

            return line

    return ""


# =========================================================
# LOCATION
# =========================================================

def extract_location(text):

    lines = [

        line.strip()

        for line in text.splitlines()

        if line.strip()

    ]

    location_keywords = [

        "hyderabad",
        "telangana",
        "india",
        "bangalore",
        "bengaluru",
        "chennai",
        "mumbai",
        "delhi",
        "pune",
        "warangal"

    ]

    for line in lines[:30]:

        lower = line.lower()

        for location in location_keywords:

            if location in lower:

                return line

    return ""


# =========================================================
# SKILL LIST
# =========================================================

SKILL_LIST = [

    # Programming
    "Python",
    "Java",
    "C",
    "C++",
    "C#",
    "JavaScript",
    "TypeScript",

    # Web
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
    "API",
    "Responsive Web Design",

    # Database
    "SQL",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Oracle",

    # Tools
    "Git",
    "GitHub",
    "VS Code",
    "Docker",
    "Kubernetes",

    # Data
    "Excel",
    "Power BI",
    "Tableau",
    "Pandas",
    "NumPy",

    # AI / ML
    "Machine Learning",
    "Deep Learning",
    "Artificial Intelligence",
    "AI",
    "NLP",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "OpenCV",

    # Cloud
    "AWS",
    "Azure",
    "Google Cloud",

    # Other
    "Data Structures",
    "Algorithms",
    "DSA",
    "OOP",
    "Operating Systems",
    "DBMS",
    "Computer Networks"
]


# =========================================================
# EXTRACT SKILLS
# =========================================================

def extract_skills(text):

    found = []

    text_lower = text.lower()

    for skill in SKILL_LIST:

        if skill.lower() in text_lower:

            if skill not in found:

                found.append(skill)

    return found


# =========================================================
# EDUCATION
# =========================================================

def extract_education(text):

    lines = [

        line.strip()

        for line in text.splitlines()

        if line.strip()

    ]

    education = []

    in_section = False

    stop_sections = [

        "projects",
        "certifications",
        "certification",
        "experience",
        "skills",
        "currently learning"

    ]

    for line in lines:

        lower = line.lower()

        if lower in [
            "education",
            "academic qualifications"
        ]:

            in_section = True

            continue

        if in_section:

            if any(
                lower.startswith(section)
                for section in stop_sections
            ):

                break

            if len(line) > 5:

                education.append({

                    "degree": line,

                    "institution": "",

                    "year": ""

                })

    return education[:10]


# =========================================================
# PROJECTS
# =========================================================

def extract_projects(text):

    lines = [

        line.strip()

        for line in text.splitlines()

        if line.strip()

    ]

    projects = []

    in_projects = False

    stop_sections = [

        "certification",
        "certifications",
        "education",
        "experience",
        "skills",
        "currently learning"

    ]

    i = 0

    while i < len(lines):

        line = lines[i]

        lower = line.lower()

        if lower in ["projects", "project"]:

            in_projects = True

            i += 1

            continue

        if in_projects:

            if any(
                lower.startswith(section)
                for section in stop_sections
            ):

                break

            if len(line) > 4:

                description_parts = []

                j = i + 1

                while j < len(lines):

                    next_line = lines[j]

                    next_lower = next_line.lower()

                    if any(
                        next_lower.startswith(section)
                        for section in stop_sections
                    ):

                        break

                    if next_lower in [
                        "projects",
                        "project"
                    ]:

                        break

                    if len(next_line) > 25:

                        description_parts.append(
                            next_line
                        )

                        j += 1

                    else:

                        break

                projects.append({

                    "name": line,

                    "description": " ".join(
                        description_parts
                    )

                })

                i = j

                continue

        i += 1

    return projects[:10]


# =========================================================
# CERTIFICATIONS
# =========================================================

def extract_certifications(text):

    lines = [

        line.strip()

        for line in text.splitlines()

        if line.strip()

    ]

    certifications = []

    in_section = False

    stop_sections = [

        "projects",
        "education",
        "experience",
        "skills",
        "currently learning"

    ]

    i = 0

    while i < len(lines):

        line = lines[i]

        lower = line.lower()

        if lower in [
            "certifications",
            "certification"
        ]:

            in_section = True

            i += 1

            continue

        if in_section:

            if any(
                lower.startswith(section)
                for section in stop_sections
            ):

                break

            if len(line) > 5:

                if not re.fullmatch(
                    r"\d{1,2}/\d{4}",
                    line
                ):

                    certification_name = line

                    issuer = ""

                    if i + 1 < len(lines):

                        next_line = lines[i + 1]

                        if (
                            len(next_line) > 3
                            and not re.fullmatch(
                                r"\d{1,2}/\d{4}",
                                next_line
                            )
                        ):

                            issuer = next_line

                            i += 1

                    certifications.append({

                        "name": certification_name,

                        "issuer": issuer

                    })

        i += 1

    return certifications[:10]


# =========================================================
# EXPERIENCE
# =========================================================

def extract_experience(text):

    lines = [

        line.strip()

        for line in text.splitlines()

        if line.strip()

    ]

    experience = []

    in_section = False

    for line in lines:

        lower = line.lower()

        if lower in [

            "experience",

            "work experience",

            "internships",

            "internship"

        ]:

            in_section = True

            continue

        if in_section:

            if any(
                lower.startswith(section)
                for section in [
                    "projects",
                    "education",
                    "certifications",
                    "skills"
                ]
            ):

                break

            if len(line) > 5:

                experience.append({

                    "role": line,

                    "company": ""

                })

    return experience[:10]


# =========================================================
# RESUME ANALYSIS API
# =========================================================

@app.route(
    "/api/analyze",
    methods=["POST"]
)
def analyze_resume():

    print(
        "\n=============================="
    )

    print(
        "RESUME ANALYSIS REQUEST"
    )

    print(
        "=============================="
    )

    print(
        "request.files:",
        request.files
    )

    print(
        "request.form:",
        request.form
    )


    # -----------------------------------------------------
    # CHECK FILE
    # -----------------------------------------------------

    if len(request.files) == 0:

        print(
            "NO FILE RECEIVED FROM FRONTEND"
        )

        return jsonify({

            "success": False,

            "error":
                "No resume file received.",

            "received_files":
                list(request.files.keys())

        }), 400


    # -----------------------------------------------------
    # ACCEPT resume OR file
    # -----------------------------------------------------

    resume = request.files.get(
        "resume"
    )

    if resume is None:

        resume = request.files.get(
            "file"
        )


    if resume is None:

        print(
            "FILE EXISTS BUT WRONG FIELD NAME"
        )

        return jsonify({

            "success": False,

            "error":
                "Resume field not found.",

            "received_files":
                list(request.files.keys())

        }), 400


    print(
        "FILE RECEIVED:",
        resume.filename
    )


    # -----------------------------------------------------
    # VALIDATE FILE
    # -----------------------------------------------------

    if resume.filename == "":

        return jsonify({

            "success": False,

            "error":
                "Empty filename."

        }), 400


    if not resume.filename.lower().endswith(
        ".pdf"
    ):

        return jsonify({

            "success": False,

            "error":
                "Please upload a PDF resume."

        }), 400


    temp_path = None


    try:

        # -------------------------------------------------
        # SAVE TEMP PDF
        # -------------------------------------------------

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf"
        ) as temp_file:

            resume.save(
                temp_file.name
            )

            temp_path = temp_file.name


        print(
            "TEMP PDF:",
            temp_path
        )


        # -------------------------------------------------
        # EXTRACT TEXT
        # -------------------------------------------------

        text = extract_pdf_text(
            temp_path
        )


        print(
            "\nEXTRACTED TEXT:"
        )

        print(
            text[:1000]
        )


        if not text.strip():

            return jsonify({

                "success": False,

                "error":
                    "Could not extract text from PDF."

            }), 400


        # -------------------------------------------------
        # EXTRACT RESUME DATA
        # -------------------------------------------------

        data = {

            "name":
                extract_name(text),

            "email":
                extract_email(text),

            "phone":
                extract_phone(text),

            "location":
                extract_location(text),

            "education":
                extract_education(text),

            "skills":
                extract_skills(text),

            "projects":
                extract_projects(text),

            "certifications":
                extract_certifications(text),

            "experience":
                extract_experience(text)

        }


        print(
            "\nEXTRACTED DATA:"
        )

        print(
            data
        )


        # -------------------------------------------------
        # RETURN DATA
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "message":
                "Resume extracted successfully.",

            "data":
                data

        })


    except Exception as error:

        print(
            "ERROR:",
            error
        )

        return jsonify({

            "success": False,

            "error":
                str(error)

        }), 500


    finally:

        # -------------------------------------------------
        # DELETE TEMP FILE
        # -------------------------------------------------

        if (
            temp_path
            and os.path.exists(temp_path)
        ):

            try:

                os.remove(
                    temp_path
                )

            except:

                pass



# =========================================================
# CAREER SKILL GAP ANALYSIS
# =========================================================

def normalize_skill_name(skill):
    """
    Normalize common resume skill variations so that:
    React.js -> React
    HTML5 -> HTML
    CSS3 -> CSS
    REST APIs -> REST API
    """
    value = str(skill).strip().lower()

    aliases = {
        "html5": "html",
        "html": "html",
        "css3": "css",
        "css": "css",
        "react.js": "react",
        "reactjs": "react",
        "react": "react",
        "rest apis": "rest api",
        "rest api": "rest api",
        "apis": "api",
        "api": "api",
        "scikit learn": "scikit-learn",
        "scikit-learn": "scikit-learn",
        "machine-learning": "machine learning",
        "machine learning": "machine learning",
        "ai": "artificial intelligence",
        "artificial intelligence": "artificial intelligence",
        "dsa": "data structures",
        "object oriented programming": "oop",
    }

    return aliases.get(value, value)


@app.route(
    "/api/skill-gap",
    methods=["POST"]
)
def skill_gap_analysis():

    try:

        body = request.get_json(silent=True) or {}

        career_id = body.get("career_id")
        resume_skills = body.get("skills", [])

        if not career_id:
            return jsonify({
                "success": False,
                "error": "career_id is required."
            }), 400

        if not isinstance(resume_skills, list):
            return jsonify({
                "success": False,
                "error": "skills must be a list."
            }), 400

        career = Career.query.get(career_id)

        if career is None:
            return jsonify({
                "success": False,
                "error": "Career not found."
            }), 404

        # Normalize resume skills
        normalized_resume = {
            normalize_skill_name(skill)
            for skill in resume_skills
            if str(skill).strip()
        }

        matched = []
        missing = []

        for skill in career.skills:

            normalized_required = normalize_skill_name(skill.name)

            if normalized_required in normalized_resume:
                matched.append({
                    "id": skill.id,
                    "name": skill.name,
                    "category": skill.category,
                    "importance": skill.importance
                })
            else:
                missing.append({
                    "id": skill.id,
                    "name": skill.name,
                    "category": skill.category,
                    "importance": skill.importance
                })

        total = len(career.skills)
        matched_count = len(matched)
        missing_count = len(missing)

        readiness = (
            round((matched_count / total) * 100)
            if total > 0
            else 0
        )

        return jsonify({
            "success": True,
            "career": {
                "id": career.id,
                "name": career.name,
                "domain": career.domain,
                "description": career.description
            },
            "matched_skills": matched,
            "missing_skills": missing,
            "matched_count": matched_count,
            "missing_count": missing_count,
            "total_skills": total,
            "readiness": readiness
        })

    except Exception as error:

        print("SKILL GAP API ERROR:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


# =========================================================
# CAREER LOOKUP BY NAME
# =========================================================

@app.route(
    "/api/careers/by-name/<path:career_name>",
    methods=["GET"]
)
def get_career_by_name(career_name):

    try:

        requested_name = career_name.strip()

        career = Career.query.filter_by(
            name=requested_name
        ).first()

        # Frontend-friendly aliases
        aliases = {
            "web development": "Web Developer",
            "software development": "Software Developer",
            "ai/ml": "AI/ML Engineer",
            "ai ml": "AI/ML Engineer",
            "data science": "Data Scientist",
            "mechanical design": "Mechanical Design Engineer",
            "electrical engineering": "Electrical Engineer",
            "electronics engineering": "Electronics Engineer",
            "civil engineering": "Civil Engineer"
        }

        if career is None:
            mapped_name = aliases.get(
                requested_name.lower()
            )

            if mapped_name:
                career = Career.query.filter_by(
                    name=mapped_name
                ).first()

        if career is None:
            return jsonify({
                "success": False,
                "error": "Career not found."
            }), 404

        return jsonify({
            "success": True,
            "career": {
                "id": career.id,
                "name": career.name,
                "domain": career.domain,
                "description": career.description
            }
        })

    except Exception as error:

        print("CAREER LOOKUP ERROR:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


# =========================================================
# CREATE DATABASE TABLES
# =========================================================

with app.app_context():

    db.create_all()


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        port=5000
    )