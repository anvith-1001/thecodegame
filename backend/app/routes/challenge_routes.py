from fastapi import APIRouter, HTTPException, Query
from app.core.db import db, users_collection
from app.core.models import Challenge, Submission
from app.core.game_logic import check_answer, calculate_xp
import random

router = APIRouter(prefix="/challenges", tags=["Challenges"])

challenges_collection = db["challenges"]

# view topics route
@router.get("/topics")
def get_topics():
    topics = challenges_collection.distinct("topic")
    if not topics:
        raise HTTPException(status_code=404, detail="No topics found.")
    return {"topics": topics}

# the question route 
@router.get("/random")
def get_random_challenge(username: str, topic: str = Query(None)):
    """
    Returns a random challenge for the given topic,
    skipping challenges already completed by the user.
    """
    user = users_collection.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    completed_questions = set(user.get("completed_questions", []))

    query = {"topic": topic} if topic else {}

    all_challenges = list(challenges_collection.find(query, {"_id": 0}))
    available = [ch for ch in all_challenges if ch["question"] not in completed_questions]

    if not available:
        raise HTTPException(status_code=404, detail="No new challenges left for this topic.")

    return random.choice(available)


@router.post("/submit")
def submit_answer(submission: Submission):
    """
    Evaluates a user's answer, awards XP, and records completed question text.
    """
    challenge = challenges_collection.find_one({"id": submission.challenge_id})
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found.")

    user = users_collection.find_one({"username": submission.username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    is_correct = check_answer(challenge, submission.selected_answer)
    xp_gain = calculate_xp(is_correct, challenge.get("difficulty", "easy"))

    update_data = {"$addToSet": {"completed_questions": challenge["question"]}}

    if xp_gain > 0:
        update_data["$inc"] = {"xp": xp_gain}

    users_collection.update_one({"username": submission.username}, update_data)

    return {
        "correct": is_correct,
        "xp_earned": xp_gain,
        "explanation": challenge.get("explanation", "No explanation available."),
    }
