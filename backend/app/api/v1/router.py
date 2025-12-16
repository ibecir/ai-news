"""
API v1 router - combines all endpoint routers.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth_router, links_router, dashboard_router

api_router = APIRouter()

# Include all routers
api_router.include_router(auth_router)
api_router.include_router(links_router)
api_router.include_router(dashboard_router)
