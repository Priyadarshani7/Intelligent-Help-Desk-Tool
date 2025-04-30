from fastapi import FastAPI
from app.routes.ticket_routes import router
from fastapi.middleware.cors import CORSMiddleware
from app.db.db_service.ticket_database import create_db_and_tables

app = FastAPI(title="Intelligent Helpdesk Tool")

# CORS setup for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Frontend development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
async def startup_event():
    create_db_and_tables()
