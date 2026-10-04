import csv
import os


# =========================================================
# O*NET CAREER DATA
# =========================================================

BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.abspath(__file__))
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "occupation_data.csv"
)


def load_occupations():

    occupations = []

    if not os.path.exists(DATASET_PATH):
        print("O*NET dataset not found:")
        print(DATASET_PATH)
        return occupations

    try:

        with open(
            DATASET_PATH,
            "r",
            encoding="utf-8-sig"
        ) as file:

            reader = csv.DictReader(file)

            print(
                "O*NET CSV COLUMNS:",
                reader.fieldnames
            )

            for index, row in enumerate(reader):

                # O*NET occupation_data.csv normally contains:
                # code, title, description

                code = (
                    row.get("code")
                    or row.get("Code")
                    or row.get("O*NET-SOC Code")
                    or ""
                ).strip()

                title = (
                    row.get("title")
                    or row.get("Title")
                    or row.get("Occupation")
                    or ""
                ).strip()

                description = (
                    row.get("description")
                    or row.get("Description")
                    or ""
                ).strip()

                if not title:
                    continue

                occupations.append(
                    {
                        "id": code or str(index + 1),
                        "name": title,
                        "description": description
                    }
                )

        # Alphabetical order
        occupations.sort(
            key=lambda item: item["name"].lower()
        )

        print(
            f"O*NET occupations loaded: {len(occupations)}"
        )

        return occupations

    except Exception as error:

        print(
            "ERROR loading O*NET occupations:",
            error
        )

        return []


def search_occupations(search_text=""):

    occupations = load_occupations()

    search_text = (
        search_text
        .strip()
        .lower()
    )

    if not search_text:
        return occupations

    return [
        occupation
        for occupation in occupations
        if search_text in occupation["name"].lower()
        or search_text in occupation["description"].lower()
    ]