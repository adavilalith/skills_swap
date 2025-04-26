
from api_keys import pinecone_api_key
from pinecone import Pinecone, ServerlessSpec



pc = Pinecone(
    api_key=pinecone_api_key,
)
index_name = "user-embeddings"
index = pc.Index(index_name)

def query_pinecone(index, user_id: str, k: int):
    
    if k <= 0:
        return {"error": "Parameter 'k' must be greater than 0"}
    user_vector_response = index.fetch(ids=[user_id])
    user_vector = user_vector_response.vectors[user_id].values

    query_result = index.query(
            vector=user_vector,
            top_k=k,
            include_metadata=True
        )
    return [x["id"] for x in query_result['matches']]
print(query_pinecone(index,"iubABOQyK3jLkg3p5Ymy", 5))