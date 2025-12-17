"""
Links API endpoints.
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Header
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.db.redis import get_redis
from app.models.link import LinkStatus
from app.schemas import (
    LinkCreate,
    LinkUpdate,
    LinkResponse,
    LinkWithVerification,
    LinkDetail,
    LinkStats,
    PaginatedLinks,
    APIResponse,
    ErrorResponse,
    MessageResponse,
)
from app.services import UserService, LinkService, scraper_service
from app.services.cache_service import CacheService

router = APIRouter(prefix="/links", tags=["Links"])


async def get_current_user_id(
    x_user_email: str = Header(..., description="User's email address"),
    db: AsyncSession = Depends(get_db),
) -> int:
    """
    Get current user ID from email header.
    
    In a production app, this would validate a JWT token.
    For simplicity, we're using email header.
    """
    user_service = UserService(db)
    user = await user_service.get_by_email(x_user_email)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found. Please login first.",
        )
    
    return user.id


@router.get(
    "",
    response_model=APIResponse[PaginatedLinks],
)
async def get_links(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    status_filter: Optional[LinkStatus] = Query(None, description="Filter by status"),
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis),
):
    """
    Get paginated list of user's links.
    """
    cache_service = CacheService(redis) if redis else None
    link_service = LinkService(db, cache_service)

    result, from_cache = await link_service.get_user_links(
        user_id=user_id,
        page=page,
        page_size=page_size,
        status=status_filter,
    )

    return APIResponse(
        success=True,
        message=f"Retrieved {len(result.items)} links",
        data=result,
        from_cache=from_cache,
    )


@router.post(
    "",
    response_model=APIResponse[LinkResponse],
    status_code=status.HTTP_201_CREATED,
)
async def create_link(
    link_data: LinkCreate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis),
):
    """
    Create a new link for verification.
    """
    cache_service = CacheService(redis) if redis else None
    link_service = LinkService(db, cache_service)

    # Check if URL already exists for this user
    url_str = str(link_data.url)
    if await link_service.check_url_exists(user_id, url_str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This URL has already been added to your account.",
        )

    link = await link_service.create(user_id, link_data)

    return APIResponse(
        success=True,
        message="Link created successfully. Processing will begin shortly.",
        data=LinkResponse.model_validate(link),
    )


@router.get(
    "/stats",
    response_model=APIResponse[LinkStats],
)
async def get_link_stats(
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis),
):
    """
    Get statistics about user's links.
    """
    cache_service = CacheService(redis) if redis else None
    link_service = LinkService(db, cache_service)
    stats, from_cache = await link_service.get_stats(user_id)

    return APIResponse(
        success=True,
        message="Statistics retrieved successfully",
        data=stats,
        from_cache=from_cache,
    )


@router.get(
    "/{link_id}",
    response_model=APIResponse[LinkDetail],
    responses={
        404: {"model": ErrorResponse, "description": "Link not found"},
    }
)
async def get_link(
    link_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis),
):
    """
    Get detailed information about a specific link.
    """
    cache_service = CacheService(redis) if redis else None
    link_service = LinkService(db, cache_service)
    link, from_cache = await link_service.get_by_id(link_id, user_id)

    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found",
        )
    
    # Build response with verification details
    verification_data = None
    if link.verification:
        from app.schemas.link import VerificationResponse, ClaimCheck
        
        claims = None
        if link.verification.claims:
            if isinstance(link.verification.claims, list):
                claims = [ClaimCheck(**c) for c in link.verification.claims]
        
        verification_data = VerificationResponse(
            id=link.verification.id,
            link_id=link.verification.link_id,
            credibility_score=link.verification.credibility_score,
            claims=claims,
            sources_checked=link.verification.sources_checked,
            summary=link.verification.summary,
            verified_at=link.verification.verified_at,
        )
    
    response = LinkDetail(
        id=link.id,
        url=link.url,
        title=link.title,
        content=link.content,
        source_domain=link.source_domain,
        author=link.author,
        published_at=link.published_at,
        status=link.status,
        error_message=link.error_message,
        created_at=link.created_at,
        updated_at=link.updated_at,
        verification=verification_data,
    )
    
    return APIResponse(
        success=True,
        message="Link details retrieved",
        data=response,
        from_cache=from_cache,
    )


@router.patch(
    "/{link_id}",
    response_model=APIResponse[LinkResponse],
    responses={
        404: {"model": ErrorResponse, "description": "Link not found"},
    }
)
async def update_link(
    link_id: int,
    link_data: LinkUpdate,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis),
):
    """
    Update a link's metadata.
    """
    cache_service = CacheService(redis) if redis else None
    link_service = LinkService(db, cache_service)
    link = await link_service.update(link_id, user_id, link_data)

    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found",
        )

    return APIResponse(
        success=True,
        message="Link updated successfully",
        data=LinkResponse.model_validate(link),
    )


@router.delete(
    "/{link_id}",
    response_model=MessageResponse,
    responses={
        404: {"model": ErrorResponse, "description": "Link not found"},
    }
)
async def delete_link(
    link_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis),
):
    """
    Delete a link.
    """
    cache_service = CacheService(redis) if redis else None
    link_service = LinkService(db, cache_service)
    deleted = await link_service.delete(link_id, user_id)

    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found",
        )

    return MessageResponse(
        success=True,
        message="Link deleted successfully",
    )


@router.post(
    "/{link_id}/scrape",
    response_model=APIResponse[LinkResponse],
    responses={
        404: {"model": ErrorResponse, "description": "Link not found"},
    }
)
async def scrape_link(
    link_id: int,
    user_id: int = Depends(get_current_user_id),
    db: AsyncSession = Depends(get_db),
    redis = Depends(get_redis),
):
    """
    Manually trigger scraping for a link.
    """
    cache_service = CacheService(redis) if redis else None
    link_service = LinkService(db, cache_service)
    link, _ = await link_service.get_by_id(link_id, user_id)

    if not link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Link not found",
        )
    
    # Update status to processing
    link = await link_service.update_status(link, LinkStatus.PROCESSING)
    
    # Scrape the article
    scraped = await scraper_service.scrape(link.url)
    
    if scraped.error:
        link = await link_service.update_status(
            link, 
            LinkStatus.FAILED, 
            error_message=scraped.error
        )
    else:
        # Update link with scraped metadata
        link = await link_service.update_metadata(
            link,
            title=scraped.title,
            content=scraped.content,
            author=scraped.author,
            published_at=scraped.published_at,
        )
        link = await link_service.update_status(link, LinkStatus.SCRAPED)
    
    return APIResponse(
        success=True,
        message="Scraping completed" if not scraped.error else f"Scraping failed: {scraped.error}",
        data=LinkResponse.model_validate(link),
    )
