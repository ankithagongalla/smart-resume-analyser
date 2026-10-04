import os
import re
import pandas as pd


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_DIR = os.path.join(BASE_DIR, "datasets")

INPUT_FILE = os.path.join(DATASET_DIR, "career_catalog.csv")
OUTPUT_FILE = os.path.join(DATASET_DIR, "student_career_catalog.csv")


# ============================================================
# EXCLUDE NON-STUDENT TARGET ROLES
# ============================================================

EXCLUDE_TITLE_PATTERNS = [
    r"\bintern\b",
    r"\binternship\b",
    r"\bapprentice\b",
    r"\btrainee\b",

    r"\bhelper\b",
    r"\baide\b",
    r"\battendant\b",
    r"\boperator\b",

    r"\bprofessor\b",
    r"\blecturer\b",
    r"\binstructor\b",
    r"\bteacher\b",
    r"\beducator\b",
    r"\bfaculty\b",

    r"\bprincipal\b",
    r"\bsuperintendent\b",

    r"\bchief\b",
    r"\bvice president\b",
    r"\bvice-president\b",
    r"\bdirector\b",
    r"\bexecutive\b",
    r"\bsupervisor\b",
]


# ============================================================
# DOMAIN KEYWORDS
# ============================================================

AI_KEYWORDS = [
    "ai engineer",
    "artificial intelligence",
    "machine learning",
    "deep learning",
    "computer vision",
    "natural language processing",
    "nlp engineer",
    "robotics engineer",
    "robotics",
    "autonomous systems",
    "autonomous vehicle",
    "intelligent systems",
    "intelligent automation",
    "generative ai",
    "genai",
    "reinforcement learning",
    "ml engineer",
]

AUTOMOTIVE_KEYWORDS = [
    "automotive",
    "automobile engineer",
    "vehicle engineer",
    "automotive systems",
    "automotive design",
    "automotive manufacturing",
]

AEROSPACE_KEYWORDS = [
    "aerospace",
    "aeronautical",
    "aircraft engineer",
    "aircraft design",
    "flight engineer",
    "spacecraft engineer",
    "space systems",
]

BIOMEDICAL_KEYWORDS = [
    "biomedical",
    "bioengineering",
    "medical device engineer",
    "clinical engineer",
    "biomechanical engineer",
]

CHEMICAL_KEYWORDS = [
    "chemical engineer",
    "chemical engineering",
    "process engineer",
    "process engineering",
    "petrochemical",
]

CIVIL_KEYWORDS = [
    "civil engineer",
    "civil engineering",
    "structural engineer",
    "structural engineering",
    "geotechnical engineer",
    "geotechnical engineering",
    "transportation engineer",
    "highway engineer",
    "water resources engineer",
    "construction engineer",
]

MECHANICAL_KEYWORDS = [
    "mechanical engineer",
    "mechanical engineering",
    "mechatronics",
    "mechatronic",
    "thermal engineer",
    "hvac engineer",
    "manufacturing engineer",
    "mechanical design engineer",
]

ELECTRICAL_KEYWORDS = [
    "electrical engineer",
    "electrical engineering",
    "power systems engineer",
    "power engineer",
    "power electronics",
    "electrical design engineer",
    "control systems engineer",
    "instrumentation engineer",
]

ECE_KEYWORDS = [
    "electronics engineer",
    "electronics engineering",
    "electronic engineer",
    "electronic systems",
    "embedded engineer",
    "embedded systems",
    "embedded software",
    "iot engineer",
    "internet of things",
    "telecommunication engineer",
    "telecommunications engineer",
    "rf engineer",
    "radio frequency engineer",
    "vlsi",
    "semiconductor engineer",
    "microelectronics",
]

ARCHITECTURE_KEYWORDS = [
    "architect",
    "architecture",
    "architectural designer",
    "architectural engineer",
    "building designer",
    "landscape architect",
    "urban planner",
]

ENVIRONMENTAL_KEYWORDS = [
    "environmental engineer",
    "environmental engineering",
    "environment engineer",
    "environmental systems",
    "water treatment engineer",
    "waste management engineer",
]

MINING_KEYWORDS = [
    "mining engineer",
    "mining engineering",
    "geological engineer",
    "geological engineering",
    "geotechnical",
    "petroleum engineer",
    "petroleum engineering",
]

MARINE_KEYWORDS = [
    "marine engineer",
    "marine engineering",
    "naval architect",
    "naval engineering",
    "shipbuilding engineer",
]

MATERIALS_KEYWORDS = [
    "materials engineer",
    "materials engineering",
    "metallurgical engineer",
    "metallurgy",
    "polymer engineer",
]

INDUSTRIAL_KEYWORDS = [
    "industrial engineer",
    "industrial engineering",
    "operations engineer",
    "quality engineer",
    "quality assurance engineer",
    "quality control engineer",
    "manufacturing engineer",
    "production engineer",
    "production engineering",
]

COMPUTER_KEYWORDS = [
    "software engineer",
    "software developer",
    "software architect",
    "application architect",
    "systems architect",
    "solution architect",
    "cloud architect",
    "web developer",
    "web application developer",
    "full stack developer",
    "frontend developer",
    "front end developer",
    "backend developer",
    "back end developer",
    "python developer",
    "java developer",
    "javascript developer",
    "typescript developer",
    "react developer",
    "angular developer",
    "vue developer",
    "node.js developer",
    "nodejs developer",
    "mobile developer",
    "android developer",
    "ios developer",
    "devops engineer",
    "devops developer",
    "cloud engineer",
    "database administrator",
    "database developer",
    "network engineer",
    "network administrator",
    "cybersecurity",
    "cyber security",
    "information security",
    "security engineer",
    "penetration tester",
    "ethical hacker",
    "data engineer",
    "data scientist",
    "data analyst",
    "database engineer",
    "computer programmer",
    "systems engineer",
    "information technology",
    "information systems",
]


# ============================================================
# HELPERS
# ============================================================

def normalize_text(value):
    if pd.isna(value):
        return ""

    value = str(value).strip().lower()

    value = re.sub(r"[\u2013\u2014]", "-", value)
    value = re.sub(r"\s+", " ", value)

    return value


def extract_soc_codes(value):
    text = str(value) if not pd.isna(value) else ""

    codes = re.findall(
        r"\b\d{2}-\d{4}(?:\.\d{2})?\b",
        text
    )

    return list(dict.fromkeys(codes))


def contains_keyword(title, keywords):
    title = normalize_text(title)

    for keyword in keywords:
        if keyword in title:
            return True

    return False


def is_excluded_title(title):
    title = normalize_text(title)

    for pattern in EXCLUDE_TITLE_PATTERNS:
        if re.search(pattern, title):
            return True

    return False


# ============================================================
# DOMAIN CLASSIFICATION
# ============================================================

def classify_domain(title, soc_codes):
    title = normalize_text(title)

    # ========================================================
    # 1. AI / ML / ROBOTICS
    # ========================================================

    if contains_keyword(title, AI_KEYWORDS):
        return "AI, Machine Learning & Robotics"

    # Explicit AI role that may not contain "AI"
    ai_specific_terms = [
        "machine learning",
        "deep learning",
        "computer vision",
        "robotics",
        "robotic",
        "autonomous",
        "intelligent systems",
        "natural language processing",
        "nlp engineer",
        "reinforcement learning",
        "generative ai",
    ]

    if any(term in title for term in ai_specific_terms):
        return "AI, Machine Learning & Robotics"

    # ========================================================
    # 2. AUTOMOTIVE
    # ========================================================

    if contains_keyword(title, AUTOMOTIVE_KEYWORDS):
        return "Automotive Engineering"

    # ========================================================
    # 3. AEROSPACE
    # ========================================================

    if contains_keyword(title, AEROSPACE_KEYWORDS):
        return "Aerospace Engineering"

    # ========================================================
    # 4. BIOMEDICAL
    # ========================================================

    if contains_keyword(title, BIOMEDICAL_KEYWORDS):
        return "Biomedical & Bioengineering"

    # ========================================================
    # 5. CHEMICAL
    # ========================================================

    if contains_keyword(title, CHEMICAL_KEYWORDS):
        return "Chemical Engineering"

    # ========================================================
    # 6. CIVIL
    # ========================================================

    if contains_keyword(title, CIVIL_KEYWORDS):
        return "Civil Engineering"

    # ========================================================
    # 7. ENVIRONMENTAL
    # ========================================================

    if contains_keyword(title, ENVIRONMENTAL_KEYWORDS):
        return "Environmental Engineering"

    # ========================================================
    # 8. MARINE
    # ========================================================

    if contains_keyword(title, MARINE_KEYWORDS):
        return "Marine Engineering"

    # ========================================================
    # 9. MINING / GEOLOGICAL
    # ========================================================

    if contains_keyword(title, MINING_KEYWORDS):
        return "Mining & Geological Engineering"

    # ========================================================
    # 10. MATERIALS
    # ========================================================

    if contains_keyword(title, MATERIALS_KEYWORDS):
        return "Materials Engineering"

    # ========================================================
    # 11. ELECTRONICS / ECE / EMBEDDED / IOT
    # ========================================================

    embedded_terms = [
        "embedded systems",
        "embedded system",
        "embedded engineer",
        "embedded software",
        "embedded developer",
        "iot engineer",
        "iot developer",
        "internet of things",
        "firmware engineer",
        "firmware developer",
        "vlsi engineer",
        "vlsi design",
        "semiconductor engineer",
        "microelectronics",
    ]

    if any(term in title for term in embedded_terms):
        return "Electronics & ECE"

    if contains_keyword(title, ECE_KEYWORDS):
        return "Electronics & ECE"

    # ========================================================
    # 12. ELECTRICAL
    # ========================================================

    if contains_keyword(title, ELECTRICAL_KEYWORDS):
        return "Electrical Engineering"

    # ========================================================
    # 13. ARCHITECTURE
    #
    # VERY IMPORTANT:
    # "Software Architect" and "Application Architect"
    # must NOT become physical Architecture.
    # ========================================================

    physical_architecture_terms = [
        "architect",
        "architecture",
        "architectural designer",
        "architectural engineer",
        "building designer",
        "landscape architect",
        "urban planner",
    ]

    software_architecture_terms = [
        "software architect",
        "application architect",
        "systems architect",
        "system architect",
        "solution architect",
        "cloud architect",
        "enterprise architect",
        "security architect",
        "network architect",
        "data architect",
        "technical architect",
        "it architect",
    ]

    if any(term in title for term in software_architecture_terms):
        return "Computer Science & IT"

    architecture_soc = any(
        soc.startswith("17-101")
        or soc.startswith("17-3011")
        for soc in soc_codes
    )

    if architecture_soc:
        return "Architecture & Construction Design"

    if any(term in title for term in physical_architecture_terms):
        return "Architecture & Construction Design"

    # ========================================================
    # 14. MECHANICAL
    # ========================================================

    if contains_keyword(title, MECHANICAL_KEYWORDS):
        return "Mechanical Engineering"

    # ========================================================
    # 15. INDUSTRIAL
    # ========================================================

    if contains_keyword(title, INDUSTRIAL_KEYWORDS):
        return "Industrial Engineering"

    # ========================================================
    # 16. COMPUTER SCIENCE / IT
    # ========================================================

    if contains_keyword(title, COMPUTER_KEYWORDS):
        return "Computer Science & IT"

    # ========================================================
    # 17. SOC-BASED CLASSIFICATION
    # ========================================================

    for soc in soc_codes:

        major = soc[:2]

        # ----------------------------------------------------
        # Computer / IT
        # ----------------------------------------------------

        if major == "15":
            return "Computer Science & IT"

        # ----------------------------------------------------
        # Engineering
        # ----------------------------------------------------

        if major == "17":

            if soc.startswith("17-101"):
                return "Architecture & Construction Design"

            if soc.startswith("17-205"):
                return "Civil Engineering"

            if soc.startswith("17-206"):
                return "Computer Hardware Engineering"

            if soc.startswith("17-207"):
                return "Electrical Engineering"

            if soc.startswith("17-208"):
                return "Electrical Engineering"

            if soc.startswith("17-211"):
                return "Industrial Engineering"

            if soc.startswith("17-212"):
                return "Marine Engineering"

            if soc.startswith("17-213"):
                return "Mining & Geological Engineering"

            if soc.startswith("17-214"):
                return "Mechanical Engineering"

            if soc.startswith("17-215"):
                return "Chemical Engineering"

            if soc.startswith("17-216"):
                return "Petroleum Engineering"

            if soc.startswith("17-217"):
                return "Environmental Engineering"

            if soc.startswith("17-219"):
                return "Other Engineering"

            if soc.startswith("17-301"):
                return "Architecture & Construction Design"

            return "Other Engineering"

        # ----------------------------------------------------
        # Science
        # ----------------------------------------------------

        if major == "19":
            return "Science & Research"

        # ----------------------------------------------------
        # Healthcare
        # ----------------------------------------------------

        if major in ["29", "31"]:
            return "Healthcare & Life Sciences"

        # ----------------------------------------------------
        # Legal
        # ----------------------------------------------------

        if major == "23":
            return "Legal"

        # ----------------------------------------------------
        # Design
        # ----------------------------------------------------

        if major == "27":
            return "Design & Creative Media"

        # ----------------------------------------------------
        # Business
        # ----------------------------------------------------

        if major == "13":
            return "Business & Administration"

        # ----------------------------------------------------
        # Education
        # ----------------------------------------------------

        if major == "25":
            return "Education"

        # ----------------------------------------------------
        # Social / Community
        # ----------------------------------------------------

        if major == "21":
            return "Social & Community Services"

    # ========================================================
    # NO RELIABLE CLASSIFICATION
    # ========================================================

    return None

    # --------------------------------------------------------
    # 2. ELECTRONICS / EMBEDDED / ECE
    # --------------------------------------------------------

    if contains_keyword(title, ECE_KEYWORDS):
        return "Electronics & ECE"

    # --------------------------------------------------------
    # 3. ELECTRICAL
    # --------------------------------------------------------

    if contains_keyword(title, ELECTRICAL_KEYWORDS):
        return "Electrical Engineering"

    # --------------------------------------------------------
    # 4. ARCHITECTURE
    #
    # Do NOT classify every title containing "architectural"
    # as architecture.
    # --------------------------------------------------------

    architecture_soc = False

    for soc in soc_codes:
        if soc.startswith("17-101"):
            architecture_soc = True

        if soc.startswith("17-3011"):
            architecture_soc = True

    if architecture_soc:
        return "Architecture & Construction Design"

    if contains_keyword(title, ARCHITECTURE_KEYWORDS):
        architecture_terms = [
            "architect",
            "architecture",
            "architectural designer",
            "building designer",
            "landscape architect",
            "urban planner",
        ]

        if any(term in title for term in architecture_terms):
            return "Architecture & Construction Design"

    # --------------------------------------------------------
    # 5. MECHANICAL
    # --------------------------------------------------------

    if contains_keyword(title, MECHANICAL_KEYWORDS):
        return "Mechanical Engineering"

    # --------------------------------------------------------
    # 6. INDUSTRIAL
    # --------------------------------------------------------

    if contains_keyword(title, INDUSTRIAL_KEYWORDS):
        return "Industrial Engineering"

    # --------------------------------------------------------
    # 7. COMPUTER SCIENCE / IT
    #
    # This is intentionally after specialized domains so:
    # Computer Vision Engineer -> AI
    # Robotics Engineer -> AI
    # Electronics Engineer -> ECE
    # Automotive Engineer -> Automotive
    # etc.
    # --------------------------------------------------------

    if contains_keyword(title, COMPUTER_KEYWORDS):
        return "Computer Science & IT"

    # --------------------------------------------------------
    # 8. SOC-BASED CLASSIFICATION
    # --------------------------------------------------------

    for soc in soc_codes:

        major = soc[:2]

        # Computer / IT
        if major == "15":
            return "Computer Science & IT"

        # Engineering / Architecture
        if major == "17":

            if soc.startswith("17-205"):
                return "Civil Engineering"

            if soc.startswith("17-206"):
                return "Computer Hardware Engineering"

            if soc.startswith("17-207"):
                return "Electrical Engineering"

            if soc.startswith("17-208"):
                return "Electrical Engineering"

            if soc.startswith("17-211"):
                return "Industrial Engineering"

            if soc.startswith("17-212"):
                return "Marine Engineering"

            if soc.startswith("17-213"):
                return "Mining & Geological Engineering"

            if soc.startswith("17-214"):
                return "Mechanical Engineering"

            if soc.startswith("17-215"):
                return "Chemical Engineering"

            if soc.startswith("17-216"):
                return "Petroleum Engineering"

            if soc.startswith("17-217"):
                return "Environmental Engineering"

            if soc.startswith("17-219"):
                return "Other Engineering"

            if soc.startswith("17-101"):
                return "Architecture & Construction Design"

            if soc.startswith("17-301"):
                return "Architecture & Construction Design"

            return "Other Engineering"

        # Physical / Life Sciences
        if major == "19":
            return "Science & Research"

        # Healthcare
        if major == "29":
            return "Healthcare & Life Sciences"

        if major == "31":
            return "Healthcare & Life Sciences"

        # Legal
        if major == "23":
            return "Legal"

        # Arts / Design
        if major == "27":
            return "Design & Creative Media"

        # Business / Finance
        if major == "13":
            return "Business & Administration"

        # Education-related professional roles
        if major == "25":
            return "Education"

        # Social / Community
        if major == "21":
            return "Social & Community Services"

    # --------------------------------------------------------
    # No reliable student-facing classification
    # --------------------------------------------------------

    return None


# ============================================================
# MAIN
# ============================================================

print("=" * 70)
print("CREATING FINAL STUDENT CAREER CATALOG")
print("=" * 70)

print(f"\nLoading:\n{INPUT_FILE}")

if not os.path.exists(INPUT_FILE):
    raise FileNotFoundError(
        f"\nInput file not found:\n{INPUT_FILE}"
    )

df = pd.read_csv(INPUT_FILE, low_memory=False)

print(f"Input rows: {len(df):,}")

required_columns = [
    "career_name",
    "onet_soc_code",
]

for column in required_columns:
    if column not in df.columns:
        raise ValueError(
            f"Required column '{column}' is missing from career_catalog.csv"
        )


# ============================================================
# CLEAN
# ============================================================

df["career_name"] = df["career_name"].fillna("").astype(str).str.strip()

df = df[df["career_name"] != ""].copy()


# ============================================================
# PROCESS
# ============================================================

rows = []

excluded_count = 0
unclassified_count = 0

for _, row in df.iterrows():

    career_name = row["career_name"]

    if is_excluded_title(career_name):
        excluded_count += 1
        continue

    soc_codes = extract_soc_codes(
        row.get("onet_soc_code", "")
    )

    domain = classify_domain(
        career_name,
        soc_codes
    )

    if not domain:
        unclassified_count += 1
        continue

    rows.append({
        "career_name": career_name,
        "onet_soc_code": " | ".join(soc_codes),
        "onet_occupation": row.get(
            "onet_occupation",
            ""
        ),
        "short_title": row.get(
            "short_title",
            ""
        ),
        "sources": row.get(
            "sources",
            ""
        ),
        "search_name": normalize_text(career_name),
        "domain": domain,
    })


result = pd.DataFrame(rows)


# ============================================================
# REMOVE DUPLICATES
# ============================================================

if not result.empty:

    grouped = (
        result
        .groupby(
            ["career_name", "domain"],
            as_index=False
        )
        .agg({
            "onet_soc_code": lambda x: " | ".join(
                sorted(
                    set(
                        code.strip()
                        for value in x
                        for code in str(value).split("|")
                        if code.strip()
                    )
                )
            ),
            "onet_occupation": lambda x: " | ".join(
                sorted(
                    set(
                        str(v).strip()
                        for v in x
                        if str(v).strip()
                        and str(v).strip().lower() != "nan"
                    )
                )
            ),
            "short_title": "first",
            "sources": lambda x: " | ".join(
                sorted(
                    set(
                        str(v).strip()
                        for v in x
                        if str(v).strip()
                        and str(v).strip().lower() != "nan"
                    )
                )
            ),
            "search_name": "first",
        })
    )

else:
    grouped = pd.DataFrame()


# ============================================================
# SORT
# ============================================================

if not grouped.empty:

    domain_order = [
        "Computer Science & IT",
        "AI, Machine Learning & Robotics",
        "Web Development",
        "Cloud & DevOps",
        "Cybersecurity",
        "Data & Analytics",
        "Computer Hardware Engineering",
        "Electronics & ECE",
        "Electrical Engineering",
        "Embedded Systems & IoT",
        "Civil Engineering",
        "Mechanical Engineering",
        "Automotive Engineering",
        "Aerospace Engineering",
        "Chemical Engineering",
        "Biomedical & Bioengineering",
        "Environmental Engineering",
        "Industrial Engineering",
        "Materials Engineering",
        "Marine Engineering",
        "Mining & Geological Engineering",
        "Petroleum Engineering",
        "Architecture & Construction Design",
        "Science & Research",
        "Healthcare & Life Sciences",
        "Business & Administration",
        "Finance & Accounting",
        "Legal",
        "Education",
        "Design & Creative Media",
        "Social & Community Services",
        "Other Engineering",
    ]

    domain_rank = {
        domain: index
        for index, domain in enumerate(domain_order)
    }

    grouped["_domain_rank"] = grouped["domain"].map(
        lambda x: domain_rank.get(x, 999)
    )

    grouped = grouped.sort_values(
        ["_domain_rank", "career_name"]
    )

    grouped = grouped.drop(
        columns=["_domain_rank"]
    )


# ============================================================
# SAVE
# ============================================================

grouped.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)


# ============================================================
# REPORT
# ============================================================

print("\n" + "=" * 70)
print("FINAL STUDENT CAREER CATALOG CREATED")
print("=" * 70)

print(f"Original rows:       {len(df):,}")
print(f"Excluded roles:      {excluded_count:,}")
print(f"Unclassified roles:  {unclassified_count:,}")
print(f"Student careers:     {len(grouped):,}")

print("\nDomains:")

if not grouped.empty:

    counts = (
        grouped["domain"]
        .value_counts()
        .sort_index()
    )

    for domain, count in counts.items():
        print(
            f"{domain:<45} {count:>6}"
        )


# ============================================================
# IMPORTANT SAMPLE CHECKS
# ============================================================

print("\n" + "=" * 70)
print("SAMPLE CLASSIFICATION CHECKS")
print("=" * 70)

sample_titles = [
    "AI Engineer",
    "Machine Learning Engineer",
    "Computer Vision Engineer",
    "Robotics Engineer",
    "Full Stack Developer",
    "Software Engineer",
    "Software Architect",
    "Application Architect",
    "Civil Engineer",
    "Civil Engineering Designer",
    "Mechanical Engineer",
    "Automotive Engineer",
    "Electrical Engineer",
    "Electronics Engineer",
    "Embedded Systems Engineer",
    "Chemical Engineer",
    "Aerospace Engineer",
    "Biomedical Engineer",
    "Environmental Engineer",
    "Architect",
    "Architectural Designer",
]

for sample in sample_titles:

    matches = grouped[
        grouped["career_name"].str.lower()
        == sample.lower()
    ]

    if matches.empty:
        print(f"{sample:<35} NOT FOUND")
    else:
        domains = " | ".join(
            matches["domain"].dropna().unique()
        )

        socs = " | ".join(
            matches["onet_soc_code"].dropna().unique()
        )

        print(
            f"{sample:<35} {domains} — {socs}"
        )


print("\nSaved to:")
print(OUTPUT_FILE)

print("\nDONE.")