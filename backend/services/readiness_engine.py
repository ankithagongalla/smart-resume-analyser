# =========================================================
# O*NET CAREER READINESS ENGINE
# =========================================================


def calculate_readiness(skill_gap_result):

    if not skill_gap_result.get("success"):
        return {
            "success": False,
            "message": "Skill gap analysis is not available."
        }

    technologies = skill_gap_result.get("technologies", {})
    essential = skill_gap_result.get("essential_skills", {})
    transferable = skill_gap_result.get("transferable_skills", {})

    # -----------------------------------------------------
    # READ MATCH RESULTS DIRECTLY
    # -----------------------------------------------------

    tech_all = technologies.get("all", [])
    essential_all = essential.get("all", [])
    transferable_all = transferable.get("all", [])

    # -----------------------------------------------------
    # COUNTS
    # -----------------------------------------------------

    tech_required = len(tech_all)
    essential_required = len(essential_all)
    transferable_required = len(transferable_all)

    tech_matched = len([
        x for x in tech_all
        if x.get("status") == "matched"
    ])

    essential_matched = len([
        x for x in essential_all
        if x.get("status") == "matched"
    ])

    transferable_matched = len([
        x for x in transferable_all
        if x.get("status") == "matched"
    ])

    # -----------------------------------------------------
    # COVERAGE
    # -----------------------------------------------------

    technology_coverage = (
        tech_matched / tech_required * 100
        if tech_required else 100
    )

    essential_coverage = (
        essential_matched / essential_required * 100
        if essential_required else 100
    )

    transferable_coverage = (
        transferable_matched / transferable_required * 100
        if transferable_required else 100
    )

    # -----------------------------------------------------
    # WEIGHTED SCORE
    # -----------------------------------------------------

    score = (
        technology_coverage * 0.50
        + essential_coverage * 0.30
        + transferable_coverage * 0.20
    )

    score = round(score, 2)

    # -----------------------------------------------------
    # READINESS LEVEL
    # -----------------------------------------------------

    if score >= 80:
        level = "High"

    elif score >= 60:
        level = "Moderate"

    elif score >= 40:
        level = "Developing"

    else:
        level = "Early Stage"

    # -----------------------------------------------------
    # RESULT
    # -----------------------------------------------------

    return {

        "success": True,

        "score": score,

        "level": level,

        "coverage": {

            "technologies": round(
                technology_coverage,
                2
            ),

            "essential_skills": round(
                essential_coverage,
                2
            ),

            "transferable_skills": round(
                transferable_coverage,
                2
            )

        },

        "matched": {

            "technologies": tech_matched,

            "essential_skills": essential_matched,

            "transferable_skills": transferable_matched

        },

        "required": {

            "technologies": tech_required,

            "essential_skills": essential_required,

            "transferable_skills": transferable_required

        },

        "weights": {

            "technologies": 50,

            "essential_skills": 30,

            "transferable_skills": 20

        }

    }