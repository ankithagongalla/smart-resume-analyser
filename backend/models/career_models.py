from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


# ============================================================
# CAREER
# ============================================================

class Career(db.Model):

    __tablename__ = "careers"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False,
        unique=True
    )

    domain = db.Column(
        db.String(100),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    skills = db.relationship(
        "Skill",
        backref="career",
        lazy=True,
        cascade="all, delete-orphan"
    )


# ============================================================
# SKILL
# ============================================================

class Skill(db.Model):

    __tablename__ = "skills"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    category = db.Column(
        db.String(100)
    )

    importance = db.Column(
        db.String(20),
        default="Medium"
    )

    career_id = db.Column(
        db.Integer,
        db.ForeignKey("careers.id"),
        nullable=False
    )


# ============================================================
# STUDENT PROFILE
# ============================================================

class StudentProfile(db.Model):

    __tablename__ = "student_profiles"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(150),
        nullable=False
    )

    email = db.Column(
        db.String(150),
        nullable=False,
        unique=True
    )

    education = db.Column(
        db.String(200)
    )

    branch = db.Column(
        db.String(100)
    )

    college = db.Column(
        db.String(200)
    )

    graduation_year = db.Column(
        db.Integer
    )

    target_career = db.Column(
        db.String(150)
    )

    target_soc_code = db.Column(
        db.String(30)
    )

    technical_skills = db.Column(
        db.Text
    )

    communication = db.Column(
        db.Float,
        default=0
    )

    leadership = db.Column(
        db.Float,
        default=0
    )

    teamwork = db.Column(
        db.Float,
        default=0
    )

    problem_solving = db.Column(
        db.Float,
        default=0
    )

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now()
    )

    # --------------------------------------------------------
    # STUDENT RELATIONSHIPS
    # --------------------------------------------------------

    projects = db.relationship(
        "StudentProject",
        backref="student",
        lazy=True,
        cascade="all, delete-orphan"
    )

    certifications = db.relationship(
        "StudentCertification",
        backref="student",
        lazy=True,
        cascade="all, delete-orphan"
    )

    experiences = db.relationship(
        "StudentExperience",
        backref="student",
        lazy=True,
        cascade="all, delete-orphan"
    )

    activities = db.relationship(
        "StudentActivity",
        backref="student",
        lazy=True,
        cascade="all, delete-orphan"
    )

    assessments = db.relationship(
        "StudentAssessment",
        backref="student",
        lazy=True,
        cascade="all, delete-orphan"
    )


# ============================================================
# STUDENT PROJECT
# ============================================================

class StudentProject(db.Model):

    __tablename__ = "student_projects"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student_profiles.id"),
        nullable=False
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    technologies = db.Column(
        db.Text
    )

    role = db.Column(
        db.String(150)
    )

    outcome = db.Column(
        db.Text
    )


# ============================================================
# STUDENT CERTIFICATION
# ============================================================

class StudentCertification(db.Model):

    __tablename__ = "student_certifications"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student_profiles.id"),
        nullable=False
    )

    name = db.Column(
        db.String(200),
        nullable=False
    )

    issuer = db.Column(
        db.String(200)
    )

    skill_area = db.Column(
        db.String(150)
    )

    year = db.Column(
        db.Integer
    )


# ============================================================
# STUDENT EXPERIENCE
# ============================================================

class StudentExperience(db.Model):

    __tablename__ = "student_experiences"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student_profiles.id"),
        nullable=False
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    organization = db.Column(
        db.String(200)
    )

    experience_type = db.Column(
        db.String(100)
    )

    description = db.Column(
        db.Text
    )


# ============================================================
# STUDENT ACTIVITY
# ============================================================

class StudentActivity(db.Model):

    __tablename__ = "student_activities"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student_profiles.id"),
        nullable=False
    )

    activity_name = db.Column(
        db.String(200),
        nullable=False
    )

    activity_type = db.Column(
        db.String(100)
    )

    description = db.Column(
        db.Text
    )

    skills_demonstrated = db.Column(
        db.Text
    )


# ============================================================
# STUDENT ASSESSMENT
# ============================================================

class StudentAssessment(db.Model):

    __tablename__ = "student_assessments"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    student_id = db.Column(
        db.Integer,
        db.ForeignKey("student_profiles.id"),
        nullable=False
    )

    assessment_name = db.Column(
        db.String(200)
    )

    score = db.Column(
        db.Float
    )

    category = db.Column(
        db.String(100)
    )

    description = db.Column(
        db.Text
    )