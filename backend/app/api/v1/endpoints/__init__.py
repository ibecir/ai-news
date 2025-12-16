"""
API v1 endpoints package.
"""
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.links import router as links_router
from app.api.v1.endpoints.dashboard import router as dashboard_router

__all__ = [
    "auth_router",
    "links_router",
    "dashboard_router",
]
