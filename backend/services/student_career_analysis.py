from models.career_models import StudentProfile

from services.career_readiness_engine import (
    calculate_career_readiness
)

from services.skill_gap_engine import (
    compare_resume_with_career
)

from services.profile_skill_mapper import (
    map_profile_to_onet_skills
)

from services.roadmap_generator import (
    generate_roadmap
)


# =========================================================
# HELPER
# =========================================================

def get_skill_name(item):

    if isinstance(item, dict):
        return str(
            item.get("required_skill")
            or item.get("skill")
            or item.get("name")
            or ""
        ).strip()

    return str(item).strip()


# =========================================================
# EVIDENCE-AWARE SKILLS
# =========================================================

def build_evidence_aware_skills(
    skill_gap,
    profile_supported
):

    evidence_skills = []

    categories = [
        ("technologies", "Technology"),
        ("essential_skills", "Essential Skill"),
        ("transferable_skills", "Transferable Skill")
    ]

    # -----------------------------------------------------
    # Resume matched skills
    # -----------------------------------------------------

    for category_key, category_name in categories:

        category_data = skill_gap.get(
            category_key,
            {}
        )

        matched = category_data.get(
            "matched",
            []
        )

        for item in matched:

            skill_name = get_skill_name(item)

            if not skill_name:
                continue

            evidence_skills.append({
                "skill": skill_name,
                "category": category_name,
                "match_type": "DIRECT MATCH",
                "source": "resume"
            })

    # -----------------------------------------------------
    # Profile supported skills
    # -----------------------------------------------------

    if isinstance(profile_supported, list):

        for item in profile_supported:

            if not isinstance(item, dict):
                continue

            skill_name = get_skill_name(item)

            if not skill_name:
                continue

            already_added = any(
                str(existing.get("skill", "")).strip().lower()
                == skill_name.lower()
                for existing in evidence_skills
            )

            if already_added:
                continue

            evidence_skills.append({
                "skill": skill_name,
                "category": item.get(
                    "category",
                    "Profile Skill"
                ),
                "match_type": item.get(
                    "match_type",
                    "PROFILE-SUPPORTED"
                ),
                "source": item.get(
                    "source",
                    "student profile"
                ),
                "evidence": item.get(
                    "evidence",
                    ""
                )
            })

    # -----------------------------------------------------
    # Remove duplicates
    # -----------------------------------------------------

    unique_skills = []
    seen = set()

    for item in evidence_skills:

        skill_name = str(
            item.get(
                "skill",
                ""
            )
        ).strip()

        key = skill_name.lower()

        if not key:
            continue

        if key in seen:
            continue

        seen.add(key)

        unique_skills.append(item)

    return unique_skills


# =========================================================
# ANALYZE STUDENT CAREER
# =========================================================

def analyze_student_career(
    student_id,
    resume_skills,
    soc_code
):

    # -----------------------------------------------------
    # Load student profile
    # -----------------------------------------------------

    profile = StudentProfile.query.get(
        student_id
    )

    if not profile:

        return {
            "success": False,
            "message": "Student profile not found."
        }

    # -----------------------------------------------------
    # Career readiness
    # -----------------------------------------------------

    readiness = calculate_career_readiness(
        student_id
    )

    if not readiness.get("success"):

        return readiness

    # -----------------------------------------------------
    # Career skill gap
    # -----------------------------------------------------

    skill_gap = compare_resume_with_career(
        resume_skills,
        soc_code
    )

    if not skill_gap.get("success"):

        return {
            "success": False,
            "message": "Career skill-gap analysis failed."
        }

    # -----------------------------------------------------
    # Profile evidence
    # -----------------------------------------------------

    profile_supported = map_profile_to_onet_skills(
        profile
    )

    # -----------------------------------------------------
    # Evidence-aware skills
    # -----------------------------------------------------

    evidence_aware_skills = build_evidence_aware_skills(
        skill_gap,
        profile_supported
    )

    # -----------------------------------------------------
    # Missing skills
    # -----------------------------------------------------

    technology_missing = (
        skill_gap
        .get("technologies", {})
        .get("missing", [])
    )

    essential_missing = (
        skill_gap
        .get("essential_skills", {})
        .get("missing", [])
    )

    transferable_missing = (
        skill_gap
        .get("transferable_skills", {})
        .get("missing", [])
    )

    missing_skills = (
        technology_missing
        + essential_missing
        + transferable_missing
    )

    # -----------------------------------------------------
    # Personalized roadmap
    # -----------------------------------------------------

    roadmap = generate_roadmap(
        missing_skills=missing_skills,
        career=skill_gap.get("career"),
        readiness_score=readiness.get(
            "readiness_score"
        )
    )

    # -----------------------------------------------------
    # Matched count
    # -----------------------------------------------------

    matched_skills_count = (
        len(
            skill_gap
            .get("technologies", {})
            .get("matched", [])
        )
        +
        len(
            skill_gap
            .get("essential_skills", {})
            .get("matched", [])
        )
        +
        len(
            skill_gap
            .get("transferable_skills", {})
            .get("matched", [])
        )
    )

    # -----------------------------------------------------
    # Missing count
    # -----------------------------------------------------

    missing_skills_count = (
        len(technology_missing)
        + len(essential_missing)
        + len(transferable_missing)
    )

    # -----------------------------------------------------
    # Final response
    # -----------------------------------------------------

    return {

        "success": True,

        "summary": {

            "readiness_score":
                readiness.get(
                    "readiness_score",
                    0
                ),

            "readiness_level":
                readiness.get(
                    "readiness_level",
                    "Unknown"
                ),

            "technical_skills":
                len(resume_skills),

            "matched_skills":
                matched_skills_count,

            "missing_skills":
                missing_skills_count,

            "projects":
                readiness
                .get("evidence", {})
                .get("projects", 0),

            "certifications":
                readiness
                .get("evidence", {})
                .get("certifications", 0),

            "experiences":
                readiness
                .get("evidence", {})
                .get("experiences", 0),

            "activities":
                readiness
                .get("evidence", {})
                .get("activities", 0)
        },

        "student": {

            "student_id":
                student_id,

            "target_career":
                readiness.get(
                    "target_career"
                )
        },

        "career_readiness": {

            "score":
                readiness.get(
                    "readiness_score"
                ),

            "level":
                readiness.get(
                    "readiness_level"
                )
        },

        "evidence_aware_skills":
            evidence_aware_skills,

        "skill_gap": {

            "technologies":
                skill_gap.get(
                    "technologies",
                    {}
                ),

            "essential_skills":
                skill_gap.get(
                    "essential_skills",
                    {}
                ),

            "transferable_skills":
                skill_gap.get(
                    "transferable_skills",
                    {}
                )
        },

        "roadmap":
            roadmap,

        "evidence":
            readiness.get(
                "evidence",
                {}
            ),

        "soft_skills":
            readiness.get(
                "soft_skills",
                {}
            )
    }