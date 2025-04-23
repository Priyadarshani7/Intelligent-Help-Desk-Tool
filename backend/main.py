# from fastapi import FastAPI
# from fastapi.middleware.cors import CORSMiddleware
# from routes.ticket_routes import router as ticket_router
# from db.db_service.session import create_db_and_tables

# app = FastAPI()

# # Allow CORS for frontend
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://127.0.0.1:5500", "http://localhost:5173"],  # In production, replace with your frontend domain
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Create tables
# create_db_and_tables()

# # Register routes
# app.include_router(ticket_router, prefix="/tickets", tags=["Tickets"])




from fastapi import FastAPI
from app.routes.ticket_routes import router

from fastapi.middleware.cors import CORSMiddleware

from app.db.db_service.ticket_database import create_db_and_tables

app = FastAPI(title="Intelligent Helpdesk Tool")

# CORS setup for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Update with frontend URL in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
