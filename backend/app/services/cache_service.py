"""
Cache service for Redis-based caching with request hashing.
"""
import json
import hashlib
from typing import Any, Optional
import redis.asyncio as redis
from ..core.config import settings


class CacheService:
    """Service for caching database query results."""

    def __init__(self, redis_client: Optional[redis.Redis]):
        self.redis = redis_client
        self.ttl = settings.REDIS_TTL

    def _generate_cache_key(self, prefix: str, **params) -> str:
        """
        Generate a unique cache key by hashing the parameters.

        Args:
            prefix: Cache key prefix (e.g., 'links', 'link', 'stats')
            **params: Parameters to hash (e.g., user_id, page, status_filter)

        Returns:
            Hashed cache key
        """
        # Sort params to ensure consistent hashing
        sorted_params = sorted(params.items())
        params_str = json.dumps(sorted_params, sort_keys=True)

        # Generate hash
        hash_obj = hashlib.sha256(params_str.encode())
        hash_hex = hash_obj.hexdigest()[:16]  # Use first 16 chars for brevity

        return f"{prefix}:{hash_hex}"

    async def get(self, cache_key: str) -> Optional[dict]:
        """
        Get value from cache.

        Args:
            cache_key: The cache key

        Returns:
            Cached data or None if not found
        """
        if not self.redis:
            return None

        try:
            cached_data = await self.redis.get(cache_key)
            if cached_data:
                return json.loads(cached_data)
        except Exception as e:
            print(f"Cache GET error: {e}")

        return None

    async def set(self, cache_key: str, data: Any, ttl: Optional[int] = None) -> bool:
        """
        Set value in cache.

        Args:
            cache_key: The cache key
            data: Data to cache (must be JSON serializable)
            ttl: Time to live in seconds (defaults to settings.REDIS_TTL)

        Returns:
            True if successful, False otherwise
        """
        if not self.redis:
            return False

        try:
            json_data = json.dumps(data, default=str)  # default=str handles datetime objects
            await self.redis.setex(
                cache_key,
                ttl or self.ttl,
                json_data
            )
            return True
        except Exception as e:
            print(f"Cache SET error: {e}")
            return False

    async def delete(self, cache_key: str) -> bool:
        """
        Delete a single cache key.

        Args:
            cache_key: The cache key to delete

        Returns:
            True if successful, False otherwise
        """
        if not self.redis:
            return False

        try:
            await self.redis.delete(cache_key)
            return True
        except Exception as e:
            print(f"Cache DELETE error: {e}")
            return False

    async def delete_pattern(self, pattern: str) -> bool:
        """
        Delete all cache keys matching a pattern.

        Args:
            pattern: Pattern to match (e.g., 'links:*', 'user:123:*')

        Returns:
            True if successful, False otherwise
        """
        if not self.redis:
            return False

        try:
            # Scan for keys matching pattern
            keys_to_delete = []
            async for key in self.redis.scan_iter(match=pattern):
                keys_to_delete.append(key)

            # Delete all matching keys
            if keys_to_delete:
                await self.redis.delete(*keys_to_delete)

            return True
        except Exception as e:
            print(f"Cache DELETE PATTERN error: {e}")
            return False

    async def invalidate_user_cache(self, user_id: int):
        """
        Invalidate all cache entries for a specific user.

        Args:
            user_id: The user ID
        """
        # Invalidate all links-related cache for this user
        patterns = [
            f"links:*user_id*{user_id}*",
            f"link:*user_id*{user_id}*",
            f"stats:*user_id*{user_id}*",
        ]

        for pattern in patterns:
            await self.delete_pattern(pattern)

    async def invalidate_link_cache(self, user_id: int, link_id: Optional[int] = None):
        """
        Invalidate cache entries related to links.

        Args:
            user_id: The user ID who owns the links
            link_id: Optional specific link ID to invalidate
        """
        # Always invalidate list queries for this user
        await self.delete_pattern(f"links:*user_id*{user_id}*")
        await self.delete_pattern(f"stats:*user_id*{user_id}*")

        # If specific link, invalidate that too
        if link_id:
            await self.delete_pattern(f"link:*link_id*{link_id}*")
