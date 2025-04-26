import firebase_admin
from firebase_admin import credentials, firestore
import random
from sentence_transformers import SentenceTransformer
from api_keys import pinecone_api_key
from pinecone import Pinecone, ServerlessSpec

# Initialize Firebase Admin SDK

cred = credentials.Certificate("/workspaces/skills_swap/servers/fast_api_server/skillsswap-df801-firebase-adminsdk-fbsvc-92116e16aa.json")

firebase_admin.initialize_app(cred)

# Initialize Firestore client
db = firestore.client()


model = SentenceTransformer('all-MiniLM-L6-v2')

user_embeddings ={"1":model.encode("Java, Python, C++")}
pc = Pinecone(
    api_key=pinecone_api_key,
)

# Create or connect to an index
index_name = "user-skill-embeddings"
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
print("dgigd")
# Connect to the index
pinecone_index = pc.Index(index_name)
pinecone_data = [
    (user, embedding.tolist()) for user, embedding in user_embeddings.items()
]
# Upsert data into Pinecone
print(0)
pinecone_index.upsert(vectors=pinecone_data)
# Prepare data for upsert

user_embeddings = {}
def fetch_users_with_skills_and_goals():
    try:
        # Reference to the users collection
        users_ref = db.collection('users')
        users = users_ref.stream()

        users_with_items = {}

        # Fetch and print each user's skills and goals
        for user in users:
            user_data = user.to_dict()
            uid = user.id  
            skills = user_data.get('skills', [])
            goals = user_data.get('goals', [])
            user_embeddings[uid] = model.encode(" ".join(skills))

    except Exception as e:
        print(f"An error occurred: {e}")
        return {}
fetch_users_with_skills_and_goals()

pinecone_data = [
    (user, embedding.tolist()) for user, embedding in user_embeddings.items()
]
# Upsert data into Pinecone
print(1)
pinecone_index.upsert(vectors=pinecone_data)
