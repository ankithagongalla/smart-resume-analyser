import pandas as pd
from pathlib import Path


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent

DATASETS_DIR = BASE_DIR / "datasets"

JOB_TITLES_FILE = DATASETS_DIR / "job_titles.csv"

OUTPUT_FILE = DATASETS_DIR / "career_catalog.csv"


# ============================================================
# LOAD O*NET JOB TITLES
# ============================================================

print("Loading O*NET job titles...")

df = pd.read_csv(
    JOB_TITLES_FILE,
    dtype=str,
    keep_default_na=False
)

print(f"Original rows: {len(df):,}")


# ============================================================
# CLEAN COLUMN NAMES
# ============================================================

df.columns = [
    column.strip()
    for column in df.columns
]


required_columns = [
    "O*NET-SOC Code",
    "Title",
    "Job Title",
    "Short Title",
    "Source(s)",
]


missing_columns = [
    column
    for column in required_columns
    if column not in df.columns
]


if missing_columns:
    raise ValueError(
        f"Missing columns: {missing_columns}"
    )


# ============================================================
# BASIC CLEANING
# ============================================================

for column in required_columns:
    df[column] = (
        df[column]
        .astype(str)
        .str.strip()
    )


# Remove rows without a job title
df = df[
    df["Job Title"].str.strip() != ""
].copy()


# ============================================================
# NORMALIZE CAREER NAME
# ============================================================

df["career_name"] = (
    df["Job Title"]
    .str.replace(r"\s+", " ", regex=True)
    .str.strip()
)


# ============================================================
# REMOVE EXACT DUPLICATE MAPPINGS
# ============================================================

df = df.drop_duplicates(
    subset=[
        "career_name",
        "O*NET-SOC Code",
    ]
)


# ============================================================
# GROUP MULTIPLE O*NET MAPPINGS
# ============================================================

catalog = (
    df.groupby("career_name", as_index=False)
    .agg(
        {
            "O*NET-SOC Code": lambda values:
                " | ".join(
                    sorted(
                        set(
                            value.strip()
                            for value in values
                            if value.strip()
                        )
                    )
                ),

            "Title": lambda values:
                " | ".join(
                    sorted(
                        set(
                            value.strip()
                            for value in values
                            if value.strip()
                        )
                    )
                ),

            "Short Title": lambda values:
                " | ".join(
                    sorted(
                        set(
                            value.strip()
                            for value in values
                            if value.strip()
                        )
                    )
                ),

            "Source(s)": lambda values:
                " | ".join(
                    sorted(
                        set(
                            value.strip()
                            for value in values
                            if value.strip()
                        )
                    )
                ),
        }
    )
)


# ============================================================
# RENAME COLUMNS
# ============================================================

catalog = catalog.rename(
    columns={
        "O*NET-SOC Code": "onet_soc_code",
        "Title": "onet_occupation",
        "Short Title": "short_title",
        "Source(s)": "sources",
    }
)


# ============================================================
# ADD SEARCH-FRIENDLY LOWERCASE FIELD
# ============================================================

catalog["search_name"] = (
    catalog["career_name"]
    .str.lower()
)


# ============================================================
# ALPHABETICAL ORDER
# ============================================================

catalog = catalog.sort_values(
    by="career_name",
    key=lambda column: column.str.lower()
)


# ============================================================
# RESET INDEX
# ============================================================

catalog = catalog.reset_index(drop=True)


# ============================================================
# SAVE
# ============================================================

catalog.to_csv(
    OUTPUT_FILE,
    index=False,
    encoding="utf-8-sig"
)


# ============================================================
# SUMMARY
# ============================================================

print()
print("==============================================")
print("CAREER CATALOG CREATED")
print("==============================================")

print(
    f"Unique career/job titles: {len(catalog):,}"
)

print(
    f"Output file: {OUTPUT_FILE}"
)

print()
print("Columns:")
print(
    ", ".join(catalog.columns)
)

print()
print("First 30 career titles:")
print(
    catalog[
        [
            "career_name",
            "onet_soc_code",
            "onet_occupation",
        ]
    ]
    .head(30)
    .to_string(index=False)
)

print()
print("Done.")
