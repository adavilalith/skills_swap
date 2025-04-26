import firebase_admin
from firebase_admin import credentials, firestore

# Initialize Firebase Admin SDK
cred = credentials.Certificate("/workspaces/skills_swap/servers/fast_api_server/skillsswap-df801-firebase-adminsdk-fbsvc-92116e16aa.json")
firebase_admin.initialize_app(cred)

# Firestore client
db = firestore.client()

def delete_collection(collection_name, batch_size=10):
    collection_ref = db.collection(collection_name)
    docs = collection_ref.limit(batch_size).stream()

    deleted = 0
    for doc in docs:
        print(f"Deleting document {doc.id}")
        doc.reference.delete()
        deleted += 1

    if deleted >= batch_size:
        return delete_collection(collection_name, batch_size)

# Replace 'your-collection-name' with the name of your Firestore collection
delete_collection('users')