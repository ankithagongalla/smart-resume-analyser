from models.career_models import (
    StudentProfile,
    StudentProject,
    StudentCertification,
    StudentExperience,
    StudentActivity
)


def calculate_career_readiness(student_id):

    profile = StudentProfile.query.get(student_id)

    if not profile:
        return {
            "success": False,
            "message": "Student not found."
        }

    # =========================================================
    # COLLECT STUDENT EVIDENCE
    # =========================================================

    projects = StudentProject.query.filter_by(
        student_id=student_id
    ).all()

    certifications = StudentCertification.query.filter_by(
        student_id=student_id
    ).all()

    experiences = StudentExperience.query.filter_by(
        student_id=student_id
    ).all()

    activities = StudentActivity.query.filter_by(
        student_id=student_id
    ).all()

    # =========================================================
    # 1. SOFT SKILLS SCORE
    # =========================================================

    communication = profile.communication or 0
    leadership = profile.leadership or 0
    teamwork = profile.teamwork or 0
    problem_solving = profile.problem_solving or 0

    soft_skill_score = (
        communication +
        leadership +
        teamwork +
        problem_solving
    ) / 4

    soft_skill_component = (
        soft_skill_score / 10
    ) * 40

    # =========================================================
    # 2. PROJECT EVIDENCE
    # =========================================================

    project_score = min(
        len(projects) * 10,
        20
    )

    # =========================================================
    # 3. CERTIFICATION EVIDENCE
    # =========================================================

    certification_score = min(
        len(certifications) * 5,
        10
    )

    # =========================================================
    # 4. EXPERIENCE EVIDENCE
    # =========================================================

    experience_score = min(
        len(experiences) * 10,
        20
    )

    # =========================================================
    # 5. ACTIVITY EVIDENCE
    # =========================================================

    activity_score = min(
        len(activities) * 5,
        10
    )

    # =========================================================
    # 6. TECHNICAL SKILL EVIDENCE
    # =========================================================

    technical_skill_count = 0

    if profile.technical_skills:

        technical_skills = [
            skill.strip()
            for skill in profile.technical_skills.split(",")
            if skill.strip()
        ]

        technical_skill_count = len(
            technical_skills
        )

    technical_skill_score = min(
        technical_skill_count * 1.5,
        10
    )

    # =========================================================
    # FINAL READINESS SCORE
    # =========================================================
    #
    # Maximum:
    #
    # Soft skills       = 40
    # Projects          = 20
    # Certifications    = 10
    # Experience        = 20
    # Activities        = 10
    # Technical skills  = 10
    #
    # Total raw maximum = 110
    #
    # We normalize it to 100.
    # =========================================================

    raw_score = (
        soft_skill_component +
        project_score +
        certification_score +
        experience_score +
        activity_score +
        technical_skill_score
    )

    readiness_score = (
        raw_score / 110
    ) * 100

    readiness_score = min(
        round(readiness_score, 2),
        100
    )

    # =========================================================
    # READINESS LEVEL
    # =========================================================

    if readiness_score >= 80:

        level = "Career Ready"

    elif readiness_score >= 60:

        level = "Developing"

    elif readiness_score >= 40:

        level = "Intermediate"

    else:

        level = "Early Stage"

    # =========================================================
    # RETURN RESULT
    # =========================================================

    return {

        "success": True,

        "student_id": student_id,

        "target_career": profile.target_career,

        "readiness_score": readiness_score,

        "readiness_level": level,

        "evidence": {

            "projects": len(projects),

            "certifications": len(certifications),

            "experiences": len(experiences),

            "activities": len(activities),

            "technical_skills":
                technical_skill_count

        },

        "score_breakdown": {

            "soft_skills":
                round(
                    soft_skill_component,
                    2
                ),

            "projects":
                project_score,

            "certifications":
                certification_score,

            "experience":
                experience_score,

            "activities":
                activity_score,

            "technical_skills":
                technical_skill_score

        },

        "soft_skills": {

            "communication":
                communication,

            "leadership":
                leadership,

            "teamwork":
                teamwork,

            "problem_solving":
                problem_solving

        }

    }