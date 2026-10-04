from app import app
from models.career_models import db, Career, Skill


CAREERS = {
    "Web Developer": {
        "domain": "Computer Science",
        "description": "Builds and maintains websites and web applications.",
        "skills": [
            ("HTML", "Frontend", "High"),
            ("CSS", "Frontend", "High"),
            ("JavaScript", "Frontend", "High"),
            ("React", "Frontend", "High"),
            ("Git", "Tools", "Medium"),
            ("GitHub", "Tools", "Medium"),
            ("REST API", "Backend", "High"),
            ("SQL", "Database", "High"),
            ("Responsive Web Design", "Frontend", "Medium"),
        ],
    },

    "Software Developer": {
        "domain": "Computer Science",
        "description": "Designs, develops and maintains software applications.",
        "skills": [
            ("Python", "Programming", "High"),
            ("Java", "Programming", "High"),
            ("C++", "Programming", "Medium"),
            ("Data Structures", "Computer Science", "High"),
            ("Algorithms", "Computer Science", "High"),
            ("Git", "Tools", "Medium"),
            ("SQL", "Database", "High"),
            ("REST API", "Backend", "High"),
            ("Object Oriented Programming", "Programming", "High"),
        ],
    },

    "Data Scientist": {
        "domain": "Artificial Intelligence",
        "description": "Uses data, statistics and machine learning to solve problems.",
        "skills": [
            ("Python", "Programming", "High"),
            ("SQL", "Database", "High"),
            ("Statistics", "Mathematics", "High"),
            ("Machine Learning", "AI/ML", "High"),
            ("Pandas", "Data Science", "High"),
            ("NumPy", "Data Science", "High"),
            ("Scikit-learn", "AI/ML", "High"),
            ("Data Visualization", "Data Science", "Medium"),
        ],
    },

    "AI/ML Engineer": {
        "domain": "Artificial Intelligence",
        "description": "Develops artificial intelligence and machine learning systems.",
        "skills": [
            ("Python", "Programming", "High"),
            ("Machine Learning", "AI/ML", "High"),
            ("Deep Learning", "AI/ML", "High"),
            ("TensorFlow", "AI/ML", "Medium"),
            ("PyTorch", "AI/ML", "Medium"),
            ("NumPy", "Data Science", "Medium"),
            ("Pandas", "Data Science", "Medium"),
            ("Statistics", "Mathematics", "High"),
        ],
    },

    "Data Analyst": {
        "domain": "Data Science",
        "description": "Analyzes data to generate insights and support decisions.",
        "skills": [
            ("Python", "Programming", "High"),
            ("SQL", "Database", "High"),
            ("Excel", "Tools", "High"),
            ("Power BI", "Visualization", "High"),
            ("Statistics", "Mathematics", "High"),
            ("Pandas", "Data Science", "High"),
            ("Data Visualization", "Data Science", "High"),
        ],
    },

    "Mechanical Design Engineer": {
        "domain": "Mechanical Engineering",
        "description": "Designs mechanical components and systems using engineering principles and CAD tools.",
        "skills": [
            ("AutoCAD", "Design", "High"),
            ("SolidWorks", "CAD", "High"),
            ("CATIA", "CAD", "Medium"),
            ("Mechanical Design", "Engineering", "High"),
            ("Engineering Drawing", "Engineering", "High"),
            ("GD&T", "Manufacturing", "Medium"),
            ("Manufacturing Processes", "Manufacturing", "High"),
        ],
    },

    "Civil Engineer": {
        "domain": "Civil Engineering",
        "description": "Works on planning, design and construction of infrastructure.",
        "skills": [
            ("AutoCAD", "Design", "High"),
            ("STAAD.Pro", "Structural", "High"),
            ("Structural Analysis", "Structural", "High"),
            ("Surveying", "Construction", "High"),
            ("Revit", "BIM", "Medium"),
            ("Quantity Estimation", "Construction", "Medium"),
            ("Construction Management", "Management", "Medium"),
        ],
    },

    "Electrical Engineer": {
        "domain": "Electrical Engineering",
        "description": "Works with electrical systems, circuits, power and control systems.",
        "skills": [
            ("MATLAB", "Engineering Software", "High"),
            ("Simulink", "Engineering Software", "Medium"),
            ("Circuit Design", "Electronics", "High"),
            ("Power Systems", "Electrical", "High"),
            ("Control Systems", "Electrical", "High"),
            ("PLC", "Automation", "Medium"),
            ("Electrical Machines", "Electrical", "High"),
        ],
    },

    "Electronics Engineer": {
        "domain": "Electronics Engineering",
        "description": "Designs and develops electronic circuits, embedded systems and hardware.",
        "skills": [
            ("Embedded Systems", "Electronics", "High"),
            ("Microcontrollers", "Electronics", "High"),
            ("Arduino", "Embedded", "Medium"),
            ("Raspberry Pi", "Embedded", "Medium"),
            ("Circuit Design", "Electronics", "High"),
            ("C", "Programming", "High"),
            ("C++", "Programming", "Medium"),
        ],
    },
}


with app.app_context():

    for career_name, career_data in CAREERS.items():

        existing_career = Career.query.filter_by(
            name=career_name
        ).first()

        if existing_career:
            print(f"Already exists: {career_name}")
            continue

        career = Career(
            name=career_name,
            domain=career_data["domain"],
            description=career_data["description"]
        )

        db.session.add(career)
        db.session.flush()

        for skill_name, category, importance in career_data["skills"]:

            skill = Skill(
                name=skill_name,
                category=category,
                importance=importance,
                career_id=career.id
            )

            db.session.add(skill)

        print(f"Added: {career_name}")

    db.session.commit()

    print("\nCareer database seeded successfully!")