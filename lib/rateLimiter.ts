/**
 * Simple in-memory rate limiter for blog submissions
 * Tracks user submissions and enforces limits
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const BLOG_SUBMISSION_LIMIT = 5; // Max 5 blogs per day
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in ms

/**
 * Check if user has exceeded blog submission limit
 * @param userId - The user ID to check
 * @returns true if user is within limit, false if they've exceeded it
 */
export const checkBlogRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const entry = rateLimitStore.get(userId);

  if (!entry) {
    // First submission
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  // Check if time window has expired
  if (now > entry.resetTime) {
    // Reset the counter
    rateLimitStore.set(userId, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  // Check if user has exceeded limit
  if (entry.count >= BLOG_SUBMISSION_LIMIT) {
    return false;
  }

  // Increment counter
  entry.count++;
  return true;
};

/**
 * Get remaining submissions for user
 */
export const getRemainingSubmissions = (userId: string): number => {
  const entry = rateLimitStore.get(userId);

  if (!entry || Date.now() > entry.resetTime) {
    return BLOG_SUBMISSION_LIMIT;
  }

  return Math.max(0, BLOG_SUBMISSION_LIMIT - entry.count);
};

/**
 * Reset rate limit for a user (admin only)
 */
export const resetUserRateLimit = (userId: string): void => {
  rateLimitStore.delete(userId);
};

/**
 * Clear all rate limits (use with caution)
 */
export const clearAllRateLimits = (): void => {
  rateLimitStore.clear();
};
