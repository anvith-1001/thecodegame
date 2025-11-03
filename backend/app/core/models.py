from pydantic import BaseModel, Field
from typing import Optional, List
import uuid

# initial user model
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    xp: int = 0
    completed: List[str] = []
    is_guest: bool = False

# the question model
class Challenge(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    topic: str
    question: str
    options: List[str]
    correct_answer: str
    explanation: Optional[str] = None
    difficulty: str = "easy"  

# the answer model
class Submission(BaseModel):
    username: str
    challenge_id: str
    selected_answer: str