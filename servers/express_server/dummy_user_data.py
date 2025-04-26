import random
import firebase_admin
from firebase_admin import credentials, firestore
from faker import Faker
from datetime import datetime
frameworks = [
    "Django,Python",
    "Flask,Python",
    "FastAPI,Python",
    "Pandas,Python",
    "Spring Boot,Java",
    "Hibernate,Java",
    "React,JavaScript",
    "Angular,TypeScript",
    "Vue.js,JavaScript",
    "Express.js,JavaScript",
    "Next.js,JavaScript / TypeScript",
    "Nuxt.js,JavaScript / TypeScript",
    "Node.js,JavaScript",
    "ASP.NET,C#",
    "Laravel,PHP",
    "Symfony,PHP",
    "Rails (Ruby on Rails),Ruby",
    "Gin,Go",
    "Echo,Go",
    "Flutter,Dart",
    "React Native,JavaScript",
    "SwiftUI,Swift",
    "Jetpack Compose,Kotlin",
    "TensorFlow,Python",
    "PyTorch,Python",
    "Keras,Python",
    "Scikit-learn,Python",
    "Qt,C++",
    "Unity,C#",
    "Unreal Engine,C++",
    "Phoenix,Elixir",
    "Svelte,JavaScript"
]
languages = [
    "Python",
    "Java",
    "C",
    "C++",
    "C#",
    "JavaScript",
    "Go",
    "Ruby",
    "Swift",
    "Kotlin",
    "Rust",
    "Dart",
    "TypeScript",
    "HTML",
    "CSS",
    "PHP",
    "R",
    "Julia",
    "MATLAB",
    "Haskell",
    "Elixir",
    "Scala",
    "Lisp",
    "OCaml",
    "Bash",
    "PowerShell",
    "Perl",
    "Assembly"
]
def get_random_items(items, num_items):
  return random.sample(items, num_items)

# Initialize Firebase
cred = credentials.Certificate("/workspaces/skills_swap/servers/fast_api_server/skillsswap-df801-firebase-adminsdk-fbsvc-92116e16aa.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

all_skills = frameworks + languages
fake = Faker()

def create_random_user():
    first_name = fake.first_name()
    last_name = fake.last_name()
    username = fake.user_name()
    email = fake.email()
    bio = fake.sentence(nb_words=10)
    skills = {skill.split(",")[0]: random.randint(1, 10) for skill in get_random_items(all_skills, random.randint(3, 7))}
    goals = {skill.split(",")[0]: random.randint(1, 10) for skill in get_random_items(all_skills, random.randint(3, 7)) if skill not in skills}
    goals = get_random_items(languages, random.randint(2, 5))
    connections = []
    connection_requests = []
    followers = []
    following = []
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    return {
        "first_name": first_name,
        "last_name": last_name,
        "username": username,
        "email": email,
        "bio": bio,
        "skills": skills,
        "goals": goals,
        "connections": connections,
        "connection_requests": connection_requests,
        "followers": followers,
        "following": following,
        "created_at": created_at
    }

def upload_users_to_firebase(num_users):
    for _ in range(num_users):
        user = create_random_user()
        db.collection("users").add(user)

upload_users_to_firebase(10)