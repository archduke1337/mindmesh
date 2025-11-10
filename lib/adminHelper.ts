// lib/adminHelper.ts
import { Models } from "appwrite";

/**
 * Check if a user is an admin
 * You can customize this based on your implementation:
 * - Option 1: Check user email (hardcoded admin emails)
 * - Option 2: Check user role/label (if using Appwrite labels)
 * - Option 3: Check custom database collection
 */

// ============ OPTION 1: Hardcoded Admin Emails ============
const ADMIN_EMAILS = [
  "admin@mindmesh.club",
  "gaurav@mindmesh.club",
  "owner@mindmesh.club",
  // Add more admin emails here
];

export function isAdminByEmail(user: Models.User<Models.Preferences> | null): boolean {
  if (!user || !user.email) return false;
  return ADMIN_EMAILS.includes(user.email);
}

// ============ OPTION 2: Check User Label ============
/**
 * If you're using Appwrite Labels, you can check them here
 * Labels are custom metadata you can add to users
 */
export function isAdminByLabel(user: Models.User<Models.Preferences> | null): boolean {
  if (!user || !user.labels) return false;
  return user.labels.includes("admin");
}

// ============ OPTION 3: Check from Preferences ============
/**
 * If you store role in user preferences
 */
export function isAdminByPreference(user: Models.User<Models.Preferences> | null): boolean {
  if (!user || !user.prefs) return false;
  return (user.prefs as any).role === "admin";
}

// ============ MAIN HELPER (Use this one) ============
/**
 * Main function to check if user is admin
 * Currently uses email-based check (OPTION 1)
 * You can change this to use labels or preferences
 */
export function isAdmin(user: Models.User<Models.Preferences> | null): boolean {
  return isAdminByEmail(user);
  // Alternative: return isAdminByLabel(user);
  // Alternative: return isAdminByPreference(user);
}

/**
 * Get admin status from user email
 */
export function getAdminStatus(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email);
}

/**
 * Add email to admin list (runtime - not persistent)
 * For persistent changes, modify ADMIN_EMAILS constant
 */
export function addAdminEmail(email: string): void {
  if (!ADMIN_EMAILS.includes(email)) {
    ADMIN_EMAILS.push(email);
  }
}

/**
 * Remove email from admin list (runtime - not persistent)
 */
export function removeAdminEmail(email: string): void {
  const index = ADMIN_EMAILS.indexOf(email);
  if (index > -1) {
    ADMIN_EMAILS.splice(index, 1);
  }
}

/**
 * Get list of admin emails
 */
export function getAdminEmails(): string[] {
  return [...ADMIN_EMAILS];
}

// ============ PERMISSION HELPERS ============

/**
 * Check if user can edit a blog
 * Users can edit their own blogs, admins can edit any blog
 */
export function canEditBlog(
  userId: string | undefined,
  authorId: string,
  isAdminUser: boolean
): boolean {
  if (isAdminUser) return true;
  return userId === authorId;
}

/**
 * Check if user can delete a blog
 * Users can delete their own blogs, admins can delete any blog
 */
export function canDeleteBlog(
  userId: string | undefined,
  authorId: string,
  isAdminUser: boolean
): boolean {
  if (isAdminUser) return true;
  return userId === authorId;
}

/**
 * Check if user can approve blogs
 * Only admins can approve
 */
export function canApproveBlog(isAdminUser: boolean): boolean {
  return isAdminUser;
}

/**
 * Check if user can reject blogs
 * Only admins can reject
 */
export function canRejectBlog(isAdminUser: boolean): boolean {
  return isAdminUser;
}

/**
 * Check if user can feature blogs
 * Only admins can feature
 */
export function canFeatureBlog(isAdminUser: boolean): boolean {
  return isAdminUser;
}

/**
 * Permission matrix for reference
 */
export const PERMISSION_MATRIX = {
  blog: {
    create: { user: true, admin: true },
    read: { user: true, admin: true },
    edit: { user: "own", admin: "any" },
    delete: { user: "own", admin: "any" },
    approve: { user: false, admin: true },
    reject: { user: false, admin: true },
    feature: { user: false, admin: true },
  },
  event: {
    create: { user: false, admin: true },
    read: { user: true, admin: true },
    edit: { user: false, admin: true },
    delete: { user: false, admin: true },
    register: { user: true, admin: true },
  },
  project: {
    create: { user: false, admin: true },
    read: { user: true, admin: true },
    edit: { user: false, admin: true },
    delete: { user: false, admin: true },
  },
};
