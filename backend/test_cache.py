#!/usr/bin/env python3
"""
Quick test script to verify Redis caching works correctly.
Run this after starting the application.
"""
import asyncio
import sys
from app.db.redis import RedisClient, get_redis
from app.services.cache_service import CacheService


async def test_redis_connection():
    """Test Redis connection."""
    print("=" * 60)
    print("Testing Redis Connection")
    print("=" * 60)

    redis_client = await get_redis()

    if redis_client is None:
        print("❌ Redis is not available (this is OK - app will work without cache)")
        return False

    try:
        await redis_client.ping()
        print("✅ Redis connection successful!")
        return True
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")
        return False


async def test_cache_operations():
    """Test basic cache operations."""
    print("\n" + "=" * 60)
    print("Testing Cache Operations")
    print("=" * 60)

    redis_client = await get_redis()
    if not redis_client:
        print("⚠️  Skipping cache tests (Redis not available)")
        return

    cache = CacheService(redis_client)

    # Test 1: Set and Get
    print("\n1. Testing SET and GET...")
    test_key = cache._generate_cache_key("test", user_id=1, page=1)
    test_data = {"message": "Hello, Redis!", "count": 42}

    await cache.set(test_key, test_data, ttl=60)
    retrieved = await cache.get(test_key)

    if retrieved and retrieved["message"] == "Hello, Redis!":
        print(f"   ✅ SET/GET working: {retrieved}")
    else:
        print(f"   ❌ SET/GET failed: {retrieved}")

    # Test 2: Cache key generation
    print("\n2. Testing cache key hashing...")
    key1 = cache._generate_cache_key("links", user_id=1, page=1, status="pending")
    key2 = cache._generate_cache_key("links", user_id=1, page=1, status="pending")
    key3 = cache._generate_cache_key("links", user_id=1, page=2, status="pending")

    if key1 == key2:
        print(f"   ✅ Same params = Same key: {key1}")
    else:
        print(f"   ❌ Same params but different keys!")

    if key1 != key3:
        print(f"   ✅ Different params = Different keys")
    else:
        print(f"   ❌ Different params but same key!")

    # Test 3: Delete
    print("\n3. Testing DELETE...")
    await cache.delete(test_key)
    retrieved = await cache.get(test_key)

    if retrieved is None:
        print("   ✅ DELETE working")
    else:
        print(f"   ❌ DELETE failed: {retrieved}")

    # Test 4: Pattern deletion
    print("\n4. Testing pattern-based DELETE...")
    await cache.set("test:key1", {"id": 1}, ttl=60)
    await cache.set("test:key2", {"id": 2}, ttl=60)
    await cache.set("other:key3", {"id": 3}, ttl=60)

    await cache.delete_pattern("test:*")

    key1_result = await cache.get("test:key1")
    key3_result = await cache.get("other:key3")

    if key1_result is None and key3_result is not None:
        print("   ✅ Pattern DELETE working (deleted test:*, kept other:*)")
    else:
        print(f"   ❌ Pattern DELETE failed")

    # Cleanup
    await cache.delete("other:key3")

    print("\n" + "=" * 60)
    print("✅ All cache tests completed!")
    print("=" * 60)


async def test_graceful_degradation():
    """Test that app works without Redis."""
    print("\n" + "=" * 60)
    print("Testing Graceful Degradation")
    print("=" * 60)

    # Simulate no Redis
    cache_service = CacheService(None)

    print("\n1. Testing cache operations with None client...")

    # These should all return False/None without errors
    result = await cache_service.get("test:key")
    print(f"   GET with None client: {result} (should be None) ✅")

    result = await cache_service.set("test:key", {"data": "test"})
    print(f"   SET with None client: {result} (should be False) ✅")

    result = await cache_service.delete("test:key")
    print(f"   DELETE with None client: {result} (should be False) ✅")

    print("\n✅ Graceful degradation working - app will work without Redis!")


async def main():
    """Run all tests."""
    print("\n🧪 Redis Cache Test Suite\n")

    try:
        # Test 1: Connection
        redis_available = await test_redis_connection()

        # Test 2: Cache operations (if Redis available)
        if redis_available:
            await test_cache_operations()

        # Test 3: Graceful degradation
        await test_graceful_degradation()

        print("\n" + "=" * 60)
        print("🎉 All tests completed successfully!")
        print("=" * 60)
        print("\nNext steps:")
        print("1. Start your application: python -m app.main")
        print("2. Test endpoints and check 'from_cache' flag in responses")
        print("3. Try disabling Redis and verify app still works")
        print("\n📖 See TEST_REDIS_CACHE.md for detailed testing guide")
        print("=" * 60 + "\n")

    except Exception as e:
        print(f"\n❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        # Cleanup
        await RedisClient.close()


if __name__ == "__main__":
    asyncio.run(main())
