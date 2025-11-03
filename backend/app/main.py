from fastapi import FastAPI
from app.routes import user, challenge_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CodeSprint Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       
    allow_credentials=True,
    allow_methods=["*"],      
    allow_headers=["*"],
)

app.include_router(user.router)
app.include_router(challenge_routes.router)

@app.get("/")
def root():
    return {"message": "Welcome to CodeSprint API"}
