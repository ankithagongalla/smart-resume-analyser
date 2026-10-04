import pandas as pd
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[2]
DATASET_DIR = BASE_DIR / "datasets"


def load_occupation_profile(soc_code):

    occupation_file = DATASET_DIR / "occupation_data.csv"
    software_file = DATASET_DIR / "software_skills.csv"
    essential_file = DATASET_DIR / "essential_skills.csv"
    transferable_file = DATASET_DIR / "transferable_skills.csv"
    task_file = DATASET_DIR / "task_statements.csv"

    occupation_df = pd.read_csv(occupation_file)
    software_df = pd.read_csv(software_file)
    essential_df = pd.read_csv(essential_file)
    transferable_df = pd.read_csv(transferable_file)
    task_df = pd.read_csv(task_file)

    # -----------------------------------------
    # OCCUPATION
    # -----------------------------------------

    occupation = occupation_df[
        occupation_df["O*NET-SOC Code"] == soc_code
    ]

    if occupation.empty:
        return None

    occupation_row = occupation.iloc[0]

   # -----------------------------------------
# SOFTWARE / TECHNOLOGIES
# -----------------------------------------

software = software_df[
    software_df["O*NET-SOC Code"] == soc_code
].copy()

software = software[
    software["In Demand"].astype(str).str.upper() == "Y"
]

technologies = (
    software["Element Name"]
    .dropna()
    .drop_duplicates()
    .tolist()
)

# Keep only career-relevant backend technologies
backend_allowed = {
    "Python",
    "JavaScript",
    "Node.js",
    "SQL",
    "REST API",
    "Database Management",
    "Git",
    "GitHub",
    "JSON",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "Docker",
    "Amazon Web Services",
}

if "Back End Developer" in occupation_row["Title"]:
    technologies = [
        skill for skill in technologies
        if skill in backend_allowed
    ]

    # -----------------------------------------
    # ESSENTIAL SKILLS
    # -----------------------------------------

    essential = essential_df[
        essential_df["O*NET-SOC Code"] == soc_code
    ].copy()

    essential_skills = []

    for skill_name, group in essential.groupby("Element Name"):

        importance = group[
            group["Scale Name"] == "Importance"
        ]

        level = group[
            group["Scale Name"] == "Level"
        ]

        importance_value = None
        level_value = None

        if not importance.empty:
            importance_value = float(
                importance.iloc[0]["Data Value"]
            )

        if not level.empty:
            level_value = float(
                level.iloc[0]["Data Value"]
            )

        essential_skills.append({
            "name": skill_name,
            "importance": importance_value,
            "level": level_value
        })

    # -----------------------------------------
    # TRANSFERABLE SKILLS
    # -----------------------------------------

    transferable = transferable_df[
        transferable_df["O*NET-SOC Code"] == soc_code
    ].copy()

    transferable_skills = (
        transferable["Element Name"]
        .dropna()
        .drop_duplicates()
        .tolist()
    )

    # -----------------------------------------
    # TASKS
    # -----------------------------------------

    tasks = task_df[
        task_df["O*NET-SOC Code"] == soc_code
    ].copy()

    task_list = []

    for _, row in tasks.iterrows():

        task_list.append({
            "id": str(row["Task ID"]),
            "task": row["Task"]
        })

    # -----------------------------------------
    # FINAL PROFILE
    # -----------------------------------------

    return {

        "soc_code": soc_code,

        "title": occupation_row["Title"],

        "description": occupation_row["Description"],

        "technologies": technologies,

        "essential_skills": essential_skills,

        "transferable_skills": transferable_skills,

        "tasks": task_list

    }