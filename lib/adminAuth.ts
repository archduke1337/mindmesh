// lib/adminAuth.ts
/**
 * Admin Authentication and Authorization utilities
 * Verifies user has admin access before allowing admin page access
 */

import { Models } from "appwrite";

export const ADMIN_ROLES = ["admin", "moderator", "owner"];

export interface AdminUser extends Models.User<Models.Preferences> {
  isAdmin?: boolean;
  role?: string;
}

/**
 * Check if user has admin access
 * Note: This is a client-side check. Always verify on backend for real security.
 */
export function isUserAdmin(user: Models.User<Models.Preferences> | null): boolean {
  if (!user) return false;
  
  // Check user preferences for admin role
  if (user.prefs) {
    const prefs = user.prefs as any;
    return ADMIN_ROLES.includes(prefs.role);
  }
  
  return false;
}

/**
 * Get user role from preferences
 */
export function getUserRole(user: Models.User<Models.Preferences> | null): string {
  if (!user || !user.prefs) return "user";
  
  const prefs = user.prefs as any;
  return prefs.role || "user";
}

/**
 * Check if user can perform action
 */
export function canUserPerformAction(
  user: Models.User<Models.Preferences> | null,
  action: "create" | "edit" | "delete" | "approve"
): boolean {
  if (!user) return false;
  
  const role = getUserRole(user);
  
  switch (action) {
    case "create":
      return ["admin", "moderator"].includes(role);
    case "edit":
      return ["admin", "moderator"].includes(role);
    case "delete":
      return role === "admin";
    case "approve":
      return ["admin", "moderator"].includes(role);
    default:
      return false;
  }
}
