from services.occupation_profile import load_occupation_profile
from services.skill_mapper import map_required_skills


def normalize(text):
    return str(text).strip().lower()


# =========================================================
# CAREER-RELEVANT SKILL FILTER
# =========================================================

WEB_DEVELOPER_KEYWORDS = [
    "web",
    "website",
    "software",
    "programming",
    "programming language",
    "development",
    "developer",
    "database",
    "data base",
    "javascript",
    "html",
    "css",
    "python",
    "java",
    "sql",
    "application",
    "server",
    "api",
    "framework",
    "interface",
    "user interface",
    "testing",
    "debugging",
    "troubleshooting",
    "systems analysis",
    "systems evaluation",
    "technology design",
    "computer",
    "information technology",
    "critical thinking",
    "problem solving",
    "reading comprehension",
    "writing",
    "speaking",
    "active learning",
    "learning strategies",
    "time management",
    "coordination",
    "judgment",
    "decision making",
    "social perceptiveness"
]


def is_relevant_skill(skill):
    """
    Keeps skills that are reasonably relevant to
    software/web-development careers.
    """

    skill_name = normalize(skill)

    if not skill_name:
        return False

    return any(
        keyword in skill_name
        for keyword in WEB_DEVELOPER_KEYWORDS
    )


def filter_relevant_skills(skills):
    """
    Filters occupation requirements before
    performing resume-to-career matching.
    """

    filtered = []

    for skill in skills:

        if isinstance(skill, dict):

            name = (
                skill.get("name")
                or skill.get("skill")
                or skill.get("required_skill")
                or ""
            )

            if is_relevant_skill(name):
                filtered.append(skill)

        else:

            if is_relevant_skill(skill):
                filtered.append(skill)

    return filtered


def compare_resume_with_career(
    resume_skills,
    soc_code
):

    profile = load_occupation_profile(
        soc_code
    )

    if not profile:
        return {
            "success": False,
            "message": "Occupation profile not found."
        }

    # =====================================================
    # TECHNOLOGIES
    # =====================================================

    required_technologies = filter_relevant_skills(
        profile.get(
            "technologies",
            []
        )
    )

    technology_mapping = map_required_skills(
        resume_skills,
        required_technologies
    )

    # =====================================================
    # ESSENTIAL SKILLS
    # =====================================================

    required_essential = []

    for skill in profile.get(
        "essential_skills",
        []
    ):

        if isinstance(skill, dict):

            name = skill.get(
                "name",
                ""
            )

        else:

            name = str(skill)

        if is_relevant_skill(name):

            required_essential.append(
                name
            )

    essential_mapping = map_required_skills(
        resume_skills,
        required_essential
    )

    # =====================================================
    # TRANSFERABLE SKILLS
    # =====================================================

    required_transferable = (
        filter_relevant_skills(
            profile.get(
                "transferable_skills",
                []
            )
        )
    )

    transferable_mapping = map_required_skills(
        resume_skills,
        required_transferable
    )

    # =====================================================
    # MISSING ITEMS
    # =====================================================

    technology_missing = [
        item
        for item in technology_mapping
        if item["status"] == "missing"
    ]

    essential_missing = [
        item
        for item in essential_mapping
        if item["status"] == "missing"
    ]

    transferable_missing = [
        item
        for item in transferable_mapping
        if item["status"] == "missing"
    ]

    # =====================================================
    # MATCHED ITEMS
    # =====================================================

    technology_matched = [
        item
        for item in technology_mapping
        if item["status"] == "matched"
    ]

    essential_matched = [
        item
        for item in essential_mapping
        if item["status"] == "matched"
    ]

    transferable_matched = [
        item
        for item in transferable_mapping
        if item["status"] == "matched"
    ]

    # =====================================================
    # FINAL RESULT
    # =====================================================

    return {

        "success": True,

        "career": {
            "soc_code":
                profile.get(
                    "soc_code"
                ),

            "title":
                profile.get(
                    "title"
                )
        },

        "technologies": {

            "required":
                len(
                    required_technologies
                ),

            "matched":
                technology_matched,

            "missing":
                technology_missing,

            "all":
                technology_mapping

        },

        "essential_skills": {

            "required":
                len(
                    required_essential
                ),

            "matched":
                essential_matched,

            "missing":
                essential_missing,

            "all":
                essential_mapping

        },

        "transferable_skills": {

            "required":
                len(
                    required_transferable
                ),

            "matched":
                transferable_matched,

            "missing":
                transferable_missing,

            "all":
                transferable_mapping

        },

        "tasks":
            profile.get(
                "tasks",
                []
            )

    }