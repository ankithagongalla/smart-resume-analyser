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

@app.route("/api/careers", methods=["GET"])
def get_careers():

    try:

        careers = Career.query.order_by(Career.name).all()

        result = []

        for career in careers:

            result.append({
                "id": career.id,
                "name": career.name,
                "domain": career.domain,
                "description": career.description
            })

        return jsonify({
            "success": True,
            "careers": result
        })

    except Exception as error:

        print("CAREER API ERROR:", error)

        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


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

import csv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "datasets"))


def normalize_skill_name(skill):
    """Normalize common resume and O*NET skill variations."""

    value = str(skill or "").strip().lower()

    value = re.sub(r"\s+", " ", value)

    aliases = {
        "html5": "html",
        "html": "html",
        "css3": "css",
        "css": "css",
        "react.js": "react",
        "reactjs": "react",
        "react": "react",
        "node.js": "node.js",
        "nodejs": "node.js",
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
        "data structures and algorithms": "data structures",
        "object oriented programming": "oop",
        "object-oriented programming": "oop",
        "github": "github",
    }

    return aliases.get(value, value)


def normalize_soc_code(value):
    """Normalize an O*NET-SOC code for matching."""

    value = str(value or "").strip()

    if "|" in value:
        value = value.split("|")[0].strip()

    return value


def read_csv_rows(filename):
    """Read one CSV file from the project's datasets folder."""

    path = os.path.join(DATASET_DIR, filename)

    if not os.path.exists(path):
        return []

    rows = []

    try:
        with open(
            path,
            "r",
            encoding="utf-8-sig",
            newline=""
        ) as file:
            reader = csv.DictReader(file)

            for row in reader:
                rows.append(row)

    except Exception as error:
        print(
            f"DATASET READ ERROR ({filename}):",
            error
        )

    return rows


def find_column(row, candidates):
    """Find a CSV column without depending on exact capitalization."""

    if not row:
        return None

    normalized = {
        re.sub(r"[^a-z0-9]", "", str(key).lower()): key
        for key in row.keys()
        if key is not None
    }

    for candidate in candidates:
        key = normalized.get(
            re.sub(r"[^a-z0-9]", "", candidate.lower())
        )

        if key:
            return key

    return None


APPLICATION_ANALYST_SOC = "15-1211.00"

CAREER_SOC_ALIASES = {
    "application analyst": APPLICATION_ANALYST_SOC,
    "applications analyst": APPLICATION_ANALYST_SOC,
}


def get_forced_soc_code(career_name):
    name = str(career_name or "").strip().lower()
    return CAREER_SOC_ALIASES.get(name, "")


def get_catalog_career(career_code, career_name):
    """Find a selected career in the generated 11,588-role catalog."""

    rows = read_csv_rows(
        "student_career_catalog.csv"
    )

    if not rows:
        return None

    requested_code = normalize_soc_code(
        career_code
    )

    requested_name = str(
        career_name or ""
    ).strip().lower()

    # First: exact SOC code match.
    if requested_code:
        for row in rows:
            code_column = find_column(
                row,
                ["onet_soc_code", "O*NET-SOC Code"]
            )

            if not code_column:
                continue

            codes = [
                normalize_soc_code(code)
                for code in str(
                    row.get(code_column, "")
                ).split("|")
            ]

            if requested_code in codes:
                return row

    # Second: exact career name match.
    for row in rows:
        name_column = find_column(
            row,
            ["career_name", "job_title", "title"]
        )

        if not name_column:
            continue

        name = str(
            row.get(name_column, "")
        ).strip().lower()

        if name == requested_name:
            return row

    # Third: common name containment for popular aliases.
    aliases = {
        "software development": [
            "software developer",
            "software engineer"
        ],
        "web development": [
            "web developer",
            "full stack developer"
        ],
        "ai/ml": [
            "machine learning engineer",
            "artificial intelligence"
        ],
        "ai ml": [
            "machine learning engineer",
            "artificial intelligence"
        ],
        "data science": [
            "data scientist"
        ],
        "embedded systems engineer": [
            "embedded systems",
            "embedded software"
        ],
    }

    possible_names = aliases.get(
        requested_name,
        []
    )

    for possible_name in possible_names:
        for row in rows:
            name_column = find_column(
                row,
                ["career_name", "job_title", "title"]
            )

            if not name_column:
                continue

            name = str(
                row.get(name_column, "")
            ).strip().lower()

            if name == possible_name:
                return row

    return None


def get_catalog_soc_code(catalog_row):
    if not catalog_row:
        return ""

    code_column = find_column(
        catalog_row,
        ["onet_soc_code", "O*NET-SOC Code"]
    )

    if not code_column:
        return ""

    return normalize_soc_code(
        catalog_row.get(code_column, "")
    )


def get_catalog_name(catalog_row, fallback):
    if not catalog_row:
        return fallback

    name_column = find_column(
        catalog_row,
        ["career_name", "job_title", "title"]
    )

    if not name_column:
        return fallback

    return str(
        catalog_row.get(name_column, "")
    ).strip() or fallback


def get_catalog_domain(catalog_row):
    if not catalog_row:
        return ""

    domain_column = find_column(
        catalog_row,
        ["domain"]
    )

    if not domain_column:
        return ""

    return str(
        catalog_row.get(domain_column, "")
    ).strip()


# =========================================================
# OCCUPATION-SPECIFIC SKILL FILTERING
# =========================================================

ENGINEERING_EXCLUDE_TECH={"c","c++","c#","chef","puppet","perl","docker","kubernetes","jenkins","terraform","kafka","react","angular","node.js","typescript","aws","azure","github","git"}
GENERIC_ADMIN_TECH={"electronic mail software","instant messaging software","presentation software","word processing software","document management software","office suite software","customer relationship management crm software","enterprise resource planning erp software"}
ENGINEERING_TECH={"autocad","solidworks","revit","creo","matlab","catia","ansys","nx","computer aided design","computer aided manufacturing","civil 3d","microstation","arcgis","labview","altium","multisim","finite element","simulation","plm","primavera","sap"}
SOFTWARE_TECH={"python","java","javascript","typescript","c","c++","c#","go","rust","sql","database","web","software","programming","development","react","angular","node","docker","kubernetes","aws","azure","google cloud","terraform","jenkins","kafka","linux","git"}
DESIGN_TECH={"autocad","revit","solidworks","sketchup","illustrator","photoshop","cad","3d"}
BUSINESS_TECH={"excel","power bi","tableau","salesforce","sap","oracle","project management","crm","erp"}

def detect_career_family(career_name="", occupation="", domain=""):
    text=" ".join([str(career_name or ""),str(occupation or ""),str(domain or "")]).lower()
    if any(x in text for x in ["software","developer","programmer","computer","web","information technology","systems analyst","database","cyber","devops","cloud","machine learning","artificial intelligence","data scientist","network"]): return "software"
    if any(x in text for x in ["mechanical","automotive","aerospace","civil","electrical","electronics","chemical","biomedical","environmental","industrial","manufacturing","materials","petroleum","marine","mining","engineering"]): return "engineering"
    if any(x in text for x in ["architect","architecture","graphic design","industrial design","designer"]): return "design"
    if any(x in text for x in ["business","finance","accounting","marketing","sales","management","human resources","operations"]): return "business"
    return "general"

def is_relevant_technology(skill_name,family,career_name="",occupation="",domain=""):
    raw=str(skill_name or "").strip().lower()
    if not raw or raw in GENERIC_ADMIN_TECH: return False
    if family=="engineering":
        if raw in ENGINEERING_EXCLUDE_TECH: return False
        return any(x in raw for x in ENGINEERING_TECH)
    if family=="software": return any(x in raw for x in SOFTWARE_TECH)
    if family=="design": return any(x in raw for x in DESIGN_TECH)
    if family=="business": return any(x in raw for x in BUSINESS_TECH)
    career_words={w for w in re.findall(r"[a-z0-9]+",(str(career_name)+" "+str(occupation)+" "+str(domain)).lower()) if len(w)>=4}
    return bool(career_words & set(re.findall(r"[a-z0-9]+",raw)))

def get_onet_required_skills(soc_code,career_name="",occupation="",domain=""):
    if not soc_code: return []
    rows=read_csv_rows("software_skills.csv")
    family=detect_career_family(career_name,occupation,domain)
    requirements={}
    for row in rows:
        cc=find_column(row,["O*NET-SOC Code","onetsoc_code"])
        sc=find_column(row,["Workplace Example","workplace_example","Example"])
        if not cc or not sc or normalize_soc_code(row.get(cc,""))!=normalize_soc_code(soc_code): continue
        name=str(row.get(sc,"")).strip()
        if not name or not is_relevant_technology(name,family,career_name,occupation,domain): continue
        hc=find_column(row,["Hot Technology","hot_technology"]); dc=find_column(row,["In Demand","in_demand"])
        hot=str(row.get(hc,"")).strip().upper()=="Y" if hc else False
        demand=str(row.get(dc,"")).strip().upper()=="Y" if dc else False
        priority=3 if demand else 2 if hot else 1
        tier="core" if demand else "recommended"
        key=normalize_skill_name(name)
        item={"name":name,"category":"Occupation technology","tier":tier,"tier_label":"Core skill" if tier=="core" else "Relevant skill","in_demand":demand,"hot_technology":hot,"priority":priority,"importance":float(priority)}
        if key not in requirements or priority>requirements[key]["priority"]: requirements[key]=item
    return sorted(requirements.values(),key=lambda x:(-x["priority"],x["name"].lower()))


def get_onet_essential_skills(soc_code):
    """Fallback for careers with no software-skill rows."""
    if not soc_code:
        return []

    rows = read_csv_rows("essential_skills.csv")
    requirements = {}

    for row in rows:
        code_column = find_column(row, ["O*NET-SOC Code", "onetsoc_code"])
        name_column = find_column(row, ["Element Name", "element_name", "Skill"])
        if not code_column or not name_column:
            continue

        if normalize_soc_code(row.get(code_column, "")) != soc_code:
            continue

        skill_name = str(row.get(name_column, "")).strip()
        if not skill_name:
            continue

        normalized = normalize_skill_name(skill_name)
        if normalized not in requirements:
            requirements[normalized] = {
                "name": skill_name,
                "category": "Essential skill",
                "tier": "core",
                "tier_label": "Core skill",
                "in_demand": True,
                "hot_technology": False,
                "priority": 3,
                "importance": 3.0,
            }

    return list(requirements.values())


def calculate_skill_score(required_name, resume_skills):
    """Return 100 for direct evidence, 50 for a clearly related match, otherwise 0."""
    required = normalize_skill_name(required_name)
    normalized_resume = [
        normalize_skill_name(skill)
        for skill in resume_skills
        if str(skill).strip()
    ]

    if required in normalized_resume:
        return 100

    for resume_skill in normalized_resume:
        related = RELATED_SKILLS.get(required, set())
        if resume_skill in related:
            return 50
    return 0




# Target-specific major skill profiles. These control the user-facing skill-gap assessment.
CAREER_SKILL_PROFILES = {
    "application engineer": {
        "core": ["Python", "Java", "JavaScript", "C", "SQL", "Data Structures & Algorithms", "Object-Oriented Programming", "HTML", "CSS", "REST API", "Git", "GitHub"],
        "supporting": ["React", "Node.js", "Authentication & Authorization", "HTTP", "JSON", "Debugging & Testing", "Linux"],
        "advanced": ["PostgreSQL", "Docker", "AWS"],
    },
    "backend developer": {
        "core": ["Python", "JavaScript", "Node.js", "REST API", "SQL", "Database Management", "Git", "GitHub"],
        "supporting": ["JSON", "Authentication & Authorization", "HTTP", "API Development", "Backend Frameworks", "Error Handling"],
        "advanced": ["PostgreSQL", "MySQL", "MongoDB", "Docker", "AWS"],
    },
    "frontend developer": {
        "core": ["HTML", "CSS", "JavaScript", "React", "Responsive Web Design", "Git", "REST API"],
        "supporting": ["Accessibility", "UI/UX", "JavaScript Testing", "Browser Developer Tools", "HTTP", "JSON"],
        "advanced": ["TypeScript", "Next.js", "Docker"],
    },
    "data scientist": {
        "core": ["Python", "SQL", "Statistics", "Pandas", "NumPy", "Machine Learning", "Data Visualization", "Model Evaluation"],
        "supporting": ["Scikit-learn", "Matplotlib", "Data Cleaning", "Feature Engineering", "Jupyter"],
        "advanced": ["Deep Learning", "TensorFlow", "PyTorch"],
    },
    "mechanical engineer": {
        "core": ["Engineering Mechanics", "Thermodynamics", "Fluid Mechanics", "Heat Transfer", "Machine Design", "Manufacturing Processes", "CAD", "Mechanical Drawing"],
        "supporting": ["AutoCAD", "SolidWorks", "Engineering Materials", "MATLAB", "Finite Element Analysis"],
        "advanced": ["ANSYS", "CATIA", "Creo"],
    },
}

RELATED_SKILLS = {
    "object-oriented programming": {"java", "python", "c", "c++", "c#"},
    "database management": {"sql", "mysql", "postgresql", "mongodb"},
    "http": {"rest api"},
    "json": {"rest api"},
    "api development": {"rest api"},
    "node.js": {"javascript"},
    "postgresql": {"sql"},
    "mysql": {"sql"},
    "cad": {"autocad", "solidworks", "catia", "creo"},
    "mechanical drawing": {"autocad", "cad"},
}

def get_target_skill_profile(career_name):
    text = re.sub(r"[^a-z0-9]+", " ", str(career_name or "").lower()).strip()
    if "application engineer" in text or "software application engineer" in text:
        return CAREER_SKILL_PROFILES["application engineer"]
    if "backend developer" in text or "back end developer" in text:
        return CAREER_SKILL_PROFILES["backend developer"]
    if "frontend developer" in text or "front end developer" in text:
        return CAREER_SKILL_PROFILES["frontend developer"]
    if "data scientist" in text:
        return CAREER_SKILL_PROFILES["data scientist"]
    if "mechanical engineer" in text:
        return CAREER_SKILL_PROFILES["mechanical engineer"]
    return None

def build_target_requirements(career_name):
    profile = get_target_skill_profile(career_name)
    if not profile:
        return None
    requirements = []
    for tier, names, priority, label in [
        ("core", profile["core"], 3, "Core skill"),
        ("recommended", profile["supporting"], 2, "Supporting skill"),
        ("optional", profile["advanced"], 1, "Advanced / optional skill"),
    ]:
        for name in names:
            requirements.append({"name": name, "category": "Target-specific skill", "tier": tier, "tier_label": label, "in_demand": tier == "core", "hot_technology": tier == "advanced", "priority": priority, "importance": float(priority)})
    return requirements


@app.route("/api/skill-gap",methods=["POST"])
def skill_gap_analysis():
    try:
        body=request.get_json(silent=True) or {}
        career_id=body.get("career_id")
        career_code=body.get("career_code") or body.get("soc_code") or ""
        career_name=body.get("career_name") or body.get("career") or ""
        resume_skills=body.get("skills",[])
        if not isinstance(resume_skills,list): return jsonify({"success":False,"error":"skills must be a list."}),400

        catalog=get_catalog_career(career_code,career_name)
        if catalog:
            career_code=get_catalog_soc_code(catalog)
            career_name=get_catalog_name(catalog,career_name or "Selected career")
            occupation=value_from_row(catalog,["onet_occupation","O*NET-SOC Title","occupation"])
            domain=get_catalog_domain(catalog)
        else:
            career_code=normalize_soc_code(career_code); occupation=""; domain=""
        if not career_code: return jsonify({"success":False,"error":"A valid O*NET-SOC code is required."}),400

        # Use a curated target-specific profile for known software/engineering careers.
        # O*NET remains available as research evidence, but does not decide the user-facing list.
        requirements=build_target_requirements(career_name)
        if requirements is None:
            requirements=get_onet_required_skills(career_code,career_name,occupation,domain)
            if not requirements: requirements=get_onet_essential_skills(career_code)
            unique={}
            for item in requirements:
                key=normalize_skill_name(item["name"])
                if key not in unique or item["priority"]>unique[key]["priority"]: unique[key]=item
            requirements=sorted(unique.values(),key=lambda x:(-x["priority"],x["name"].lower()))[:12]
        if not requirements: return jsonify({"success":False,"error":"No relevant occupation-specific skills were found.","career_name":career_name,"career_code":career_code}),404

        matched=[]; partial=[]; missing=[]; total=0.0; earned=0.0
        for item in requirements:
            if item.get("tier") == "optional":
                continue
            weight=3.0 if item.get("tier")=="core" else 2.0
            score=calculate_skill_score(item["name"],resume_skills)
            result=dict(item); result["score"]=score
            total+=weight
            if score==100:
                result["evidence"]="Strongly supported by your profile."; matched.append(result); earned+=weight
            elif score==50:
                result["evidence"]="Related evidence found, but the exact skill is not clearly demonstrated."; partial.append(result); earned+=weight*0.5
            else:
                result["evidence"]="This relevant career skill is not yet demonstrated in your profile."; missing.append(result)
        readiness=round((earned/total)*100) if total else 0
        core=[x for x in requirements if x["tier"]=="core"]; rec=[x for x in requirements if x["tier"]=="recommended"]
        return jsonify({
            "success":True,
            "career":{"id":career_id,"name":career_name,"domain":domain,"description":occupation,"soc_code":career_code},
            "matched_skills":matched,"present_skills":matched,"partial_skills":partial,"missing_skills":missing,
            "core_skills":core,"recommended_skills":rec,
            "core_missing":[x for x in missing if x["tier"]=="core"],
            "recommended_missing":[x for x in missing if x["tier"]=="recommended"],
            "matched_count":len(matched),"partial_count":len(partial),"missing_count":len(missing),"core_count":len(core),"recommended_count":len(rec),"total_skills":len(requirements),
            "readiness_score":readiness,"career_readiness_score":readiness,"overall_score":readiness,"overall_readiness":readiness,
            "readiness":{"score":readiness,"label":"Career readiness"},
            "methodology":{"source":"Target-specific competency profile; O*NET used as supporting evidence when no curated profile exists","rule":"Only major skills relevant to the selected career are assessed. Core skills carry higher readiness weight; advanced skills are optional.","direct_evidence":100,"related_evidence":50,"no_evidence":0}
        })
    except Exception as error:
        print("SKILL GAP API ERROR:",error)
        return jsonify({"success":False,"error":str(error)}),500



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