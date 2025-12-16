"""
Authentication API endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas import UserLogin, UserWithStats, APIResponse, ErrorResponse
from app.services import UserService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/login",
    response_model=APIResponse[UserWithStats],
    responses={
        404: {"model": ErrorResponse, "description": "User not found"},
    }
)
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """
    Login with email only.
    
    - If email exists: Returns user data with statistics
    - If email doesn't exist: Returns 404 error
    """
    user_service = UserService(db)
    
    # Check if user exists
    user = await user_service.get_by_email(login_data.email)
    print("USER IS -> ", user)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "success": False,
                "message": "User not found. Please check your email address.",
                "error_code": "USER_NOT_FOUND",
            }
        )
    
    # Update last login
    user = await user_service.update_last_login(user)
    
    # Get user with stats
    user_with_stats = await user_service.get_user_with_stats(user)
    
    return APIResponse(
        success=True,
        message="Login successful",
        data=user_with_stats,
    )


@router.post(
    "/check-email",
    response_model=APIResponse[dict],
)
async def check_email(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db),
):
    """
    Check if email exists in the system.
    
    Returns whether the email is registered or not.
    """
    user_service = UserService(db)
    user = await user_service.get_by_email(login_data.email)
    
    return APIResponse(
        success=True,
        message="Email check complete",
        data={
            "exists": user is not None,
            "email": login_data.email,
        }
    )
