"""
MEDTRACK – MedAI Guardian
FastAPI Application Entry Point (Phase 2 – Production-ready)
"""

import logging
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import OperationalError

from app.core.config import settings
from app.core.database import engine, Base

# ── Import all models so Base registers them ──────────────────
from app.models import user, health_data, emergency_contact  # noqa: F401

# ── Import routers ────────────────────────────────────────────
from app.routes import (
    user_routes,
    prediction_routes,
    explain_routes,
    recommendation_routes,
    chatbot_routes,
    sos_routes,
)

# ── Logging ───────────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("medtrack")

# ── Create DB tables (auto-migration for dev) ─────────────────
try:
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables created / verified.")
except OperationalError as exc:
    logger.warning(f"⚠️  Could not connect to database: {exc}")
    logger.warning("Starting in NO-DB mode. Some endpoints will fail.")

# ── FastAPI app ───────────────────────────────────────────────
app = FastAPI(
    title="MEDTRACK – MedAI Guardian API",
    description=(
        "## AI-Powered Health Risk Prediction\n\n"
        "Predict **Diabetes** and **Heart Disease** risk, get **SHAP explanations**, "
        "personalised **recommendations**, an AI **chatbot**, and **SOS** emergency alerts.\n\n"
        "**Auth:** All protected endpoints require `Bearer <JWT>` in the `Authorization` header."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    contact={"name": "MEDTRACK Team", "email": "support@medtrack.ai"},
    license_info={"name": "MIT"},
)

# ── CORS ──────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global error handlers ─────────────────────────────────────

@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " → ".join(str(x) for x in err["loc"])
        errors.append({"field": field, "message": err["msg"]})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "detail": errors,
            "hint": "Check the request body against the API schema at /docs",
        },
    )


@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error on {request.method} {request.url}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "detail": f"An unexpected error occurred. Please try again. {str(exc)}",
        },
    )


# ── Register all routers ──────────────────────────────────────
app.include_router(user_routes.router)
app.include_router(prediction_routes.router)
app.include_router(explain_routes.router)
app.include_router(recommendation_routes.router)
app.include_router(chatbot_routes.router)
app.include_router(sos_routes.router)


# ── Health + root endpoints ───────────────────────────────────

@app.get("/", tags=["Health"], summary="API root")
async def root():
    return {
        "app": "MEDTRACK – MedAI Guardian",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs",
        "endpoints": {
            "auth":            "/users/register | /users/login",
            "profile":         "/users/me",
            "predict":         "/predict/diabetes | /predict/heart",
            "explain":         "/explain/",
            "recommend":       "/recommendations/",
            "chatbot":         "/chatbot/message",
            "sos":             "/sos/trigger | /sos/contacts",
            "history":         "/predict/history",
        },
    }


@app.get("/health", tags=["Health"], summary="Health check")
async def health_check():
    db_status = "connected"
    try:
        with engine.connect() as conn:
            pass # successful connection
    except Exception as e:
        logger.error(f"Health check DB error: {e}")
        db_status = "unavailable"

    return JSONResponse(
        status_code=200,
        content={"status": "healthy", "database": db_status, "version": "2.0.0"},
    )
