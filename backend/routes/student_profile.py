from flask import Blueprint, request, jsonify

from models.career_models import (
    db,
    StudentProfile,
    StudentProject,
    StudentCertification,
    StudentExperience,
    StudentActivity,
    StudentAssessment
)


student_profile_bp = Blueprint(
    "student_profile",
    __name__,
    url_prefix="/api/student"
)


@student_profile_bp.route("/profile", methods=["POST"])
def create_profile():

    data = request.get_json() or {}

    if not data.get("name") or not data.get("email"):
        return jsonify({
            "success": False,
            "message": "Name and email are required."
        }), 400

    existing = StudentProfile.query.filter_by(
        email=data["email"]
    ).first()

    if existing:
        return jsonify({
            "success": False,
            "message": "Student profile already exists."
        }), 409

    profile = StudentProfile(
        name=data["name"],
        email=data["email"],
        education=data.get("education"),
        branch=data.get("branch"),
        college=data.get("college"),
        graduation_year=data.get("graduation_year"),
        target_career=data.get("target_career"),
        target_soc_code=data.get("target_soc_code"),
        technical_skills=data.get("technical_skills"),
        communication=data.get("communication", 0),
        leadership=data.get("leadership", 0),
        teamwork=data.get("teamwork", 0),
        problem_solving=data.get("problem_solving", 0)
    )

    db.session.add(profile)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Student profile created.",
        "student_id": profile.id
    }), 201


@student_profile_bp.route("/profile/<int:student_id>", methods=["GET"])
def get_profile(student_id):

    profile = StudentProfile.query.get(student_id)

    if not profile:
        return jsonify({
            "success": False,
            "message": "Student not found."
        }), 404

    return jsonify({
        "success": True,
        "profile": {
            "id": profile.id,
            "name": profile.name,
            "email": profile.email,
            "education": profile.education,
            "branch": profile.branch,
            "college": profile.college,
            "graduation_year": profile.graduation_year,
            "target_career": profile.target_career,
            "target_soc_code": profile.target_soc_code,
            "technical_skills": profile.technical_skills,
            "communication": profile.communication,
            "leadership": profile.leadership,
            "teamwork": profile.teamwork,
            "problem_solving": profile.problem_solving
        }
    })


@student_profile_bp.route("/profile/<int:student_id>/activity", methods=["POST"])
def add_activity(student_id):

    profile = StudentProfile.query.get(student_id)

    if not profile:
        return jsonify({
            "success": False,
            "message": "Student not found."
        }), 404

    data = request.get_json() or {}

    activity = StudentActivity(
        student_id=student_id,
        activity_name=data.get("activity_name"),
        activity_type=data.get("activity_type"),
        description=data.get("description"),
        skills_demonstrated=data.get("skills_demonstrated")
    )

    db.session.add(activity)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Activity added.",
        "activity_id": activity.id
    }), 201
@student_profile_bp.route("/profile/<int:student_id>/project", methods=["POST"])
def add_project(student_id):
    profile = StudentProfile.query.get(student_id)

    if not profile:
        return jsonify({
            "success": False,
            "message": "Student not found."
        }), 404

    data = request.get_json() or {}

    project = StudentProject(
    student_id=student_id,
    title=data.get("title"),
    description=data.get("description"),
    technologies=data.get("technologies"),
    role=data.get("role"),
    outcome=data.get("outcome")
    )

    db.session.add(project)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Project added.",
        "project_id": project.id
    }), 201
@student_profile_bp.route("/profile/<int:student_id>/certification", methods=["POST"])
def add_certification(student_id):
    profile = StudentProfile.query.get(student_id)

    if not profile:
        return jsonify({
            "success": False,
            "message": "Student not found."
        }), 404

    data = request.get_json() or {}

    certification = StudentCertification(
        student_id=student_id,
        name=data.get("name"),
        issuer=data.get("issuer"),
        skill_area=data.get("skill_area"),
        year=data.get("year")
    )

    db.session.add(certification)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Certification added.",
        "certification_id": certification.id
    }), 201
@student_profile_bp.route("/profile/<int:student_id>/experience", methods=["POST"])
def add_experience(student_id):
    profile = StudentProfile.query.get(student_id)

    if not profile:
        return jsonify({
            "success": False,
            "message": "Student not found."
        }), 404

    data = request.get_json() or {}

    experience = StudentExperience(
        student_id=student_id,
        title=data.get("title"),
        organization=data.get("organization"),
        experience_type=data.get("experience_type"),
        description=data.get("description")
    )

    db.session.add(experience)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Experience added.",
        "experience_id": experience.id
    }), 201
from services.student_career_analysis import analyze_student_career


@student_profile_bp.route(
    "/profile/<int:student_id>/career-analysis",
    methods=["POST"]
)
def career_analysis(student_id):
    data = request.get_json() or {}

    resume_skills = data.get("resume_skills", [])
    soc_code = data.get("soc_code")

    if not soc_code:
        return jsonify({
            "success": False,
            "message": "SOC code is required."
        }), 400

    result = analyze_student_career(
        student_id,
        resume_skills,
        soc_code
    )

    return jsonify(result), 200
