# =========================================================
# CAREER READINESS PREDICTOR
# =========================================================

def predict_readiness(
    matched_count,
    total_skills,
    missing_count
):
    """
    Calculate a baseline career-readiness score.

    This is the initial rule-based version.
    Later this function will be replaced/extended
    with the trained ML model.
    """

    if total_skills <= 0:
        return {
            "score": 0,
            "level": "Insufficient Data"
        }

    skill_match_score = (
        matched_count / total_skills
    ) * 100

    # Initial readiness interpretation
    if skill_match_score >= 80:
        level = "High Readiness"

    elif skill_match_score >= 60:
        level = "Moderate Readiness"

    elif skill_match_score >= 40:
        level = "Developing"

    else:
        level = "Needs Improvement"

    return {
        "score": round(skill_match_score, 2),
        "level": level
    }