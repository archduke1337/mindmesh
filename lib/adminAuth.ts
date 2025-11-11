// lib/adminAuth.ts
/**
 * Admin Authentication and Authorization utilities
 * NOTE: The main admin auth uses email-based checks from lib/adminConfig.ts
 * This file provides role-based checks as a supplement for future role-based RBAC
 */

import { Models } from "appwrite";
import { isUserAdminByEmail } from "./adminConfig";

export const ADMIN_ROLES = ["admin", "moderator", "owner"];

export interface AdminUser extends Models.User<Models.Preferences> {
  isAdmin?: boolean;
  role?: string;
}

/**
 * Check if user has admin access (uses email-based system)
 * This is the primary method used throughout the app
 */
export function isUserAdmin(user: Models.User<Models.Preferences> | null): boolean {
  if (!user) return false;
  // Use email-based admin check from adminConfig
  return isUserAdminByEmail(user.email);
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
  
  // Check if user is admin first
  if (!isUserAdmin(user)) return false;
  
  const role = getUserRole(user);
  
  switch (action) {
    case "create":
      return ["admin", "moderator"].includes(role) || isUserAdmin(user);
    case "edit":
      return ["admin", "moderator"].includes(role) || isUserAdmin(user);
    case "delete":
      return role === "admin" || isUserAdmin(user);
    case "approve":
      return ["admin", "moderator"].includes(role) || isUserAdmin(user);
    default:
      return false;
  }
}
