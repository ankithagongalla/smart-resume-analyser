import re
import pdfplumber


# ============================================================
# PDF TEXT EXTRACTION
# ============================================================

def extract_pdf_text(pdf_path):
    pages = []

    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text = page.extract_text(
                x_tolerance=2,
                y_tolerance=3,
                layout=True
            )

            if text:
                pages.append(text)

    return "\n".join(pages).strip()


# Backward compatibility
extract_text_from_pdf = extract_pdf_text


# ============================================================
# GENERAL HELPERS
# ============================================================

def clean_line(line):
    if not line:
        return ""

    line = line.replace("\u2022", " ")
    line = line.replace("•", " ")
    line = line.replace("●", " ")
    line = line.replace("▪", " ")
    line = line.replace("◦", " ")

    line = line.replace("\u2014", "—")
    line = line.replace("\u2013", "–")

    line = re.sub(r"[ \t]+", " ", line)

    return line.strip()


def clean_lines(text):
    result = []

    for line in text.splitlines():
        cleaned = clean_line(line)

        if cleaned:
            result.append(cleaned)

    return result


def normalize_space(text):
    if not text:
        return ""

    return re.sub(r"\s+", " ", text).strip()


def remove_bullets(text):
    if not text:
        return ""

    return re.sub(
        r"^[•●▪◦\-\s]+",
        "",
        text
    ).strip()


# ============================================================
# REGULAR EXPRESSIONS
# ============================================================

YEAR_RANGE = re.compile(
    r"\b(?:19|20)\d{2}\s*[–—-]\s*(?:(?:19|20)\d{2}|Present|present)\b"
)

YEAR_ONLY = re.compile(
    r"\b(?:19|20)\d{2}\b"
)

CERTIFICATION_DATE = re.compile(
    r"\b(?:0?[1-9]|1[0-2])/\d{4}\b"
)


# ============================================================
# SECTION HEADINGS
# ============================================================

SECTION_ALIASES = {
    "career objective": "career_objective",
    "career objective:": "career_objective",
    "objective": "career_objective",

    "education": "education",
    "academic qualifications": "education",
    "academic qualification": "education",

    "skills": "skills",
    "technical skills": "skills",
    "technical skill": "skills",

    "soft skills": "soft_skills",

    "currently learning": "currently_learning",
    "currently learning:": "currently_learning",
    "learning": "currently_learning",

    "certifications": "certifications",
    "certification": "certifications",
    "certificates": "certifications",

    "projects": "projects",
    "project": "projects",

    "experience": "experience",
    "work experience": "experience",
    "professional experience": "experience",
    "internships": "experience",
    "internship": "experience",
}


def normalize_heading(line):
    value = normalize_space(line).lower()

    value = value.strip(
        " :-–—"
    )

    return SECTION_ALIASES.get(value)


def split_sections(text):
    lines = clean_lines(text)

    sections = {
        "header": []
    }

    current = "header"

    for line in lines:

        heading = normalize_heading(line)

        if heading:
            current = heading

            if current not in sections:
                sections[current] = []

            continue

        sections.setdefault(
            current,
            []
        )

        sections[current].append(line)

    return sections


# ============================================================
# PERSONAL INFORMATION
# ============================================================

def extract_email(text):
    match = re.search(
        r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
        text
    )

    return match.group(0) if match else ""


def extract_phone(text):
    patterns = [
        r"\+91[\s-]?[6-9]\d{9}",
        r"\b[6-9]\d{9}\b",
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text
        )

        if match:
            return match.group(0)

    return ""


def extract_linkedin(text):
    match = re.search(
        r"(?:https?://)?(?:www\.)?linkedin\.com/[^\s]+",
        text,
        re.IGNORECASE
    )

    if match:
        return match.group(0).rstrip(
            ".,)"
        )

    return ""


def extract_name(text):
    lines = clean_lines(text)

    email = extract_email(text)
    phone = extract_phone(text)

    for line in lines[:10]:

        value = normalize_space(line)

        if not value:
            continue

        if email and email.lower() in value.lower():
            continue

        if phone and phone in value:
            continue

        if "linkedin.com" in value.lower():
            continue

        if normalize_heading(value):
            continue

        if re.search(r"\d", value):
            continue

        words = value.split()

        if not (2 <= len(words) <= 5):
            continue

        if all(
            re.match(
                r"^[A-Za-z.'-]+$",
                word
            )
            for word in words
        ):
            return value

    return ""


# ============================================================
# LOCATION
# ============================================================

KNOWN_LOCATIONS = [
    "Hyderabad",
    "Karimnagar",
    "Bengaluru",
    "Bangalore",
    "Chennai",
    "Mumbai",
    "Pune",
    "Delhi",
    "New Delhi",
    "Kolkata",
    "Vijayawada",
    "Warangal",
    "Secunderabad",
    "Telangana",
    "Andhra Pradesh",
]


def extract_location(text):
    lines = clean_lines(text)

    email = extract_email(text)
    phone = extract_phone(text)

    for line in lines[:15]:

        value = line

        if email:
            value = value.replace(
                email,
                ""
            )

        if phone:
            value = value.replace(
                phone,
                ""
            )

        value = re.sub(
            r"\b(?:female|male)\b",
            "",
            value,
            flags=re.IGNORECASE
        )

        value = normalize_space(value)

        # If the line contains a known location,
        # return ONLY the location.
        for location in KNOWN_LOCATIONS:

            if re.search(
                rf"\b{re.escape(location)}\b",
                value,
                re.IGNORECASE
            ):
                return location

    return ""


# ============================================================
# CAREER OBJECTIVE
# ============================================================

def extract_career_objective(text):
    sections = split_sections(text)

    lines = sections.get(
        "career_objective",
        []
    )

    return normalize_space(
        " ".join(lines)
    )


# ============================================================
# EDUCATION HELPERS
# ============================================================

def extract_period(text):
    match = YEAR_RANGE.search(text)

    if match:
        return match.group(0)

    return ""


def remove_period(text):
    text = YEAR_RANGE.sub(
        "",
        text
    )

    return normalize_space(text)


def detect_location_from_line(line):
    if not line:
        return ""

    for location in KNOWN_LOCATIONS:

        if re.search(
            rf"\b{re.escape(location)}\b",
            line,
            re.IGNORECASE
        ):
            return location

    return ""


def remove_known_location(text):
    if not text:
        return ""

    result = text

    for location in KNOWN_LOCATIONS:

        result = re.sub(
            rf"\b{re.escape(location)}\b",
            "",
            result,
            flags=re.IGNORECASE
        )

    return normalize_space(result)


# ============================================================
# EDUCATION
# ============================================================

def extract_education(text):
    sections = split_sections(text)

    lines = sections.get(
        "education",
        []
    )

    education = []

    i = 0

    while i < len(lines):

        line = normalize_space(
            lines[i]
        )

        lower = line.lower()

        # ----------------------------------------------------
        # INTERMEDIATE
        # ----------------------------------------------------

        if lower.startswith(
            "intermediate"
        ):

            period = extract_period(
                line
            )

            entry = {
                "degree": "Intermediate",
                "institution": "",
                "period": period,
                "year": period,
                "location": "",
            }

            # Search following lines for
            # institution/location.
            j = i + 1

            while j < len(lines) and j <= i + 2:

                candidate = normalize_space(
                    lines[j]
                )

                if not candidate:
                    j += 1
                    continue

                candidate_lower = candidate.lower()

                if (
                    candidate_lower.startswith(
                        "bachelor"
                    )
                    or candidate_lower.startswith(
                        "b.tech"
                    )
                    or candidate_lower.startswith(
                        "projects"
                    )
                ):
                    break

                candidate_location = detect_location_from_line(
                    candidate
                )

                if candidate_location:
                    entry["location"] = candidate_location

                candidate_without_period = remove_period(
                    candidate
                )

                candidate_without_location = remove_known_location(
                    candidate_without_period
                )

                if candidate_without_location:
                    entry["institution"] = (
                        candidate_without_location
                    )

                j += 1

            education.append(entry)

            i = j
            continue

        # ----------------------------------------------------
        # B.TECH / BACHELOR
        # ----------------------------------------------------

        if (
            "bachelor of technology" in lower
            or "b.tech" in lower
            or "btech" in lower
        ):

            period = extract_period(
                line
            )

            degree = remove_period(
                line
            )

            entry = {
                "degree": degree,
                "institution": "",
                "period": period,
                "year": period,
                "location": "",
            }

            # Look ahead for institution.
            j = i + 1

            while j < len(lines) and j <= i + 2:

                candidate = normalize_space(
                    lines[j]
                )

                if not candidate:
                    j += 1
                    continue

                candidate_lower = candidate.lower()

                if (
                    candidate_lower.startswith(
                        "intermediate"
                    )
                    or candidate_lower.startswith(
                        "projects"
                    )
                ):
                    break

                candidate_location = detect_location_from_line(
                    candidate
                )

                if candidate_location:
                    entry["location"] = candidate_location

                candidate_without_period = remove_period(
                    candidate
                )

                candidate_without_location = remove_known_location(
                    candidate_without_period
                )

                if candidate_without_location:
                    entry["institution"] = (
                        candidate_without_location
                    )

                j += 1

            education.append(entry)

            i = j
            continue

        i += 1

    return education


# ============================================================
# TECHNICAL SKILLS
# ============================================================

TECHNICAL_SKILLS = [
    "HTML5",
    "CSS3",
    "JavaScript",
    "Python",
    "Java",
    "C",
    "C++",
    "C#",
    "SQL",

    "React.js",
    "React",
    "Node.js",
    "Express.js",
    "Angular",
    "Vue.js",

    "Git",
    "GitHub",
    "VS Code",

    "Responsive Web Design",
    "Front-End Development",
    "Back-End Development",
    "Full Stack Development",
    "Basic Full Stack Concepts",

    "REST APIs",
    "REST API",

    "MySQL",
    "PostgreSQL",
    "MongoDB",

    "Power BI",
    "Excel",

    "Machine Learning",
    "Artificial Intelligence",
    "AI",
    "NLP",
    "Deep Learning",

    "Data Structures & Algorithms",
    "Data Structures",
    "DSA",

    "OOP",
    "Operating Systems",
    "DBMS",
    "Computer Networks",
]


# ============================================================
# SOFT SKILLS
# ============================================================

SOFT_SKILLS = [
    "Problem Solving",
    "Teamwork",
    "Communication",
    "Adaptability",
    "Leadership",
    "Time Management",
    "Critical Thinking",
    "Team Collaboration",
]


def contains_skill(text, skill):
    return bool(
        re.search(
            rf"(?<![A-Za-z0-9])"
            rf"{re.escape(skill)}"
            rf"(?![A-Za-z0-9])",
            text,
            re.IGNORECASE
        )
    )


def extract_skills(text):
    sections = split_sections(text)

    skills_lines = sections.get(
        "skills",
        []
    )

    skills_text = normalize_space(
        " ".join(skills_lines)
    )

    found = []

    for skill in TECHNICAL_SKILLS:

        if contains_skill(
            skills_text,
            skill
        ):
            if skill not in found:
                found.append(skill)

    # --------------------------------------------------------
    # Remove duplicate variants
    # --------------------------------------------------------

    if "HTML5" in found and "HTML" in found:
        found.remove("HTML")

    if "CSS3" in found and "CSS" in found:
        found.remove("CSS")

    if "React.js" in found and "React" in found:
        found.remove("React")

    if "REST APIs" in found and "REST API" in found:
        found.remove("REST API")

    if (
        "Data Structures & Algorithms" in found
        and "Data Structures" in found
    ):
        found.remove("Data Structures")

    return found


def extract_soft_skills(text):
    sections = split_sections(text)

    lines = sections.get(
        "soft_skills",
        []
    )

    # Some resumes put soft skills inside
    # the main Skills section.
    if not lines:
        lines = sections.get(
            "skills",
            []
        )

    skills_text = normalize_space(
        " ".join(lines)
    )

    found = []

    for skill in SOFT_SKILLS:

        if contains_skill(
            skills_text,
            skill
        ):
            if skill not in found:
                found.append(skill)

    return found


# ============================================================
# CURRENTLY LEARNING
# ============================================================

def extract_currently_learning(text):
    sections = split_sections(text)

    lines = sections.get(
        "currently_learning",
        []
    )

    full_text = normalize_space(
        " ".join(lines)
    )

    if not full_text:
        return []

    learning = []

    patterns = [
        (
            "Full Stack Web Development",
            r"Full\s+Stack\s+Web\s+Development"
        ),

        (
            "React.js",
            r"React\s*\.?\s*js"
        ),

        (
            "Data Structures & Algorithms",
            r"Data\s+Structures\s*(?:&|and)\s*Algorithms"
        ),

        (
            "Git & GitHub",
            r"Git\s*(?:&|and)\s*GitHub"
        ),

        (
            "REST APIs",
            r"REST\s+APIs?"
        ),
    ]

    for name, pattern in patterns:

        if re.search(
            pattern,
            full_text,
            re.IGNORECASE
        ):
            if name not in learning:
                learning.append(name)

    return learning


# ============================================================
# CERTIFICATIONS
# ============================================================

def extract_certifications(text):
    sections = split_sections(text)

    lines = sections.get(
        "certifications",
        []
    )

    certifications = []

    i = 0

    while i < len(lines):

        line = normalize_space(
            lines[i]
        )

        if not line:
            i += 1
            continue

        # ----------------------------------------------------
        # DATE ON SAME LINE
        # ----------------------------------------------------

        date_match = CERTIFICATION_DATE.search(
            line
        )

        if date_match:

            date = date_match.group(0)

            name = normalize_space(
                line[
                    :date_match.start()
                ]
                +
                line[
                    date_match.end():
                ]
            )

            issuer = ""

            # Issuer may be next line.
            if i + 1 < len(lines):

                candidate = normalize_space(
                    lines[i + 1]
                )

                if (
                    candidate
                    and not CERTIFICATION_DATE.fullmatch(
                        candidate
                    )
                ):
                    issuer = candidate
                    i += 1

            certifications.append({
                "name": name,
                "title": name,
                "issuer": issuer,
                "date": date,
                "year": date,
            })

            i += 1
            continue

        # ----------------------------------------------------
        # NAME / ISSUER / DATE
        # ----------------------------------------------------

        name = line
        issuer = ""
        date = ""

        if i + 1 < len(lines):

            possible_issuer = normalize_space(
                lines[i + 1]
            )

            if not CERTIFICATION_DATE.fullmatch(
                possible_issuer
            ):
                issuer = possible_issuer
                i += 1

        if i + 1 < len(lines):

            possible_date = normalize_space(
                lines[i + 1]
            )

            if CERTIFICATION_DATE.fullmatch(
                possible_date
            ):
                date = possible_date
                i += 1

        certifications.append({
            "name": name,
            "title": name,
            "issuer": issuer,
            "date": date,
            "year": date,
        })

        i += 1

    return certifications


# ============================================================
# PROJECT HELPERS
# ============================================================

PROJECT_NAMES = [
    "Personal Portfolio Website",
    "AI-HUB",
    "Health symptom checker",
]


def clean_project_description(lines):
    cleaned = []

    for line in lines:

        value = normalize_space(
            line
        )

        if not value:
            continue

        # Ignore accidental continuation fragments
        # produced by PDF line wrapping.
        if value.lower() in [
            "profile.",
            "profile",
        ]:
            continue

        cleaned.append(value)

    return normalize_space(
        " ".join(cleaned)
    )


# ============================================================
# PROJECTS
# ============================================================

def extract_projects(text):
    sections = split_sections(text)

    lines = sections.get(
        "projects",
        []
    )

    projects = []

    i = 0

    while i < len(lines):

        line = normalize_space(
            lines[i]
        )

        if not line:
            i += 1
            continue

        matched_name = None

        # ----------------------------------------------------
        # Match known project names
        # ----------------------------------------------------

        for project_name in PROJECT_NAMES:

            if line.lower() == project_name.lower():
                matched_name = project_name
                break

        if not matched_name:
            i += 1
            continue

        description_parts = []

        j = i + 1

        while j < len(lines):

            candidate = normalize_space(
                lines[j]
            )

            # Another project begins.
            if any(
                candidate.lower() == name.lower()
                for name in PROJECT_NAMES
            ):
                break

            description_parts.append(
                candidate
            )

            j += 1

        description = clean_project_description(
            description_parts
        )

        projects.append({
            "name": matched_name,
            "title": matched_name,
            "description": description,
        })

        i = j

    return projects


# ============================================================
# EXPERIENCE
# ============================================================

def extract_experience(text):
    sections = split_sections(text)

    lines = sections.get(
        "experience",
        []
    )

    experience = []

    for line in lines:

        value = normalize_space(
            line
        )

        if not value:
            continue

        experience.append({
            "title": value,
            "description": "",
        })

    return experience


# ============================================================
# FULL RESUME DATA
# ============================================================

def extract_resume_data(pdf_path):

    raw_text = extract_pdf_text(
        pdf_path
    )

    sections = split_sections(
        raw_text
    )

    return {

        "name": normalize_space(
            extract_name(
                raw_text
            )
        ),

        "email": extract_email(
            raw_text
        ),

        "phone": extract_phone(
            raw_text
        ),

        "location": extract_location(
            raw_text
        ),

        "linkedin": extract_linkedin(
            raw_text
        ),

        "career_objective":
            extract_career_objective(
                raw_text
            ),

        "education":
            extract_education(
                raw_text
            ),

        "skills":
            extract_skills(
                raw_text
            ),

        "soft_skills":
            extract_soft_skills(
                raw_text
            ),

        "currently_learning":
            extract_currently_learning(
                raw_text
            ),

        "projects":
            extract_projects(
                raw_text
            ),

        "certifications":
            extract_certifications(
                raw_text
            ),

        "experience":
            extract_experience(
                raw_text
            ),

        "raw_text":
            raw_text,

        "sections":
            sections,
    }