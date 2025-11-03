from fastapi import APIRouter, HTTPException
from app.core.db import users_collection
from app.core.models import User
from app.core.utils import generate_guest_name
router = APIRouter(prefix="/users", tags=["Users"])

# create user route
@router.post("/")
def create_user(username: str = None, guest: bool = False):
    if guest:
        username = generate_guest_name()
        is_guest = True
    elif not username:
        raise HTTPException(
            status_code=400, detail="Username is required for registered users."
        )
    else:
        is_guest = False

    existing_user = users_collection.find_one({"username": username}, {"_id": 0})
    if existing_user:
        return {
            "message": "User already exists. Logged in successfully.",
            "user": existing_user,
        }

    user = User(username=username, is_guest=is_guest)
    users_collection.insert_one(user.model_dump())
    return {"message": "User created successfully.", "user": user.model_dump()}


# me route
@router.get("/by-name/{username}")
def get_user_by_name(username: str):
    user = users_collection.find_one({"username": username}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user

# update user route ( not used )
@router.put("/{user_id}")
def update_user(user_id: str, xp: int = None, username: str = None):
    user = users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    update_data = {}
    if xp is not None:
        update_data["xp"] = xp
    if username is not None:
        update_data["username"] = username

    if not update_data:
        raise HTTPException(status_code=400, detail="No update fields provided.")

    users_collection.update_one({"id": user_id}, {"$set": update_data})
    return {"message": "User updated successfully."}

# delete user route ( not used )
@router.delete("/{user_id}")
def delete_user(user_id: str):
    result = users_collection.delete_one({"id": user_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    return {"message": "User deleted successfully."}
