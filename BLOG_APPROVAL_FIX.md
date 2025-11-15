# Blog Approval Fix - Authorization Issue Resolution

## Problem
When attempting to approve blogs from the admin panel, users were getting the error:
```
"The current user is not authorized to perform the requested action."
```

This occurred even though:
- User was logged in
- User's email was in the ADMIN_EMAILS whitelist
- The email header was being sent correctly

## Root Cause
The issue was **Appwrite document permissions**, not application-level authentication.

When a user creates a blog document, Appwrite sets default permissions that only allow:
- The document creator to read and modify
- Optionally, others to read (depending on collection settings)

When the admin tried to update the document via the client SDK (`databases.updateDocument()`), Appwrite's permission system blocked the update because the admin user's ID didn't match the document creator's ID.

## Solution
Implemented **Admin API access** using the Appwrite API key:

### Changes Made

1. **lib/appwrite.ts** - Added `updateDocument` method to `createAdminDatabases()`:
   ```typescript
   updateDocument: async (databaseId: string, collectionId: string, documentId: string, data: any) => {
     // Uses X-Appwrite-Key header with API key for admin bypass
     // PATCH /databases/{databaseId}/collections/{collectionId}/documents/{documentId}
   }
   ```

2. **lib/blog.ts** - Updated all admin operations:
   - `approveBlog()` - Uses admin API instead of client SDK
   - `rejectBlog()` - Uses admin API instead of client SDK
   - `updateBlog()` - Uses admin API instead of client SDK
   - `toggleFeatured()` - Uses admin API instead of client SDK

   Created `getDbClient()` helper that:
   - Attempts to use admin API (available in server routes)
   - Falls back to client SDK (for client-side operations)
   - Caches the admin client for performance

3. **app/api/blog/[id]/approve/route.ts** - Added detailed logging:
   - Logs when email header is received
   - Logs admin verification result
   - Logs successful approval

## How It Works

### Old Flow (Failed)
```
Client → Server Route → blogService.approveBlog()
  → databases.updateDocument() (Client SDK)
  → Appwrite Permission System
  → ❌ Blocked (User != Document Creator)
```

### New Flow (Works)
```
Client → Server Route → blogService.approveBlog()
  → getDbClient() → createAdminDatabases()
  → fetch() with X-Appwrite-Key header (Admin API)
  → Appwrite with API Key Authentication
  → ✅ Allowed (API Key has full access)
```

## API Key Security
- The `APPWRITE_API_KEY` is only used **server-side** in API routes
- It's never exposed to the client browser
- It's stored in `.env.local` (should never be committed)

## Testing
1. Log in as an admin user (email in ADMIN_EMAILS)
2. Navigate to Admin → Blog Management
3. Try to approve a pending blog
4. Should now succeed with "Blog approved successfully!" message

## Admin Emails
Currently configured in `lib/adminConfig.ts`:
- sahilmanecode@gmail.com
- mane50205@gmail.com
- gauravramyadav@gmail.com

Add more admins by editing the `ADMIN_EMAILS` array.

## Related Fixes
- Blog rejection now works
- Blog deletion now works
- Featured blog toggling now works
- All admin operations bypass client permission restrictions
