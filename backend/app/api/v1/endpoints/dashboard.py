"""
Dashboard API endpoints.
"""
from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.db.redis import get_redis
from app.schemas import UserWithStats, LinkStats, APIResponse
from app.services import UserService, LinkService
from app.services.cache_service import CacheService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get(
    "",
    response_model=APIResponse[dict],
)
async def get_dashboard(
    x_user_email: str = Header(..., description="User's email address"),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis),
):
    """
    Get complete dashboard data including user info and statistics.
    """
    user_service = UserService(db)
    cache_service = CacheService(redis) if redis else None
    link_service = LinkService(db, cache_service)

    # Get user
    user = await user_service.get_by_email(x_user_email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    # Get user with stats
    user_with_stats = await user_service.get_user_with_stats(user)

    # Get detailed link stats (returns tuple now)
    link_stats, stats_from_cache = await link_service.get_stats(user.id)

    # Get recent links (returns tuple now)
    recent_links, links_from_cache = await link_service.get_user_links(
        user_id=user.id,
        page=1,
        page_size=5,
    )

    return APIResponse(
        success=True,
        message="Dashboard data retrieved successfully",
        data={
            "user": user_with_stats.model_dump(),
            "stats": {
                "total_links": link_stats.total_links,
                "verified_links": link_stats.verified_links,
                "pending_links": link_stats.pending_links,
                "failed_links": link_stats.failed_links,
                "average_credibility": link_stats.average_credibility,
                "links_by_status": link_stats.links_by_status,
            },
            "recent_links": [item.model_dump() for item in recent_links.items],
        },
        from_cache=stats_from_cache or links_from_cache,  # True if any data from cache
    )
