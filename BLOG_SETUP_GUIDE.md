# Blog System Setup Guide - Appwrite Configuration

## 🎯 Overview

This guide walks you through creating the blog collection, attributes, and indexes in Appwrite for the MindMesh blog system.

---

## 📋 Step 1: Create Blogs Collection

1. Go to [Appwrite Console](https://cloud.appwrite.io)
2. Select your **MindMesh** project
3. Go to **Databases**
4. Select your database: **`68ee09da002cce9f7e39`**
5. Click **Create Collection**
6. Name: **`blogs`**
7. Click **Create**

---

## 🔧 Step 2: Create Collection Attributes

Add the following attributes to the `blogs` collection. Follow the exact names and types:

### **Text Attributes (String)**

| Name | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `title` | String | ✅ Yes | - | Max 500 chars |
| `slug` | String | ✅ Yes | - | URL-friendly (e.g., "my-blog-post") |
| `excerpt` | String | ✅ Yes | - | Short summary, max 500 chars |
| `content` | String | ✅ Yes | - | Full blog content (no max limit) |
| `coverImage` | String | ✅ Yes | - | URL to cover image |
| `category` | String | ✅ Yes | - | Blog category (e.g., "Technology") |
| `authorId` | String | ✅ Yes | - | User ID from auth |
| `authorName` | String | ✅ Yes | - | Author's display name |
| `authorEmail` | String | ✅ Yes | - | Author's email |
| `authorAvatar` | String | ❌ No | - | Optional profile picture URL |
| `status` | String | ✅ Yes | "draft" | Enum: draft, pending, approved, rejected |
| `rejectionReason` | String | ❌ No | - | Reason for rejection (optional) |

### **Email Attribute**

| Name | Type | Required | Default | Notes |
|------|------|----------|---------|-------|
| `authorEmail` | Email | ✅ Yes | - | Already added as String above |

### **Array Attributes**

| Name | Type | Items Type | Required | Default |
|------|------|-----------|----------|---------|
| `tags` | Array | String | ✅ Yes | [] | Array of tags |

### **Integer Attributes**

| Name | Type | Required | Default | Min | Max | Notes |
|------|------|----------|---------|-----|-----|-------|
| `views` | Integer | ✅ Yes | 0 | 0 | - | Number of views |
| `likes` | Integer | ✅ Yes | 0 | 0 | - | Number of likes |
| `readTime` | Integer | ✅ Yes | 1 | 1 | 1000 | Reading time in minutes |

### **Boolean Attributes**

| Name | Type | Required | Default |
|------|------|----------|---------|
| `featured` | Boolean | ✅ Yes | false |

### **DateTime Attributes**

| Name | Type | Required | Default |
|------|------|----------|---------|
| `publishedAt` | DateTime | ❌ No | - |

---

## 📑 Step 3: Create Indexes

Indexes improve query performance. Create these in the `blogs` collection:

### **Index 1: Status Filter**
- **Name:** `idx_status`
- **Attribute:** `status`
- **Type:** Ascending
- **Use:** Filter blogs by status (pending, approved, etc.)

### **Index 2: Author ID**
- **Name:** `idx_authorId`
- **Attribute:** `authorId`
- **Type:** Ascending
- **Use:** Get user's own blogs

### **Index 3: Featured**
- **Name:** `idx_featured`
- **Attribute:** `featured`
- **Type:** Ascending
- **Use:** Get featured blogs

### **Index 4: Published Date**
- **Name:** `idx_publishedAt`
- **Attribute:** `publishedAt`
- **Type:** Descending
- **Use:** Sort by publication date (newest first)

### **Index 5: Category**
- **Name:** `idx_category`
- **Attribute:** `category`
- **Type:** Ascending
- **Use:** Filter blogs by category

### **Composite Index (Optional):**
- **Attributes:** `status`, `featured`
- **Type:** Ascending
- **Use:** Get featured approved blogs quickly

---

## 💾 Step 4: Create Storage Bucket

For blog cover images:

1. Go to **Storage** in Appwrite Console
2. Click **Create Bucket**
3. **Name:** `blog-images`
4. **File Size Limit:** 5 MB (recommended)
5. **Allowed File Types:** `image/jpeg, image/png, image/webp, image/gif`
6. Click **Create**

### **Set Permissions:**

1. Click on `blog-images` bucket
2. Go to **Settings** tab
3. **Permissions:**
   - Public: **Read** ✅
   - Authenticated Users: **Read, Write, Delete**

---

## 🔑 Step 5: Verify Collection ID

Your code expects:
```typescript
export const BLOGS_COLLECTION_ID = "blogs";
export const BLOG_IMAGES_BUCKET_ID = "blog-images";
export const DATABASE_ID = "68ee09da002cce9f7e39";
```

Make sure collection and bucket names match exactly!

---

## ✅ Step 6: Test the Setup

Once created, test with this curl command:

```bash
curl -X GET "https://fra.cloud.appwrite.io/v1/databases/68ee09da002cce9f7e39/collections/blogs" \
  -H "X-Appwrite-Project: YOUR_PROJECT_ID" \
  -H "X-Appwrite-API-Key: YOUR_API_KEY"
```

Should return the collection details.

---

## 📊 Sample Blog Document

Once the collection is created, here's what a blog document looks like:

```json
{
  "$id": "unique_blog_id",
  "title": "Getting Started with Next.js",
  "slug": "getting-started-with-nextjs",
  "excerpt": "Learn how to build amazing web apps with Next.js",
  "content": "Full blog content here...",
  "coverImage": "https://example.com/image.jpg",
  "category": "Development",
  "tags": ["nextjs", "javascript", "web"],
  "authorId": "user_id_123",
  "authorName": "John Doe",
  "authorEmail": "john@example.com",
  "authorAvatar": "https://example.com/avatar.jpg",
  "status": "approved",
  "rejectionReason": null,
  "publishedAt": "2024-11-11T10:30:00Z",
  "views": 125,
  "likes": 42,
  "featured": true,
  "readTime": 5,
  "$createdAt": "2024-11-10T15:00:00Z",
  "$updatedAt": "2024-11-11T10:30:00Z"
}
```

---

## 🚀 What's Next?

After setting up Appwrite:

1. ✅ Users can write blogs at `/blog/write`
2. ✅ Blogs are submitted as "pending"
3. ✅ Admins can approve/reject at `/admin/blog`
4. ✅ Approved blogs appear on `/blog`
5. ✅ Users can view individual blogs at `/blog/[slug]`

---

## 🛠️ Troubleshooting

### **Error: Collection not found**
- Verify collection name is exactly `blogs` (lowercase)
- Check database ID: `68ee09da002cce9f7e39`

### **Error: Attribute not found**
- Check attribute names match exactly (case-sensitive)
- Verify all required attributes are created

### **Error: Index already exists**
- You can't create duplicate indexes
- Delete the old one first

### **Images not uploading**
- Verify bucket name is `blog-images`
- Check file size is under 5MB
- Verify file type is allowed (jpg, png, webp, gif)

---

## 📞 Need Help?

If you encounter issues:
1. Check Appwrite Console for error messages
2. Verify all collection names and IDs
3. Ensure indexes are created for performance
4. Test with Appwrite API directly
