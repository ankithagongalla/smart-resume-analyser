from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Career(db.Model):
    __tablename__ = "careers"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(150), nullable=False, unique=True)

    domain = db.Column(db.String(100), nullable=False)

    description = db.Column(db.Text)

    skills = db.relationship(
        "Skill",
        backref="career",
        lazy=True,
        cascade="all, delete-orphan"
    )


class Skill(db.Model):
    __tablename__ = "skills"

    id = db.Column(db.Integer, primary_key=True)

    name = db.Column(db.String(100), nullable=False)

    category = db.Column(db.String(100))

    importance = db.Column(
        db.String(20),
        default="Medium"
    )

    career_id = db.Column(
        db.Integer,
        db.ForeignKey("careers.id"),
        nullable=False
    )