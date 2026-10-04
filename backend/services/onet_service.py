import os
import pandas as pd


# =========================================================
# O*NET DATA LOCATION
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

DATASET_DIR = os.path.join(
    BASE_DIR,
    "datasets"
)


# =========================================================
# LOAD DATA
# =========================================================

occupation_df = pd.read_csv(
    os.path.join(
        DATASET_DIR,
        "occupation_data.csv"
    )
)

software_df = pd.read_csv(
    os.path.join(
        DATASET_DIR,
        "software_skills.csv"
    )
)

essential_df = pd.read_csv(
    os.path.join(
        DATASET_DIR,
        "essential_skills.csv"
    )
)

transferable_df = pd.read_csv(
    os.path.join(
        DATASET_DIR,
        "transferable_skills.csv"
    )
)

task_df = pd.read_csv(
    os.path.join(
        DATASET_DIR,
        "task_statements.csv"
    )
)


# =========================================================
# FIND OCCUPATION
# =========================================================

def find_occupation(career_name):

    if not career_name:
        return None

    career_name = career_name.strip().lower()

    matches = occupation_df[
        occupation_df["Title"]
        .str.lower()
        .str.contains(
            career_name,
            na=False
        )
    ]

    if matches.empty:
        return None

    row = matches.iloc[0]

    return {
        "onet_soc_code": row["O*NET-SOC Code"],
        "title": row["Title"],
        "description": row["Description"]
    }


# =========================================================
# SOFTWARE SKILLS
# =========================================================

def get_software_skills(onet_code):

    data = software_df[
        software_df["O*NET-SOC Code"]
        == onet_code
    ].copy()

    if data.empty:
        return []

    # Prioritize technologies marked
    # Hot Technology or In Demand

    data["priority"] = (
        data["Hot Technology"].eq("Y").astype(int)
        +
        data["In Demand"].eq("Y").astype(int)
    )

    data = data.sort_values(
        "priority",
        ascending=False
    )

    skills = []

    for _, row in data.iterrows():

        skills.append({
            "name": row["Workplace Example"],
            "category": row["Element Name"],
            "hot_technology":
                row["Hot Technology"] == "Y",
            "in_demand":
                row["In Demand"] == "Y"
        })

    return skills


# =========================================================
# ESSENTIAL SKILLS
# =========================================================

def get_essential_skills(onet_code):

    data = essential_df[
        (essential_df["O*NET-SOC Code"] == onet_code)
        &
        (essential_df["Scale Name"] == "Importance")
    ].copy()

    data = data.sort_values(
        "Data Value",
        ascending=False
    )

    skills = []

    for _, row in data.iterrows():

        skills.append({
            "name": row["Element Name"],
            "importance":
                float(row["Data Value"])
        })

    return skills


# =========================================================
# TRANSFERABLE SKILLS
# =========================================================

def get_transferable_skills(onet_code):

    data = transferable_df[
        (transferable_df["O*NET-SOC Code"] == onet_code)
        &
        (transferable_df["Scale Name"] == "Importance")
    ].copy()

    data = data.sort_values(
        "Data Value",
        ascending=False
    )

    skills = []

    for _, row in data.iterrows():

        skills.append({
            "name": row["Element Name"],
            "importance":
                float(row["Data Value"])
        })

    return skills


# =========================================================
# REAL OCCUPATION TASKS
# =========================================================

def get_tasks(onet_code):

    data = task_df[
        task_df["O*NET-SOC Code"] == onet_code
    ]

    # Core tasks first

    core = data[
        data["Task Type"] == "Core"
    ]

    if core.empty:
        core = data

    tasks = []

    for _, row in core.iterrows():

        tasks.append({
            "task_id": row["Task ID"],
            "task": row["Task"],
            "type": row["Task Type"]
        })

    return tasks


# =========================================================
# COMPLETE CAREER PROFILE
# =========================================================

def get_career_profile(career_name):

    occupation = find_occupation(
        career_name
    )

    if not occupation:
        return None

    code = occupation[
        "onet_soc_code"
    ]

    return {

        "occupation": occupation,

        "software_skills":
            get_software_skills(code),

        "essential_skills":
            get_essential_skills(code),

        "transferable_skills":
            get_transferable_skills(code),

        "tasks":
            get_tasks(code)

    }