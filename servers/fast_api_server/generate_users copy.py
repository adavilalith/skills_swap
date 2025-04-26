import random
from sentence_transformers import SentenceTransformer
from api_keys import pinecone_api_key
from pinecone import Pinecone, ServerlessSpec


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

import random
import string

def generate_firebase_id(length=20):
    chars = string.ascii_letters + string.digits  # a-z A-Z 0-9
    return ''.join(random.choice(chars) for _ in range(length))



def assign_to_users(frameworks, languages, num_users=10):
  users = {}
  for i in range(num_users):
    user_id = generate_firebase_id()
    user_items = get_random_items(frameworks + languages, random.randint(1, 10))  
    users[user_id] = user_items
  return users


users_with_items = assign_to_users(frameworks, languages)


model = SentenceTransformer('all-MiniLM-L6-v2')

user_embeddings = {}
for user, items in users_with_items.items():
  user_description = ", ".join(items)
  embedding = model.encode(user_description)
  user_embeddings[user] = embedding

pc = Pinecone(
    api_key=pinecone_api_key,
)

# Create or connect to an index
index_name = "user-embeddings"
if index_name not in pc.list_indexes().names():
    pc.create_index(
        name=index_name,
        dimension=len(next(iter(user_embeddings.values()))),
        metric="cosine",
        spec=ServerlessSpec(
            cloud="aws",
            region="us-east-1",
        )
    )

# Connect to the index
pinecone_index = pc.Index(index_name)

# Prepare data for upsert
pinecone_data = [
    (user, embedding.tolist()) for user, embedding in user_embeddings.items()
]

# Upsert data into Pinecone
pinecone_index.upsert(vectors=pinecone_data)

print(f"User embeddings successfully stored in Pinecone index '{index_name}'.")

def create_user_embedding(user_id,):
    
    embedding = model.encode()
    pinecone_index.upsert(vectors=[(user_id, embedding.tolist())])
    print(f"User embedding for '{user_id}' successfully stored in Pinecone index '{index_name}'.")