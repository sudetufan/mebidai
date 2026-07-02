from fastapi import APIRouter

router = APIRouter()

@router.get("/users/test")
def test():
    return {"message": "Users route çalışıyor"}