from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from pinecone import Pinecone, ServerlessSpec
from api_keys import pinecone_api_key


app = FastAPI()


pc = Pinecone(
    api_key=pinecone_api_key,
)
index_name = "user-embeddings"
index = pc.Index(index_name)


class UserRequest(BaseModel):
    user_id: str

class TopUsersResponse(BaseModel):
    top_user_ids: List[str]

@app.post("/get_users_with_required_goals", response_model=TopUsersResponse)
async def get_users_with_required_goals(request: UserRequest, k: int = 5):
    if k <= 0:
        raise HTTPException(status_code=400, detail="Parameter 'k' must be greater than 0")

    try:
        user_vector_response = index.fetch(ids=[request.user_id])
        user_vector = user_vector_response.vectors[request.user_id].values

        query_result = index.query(
            vector=user_vector,
            top_k=k,
            include_metadata=True
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error querying Pinecone: {str(e)}")

    top_user_ids = [x["id"] for x in query_result['matches']]
    return TopUsersResponse(top_user_ids=top_user_ids)
