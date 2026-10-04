def map_profile_to_onet_skills(profile):
    """
    Build skill evidence from the complete student profile.

    Evidence sources:
    1. Student profile / soft skills
    2. Technical skills
    3. Projects
    4. Certifications
    5. Experience
    6. Activities
    """

    supported = {}

    def add_skill(skill, source, evidence):
        if not skill:
            return

        skill = str(skill).strip()

        if not skill:
            return

        key = skill.lower()

        if key not in supported:
            supported[key] = {
                "skill": skill,
                "source": source,
                "evidence": evidence
            }

    # =========================================================
    # 1. TECHNICAL SKILLS FROM STUDENT PROFILE
    # =========================================================

    if profile.technical_skills:

        skills = profile.technical_skills.split(",")

        for skill in skills:
            add_skill(
                skill,
                "student_profile",
                "Technical skill listed in student profile"
            )

    # =========================================================
    # 2. SOFT SKILLS FROM PROFILE SCORES
    # =========================================================

    communication = profile.communication or 0
    leadership = profile.leadership or 0
    teamwork = profile.teamwork or 0
    problem_solving = profile.problem_solving or 0

    if communication >= 6:

        add_skill(
            "Speaking",
            "student_profile",
            f"Communication score: {communication}/10"
        )

        add_skill(
            "Writing",
            "student_profile",
            f"Communication score: {communication}/10"
        )

        add_skill(
            "Active Listening",
            "student_profile",
            f"Communication score: {communication}/10"
        )

    if teamwork >= 6:

        add_skill(
            "Coordination",
            "student_profile",
            f"Teamwork score: {teamwork}/10"
        )

        add_skill(
            "Social Perceptiveness",
            "student_profile",
            f"Teamwork score: {teamwork}/10"
        )

    if problem_solving >= 6:

        add_skill(
            "Complex Problem Solving",
            "student_profile",
            f"Problem-solving score: {problem_solving}/10"
        )

        add_skill(
            "Judgment and Decision Making",
            "student_profile",
            f"Problem-solving score: {problem_solving}/10"
        )

        add_skill(
            "Critical Thinking",
            "student_profile",
            f"Problem-solving score: {problem_solving}/10"
        )

    if leadership >= 6:

        add_skill(
            "Leadership",
            "student_profile",
            f"Leadership score: {leadership}/10"
        )

        add_skill(
            "Management of Personnel Resources",
            "student_profile",
            f"Leadership score: {leadership}/10"
        )

    # =========================================================
    # 3. PROJECT EVIDENCE
    # =========================================================

    for project in profile.projects:

        project_name = project.title

        if project.technologies:

            technologies = project.technologies.split(",")

            for technology in technologies:

                add_skill(
                    technology,
                    "project",
                    project_name
                )

        if project.description:

            add_skill(
                "Complex Problem Solving",
                "project",
                project_name
            )

            add_skill(
                "Programming",
                "project",
                project_name
            )

        if project.role:

            if "lead" in project.role.lower():

                add_skill(
                    "Leadership",
                    "project",
                    project_name
                )

    # =========================================================
    # 4. CERTIFICATION EVIDENCE
    # =========================================================

    for certification in profile.certifications:

        if certification.skill_area:

            add_skill(
                certification.skill_area,
                "certification",
                certification.name
            )

    # =========================================================
    # 5. EXPERIENCE EVIDENCE
    # =========================================================

    for experience in profile.experiences:

        if experience.description:

            add_skill(
                "Professional Experience",
                "experience",
                experience.title
            )

        if experience.title:

            title = experience.title.lower()

            if "developer" in title or "program" in title:

                add_skill(
                    "Programming",
                    "experience",
                    experience.title
                )

            if "lead" in title:

                add_skill(
                    "Leadership",
                    "experience",
                    experience.title
                )

    # =========================================================
    # 6. ACTIVITY EVIDENCE
    # =========================================================

    for activity in profile.activities:

        if activity.skills_demonstrated:

            skills = activity.skills_demonstrated.split(",")

            for skill in skills:

                add_skill(
                    skill,
                    "activity",
                    activity.activity_name
                )

        # Activity type can also provide useful evidence

        if activity.activity_type:

            activity_type = activity.activity_type.lower()

            if "leadership" in activity_type:

                add_skill(
                    "Leadership",
                    "activity",
                    activity.activity_name
                )

            if "team" in activity_type:

                add_skill(
                    "Coordination",
                    "activity",
                    activity.activity_name
                )

            if "communication" in activity_type:

                add_skill(
                    "Speaking",
                    "activity",
                    activity.activity_name
                )

    return list(supported.values())