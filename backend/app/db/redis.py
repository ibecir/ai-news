"""
Redis client setup and connection management.
"""
import redis.asyncio as redis
from typing import Optional
from ..core.config import settings


class RedisClient:
    """Redis client singleton for caching."""

    _instance: Optional[redis.Redis] = None

    @classmethod
    async def get_client(cls) -> Optional[redis.Redis]:
        """Get or create Redis client instance."""
        if not settings.REDIS_ENABLED:
            return None

        if cls._instance is None:
            try:
                cls._instance = redis.from_url(
                    settings.REDIS_URL,
                    encoding="utf-8",
                    decode_responses=True,
                    socket_connect_timeout=5,
                    socket_timeout=5,
                )
                # Test connection
                await cls._instance.ping()
            except Exception as e:
                print(f"Redis connection failed: {e}. Caching disabled.")
                cls._instance = None

        return cls._instance

    @classmethod
    async def close(cls):
        """Close Redis connection."""
        if cls._instance:
            await cls._instance.close()
            cls._instance = None


async def get_redis() -> Optional[redis.Redis]:
    """Dependency to get Redis client."""
    return await RedisClient.get_client()
