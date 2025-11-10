# 📝 MindMesh Blog System - Complete Documentation

## 📚 Table of Contents
1. [Overview](#overview)
2. [Database Setup](#database-setup)
3. [User Workflow](#user-workflow)
4. [Admin Workflow](#admin-workflow)
5. [API Reference](#api-reference)
6. [Permissions](#permissions)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

The MindMesh blog system is a full-featured content management system with:
- ✅ User blog creation and submission
- ✅ Admin approval/rejection workflow
- ✅ Image upload support
- ✅ Category and tag filtering
- ✅ Featured blog highlights
- ✅ View and like tracking
- ✅ Role-based permissions

---

## 🗄️ Database Setup

### Collection Schema: `blogs`

**Required Attributes:**

```
String Attributes:
├── title (Required, Max 500 chars)
├── slug (Required, Unique)
├── excerpt (Required, Max 500 chars)
├── content (Required)
├── coverImage (Required, URL)
├── category (Required)
├── authorId (Required)
├── authorName (Required)
├── authorEmail (Required)
├── status (Required, Enum: draft|pending|approved|rejected)
└── rejectionReason (Optional)

Array Attributes:
└── tags (Required, Array of Strings)

Integer Attributes:
├── views (Required, Default: 0)
├── likes (Required, Default: 0)
└── readTime (Required, Default: 1)

Boolean Attributes:
└── featured (Required, Default: false)

DateTime Attributes:
├── publishedAt (Optional)
├── $createdAt (Auto)
└── $updatedAt (Auto)
```

### Required Indexes:

1. **Status Index** - Filter by approval status
   - Attribute: `status`
   - Type: Ascending

2. **Author Index** - Get user's own blogs
   - Attribute: `authorId`
   - Type: Ascending

3. **Featured Index** - Get featured blogs
   - Attribute: `featured`
   - Type: Ascending

4. **Published Index** - Sort by date
   - Attribute: `publishedAt`
   - Type: Descending

5. **Category Index** - Filter by category
   - Attribute: `category`
   - Type: Ascending

### Storage Bucket: `blog-images`

- **Max File Size:** 5 MB
- **Allowed Types:** JPEG, PNG, WebP, GIF
- **Permissions:** Public read, Authenticated write

---

## 👥 User Workflow

### 1. Write Blog (`/blog/write`)

```
User Navigates to /blog/write
        ↓
Fill in Form:
  - Title
  - Excerpt
  - Category
  - Content (Markdown)
  - Tags
  - Cover Image
        ↓
Submit (Status = "pending")
        ↓
Redirect to /blog
        ↓
View Notification: "Blog submitted for approval"
```

**Requirements:**
- ✅ User must be logged in
- ✅ Title is required
- ✅ Content is required
- ✅ Category is required
- ✅ Cover image is required

### 2. View Published Blogs (`/blog`)

```
Public page showing:
- All "approved" blogs
- Filtered by category
- Search by title/tags
- Sort by date/views
- Featured blogs highlighted
```

### 3. View Individual Blog (`/blog/[slug]`)

```
Shows:
- Full blog content
- Author info
- Publication date
- Read time
- Like count
- View count
```

---

## 🛡️ Admin Workflow

### 1. Blog Management (`/admin/blog`)

**Tabs:**
- **Pending** - New submissions awaiting review
- **Approved** - Published blogs
- **Rejected** - Denied submissions with reasons
- **All** - Complete history

### 2. Approve Blog

```
Admin Views Pending Blog
        ↓
Clicks "Approve"
        ↓
Status Changes: "pending" → "approved"
        ↓
publishedAt = Current Date
        ↓
Blog Appears on Public /blog Page
```

### 3. Reject Blog

```
Admin Views Pending Blog
        ↓
Clicks "Reject"
        ↓
Modal Opens
        ↓
Admin Enters Rejection Reason
        ↓
Submits
        ↓
Status Changes: "pending" → "rejected"
        ↓
Author Sees Rejection Reason
        ↓
Author Can Edit & Resubmit
```

### 4. Feature Blog

```
Admin Navigates to "Approved" Tab
        ↓
Clicks "Feature" on Approved Blog
        ↓
featured: false → true
        ↓
Blog Appears in:
- Featured Section on /blog
- /blog?featured=true
```

### 5. Delete Blog

```
Admin Clicks "Delete"
        ↓
Confirmation Dialog
        ↓
Confirms
        ↓
Blog Permanently Deleted
```

---

## 🔌 API Reference

### Blog Service (`lib/blog.ts`)

#### Public Methods

```typescript
// Get published blogs (public)
blogService.getPublishedBlogs(limit?: number): Promise<Blog[]>

// Get featured blogs
blogService.getFeaturedBlogs(limit?: number): Promise<Blog[]>

// Get blogs by category
blogService.getBlogsByCategory(category: string): Promise<Blog[]>

// Get blog by slug
blogService.getBlogBySlug(slug: string): Promise<Blog>

// Get user's blogs
blogService.getUserBlogs(userId: string): Promise<Blog[]>

// Increment views
blogService.incrementViews(blogId: string): Promise<void>

// Toggle like
blogService.toggleLike(blogId: string, liked: boolean): Promise<void>
```

#### User Methods

```typescript
// Create blog (submitted as "pending")
blogService.createBlog(blogData: Partial<Blog>): Promise<Blog>

// Upload cover image
blogService.uploadBlogImage(file: File): Promise<string>

// Generate URL slug from title
blogService.generateSlug(title: string): string

// Calculate reading time
blogService.calculateReadTime(content: string): number
```

#### Admin Methods

```typescript
// Get all blogs (any status)
blogService.getAllBlogs(): Promise<Blog[]>

// Get pending blogs
blogService.getPendingBlogs(): Promise<Blog[]>

// Get blogs by status
blogService.getBlogsByStatus(status: BlogStatus): Promise<Blog[]>

// Approve blog
blogService.approveBlog(blogId: string): Promise<Blog>

// Reject blog
blogService.rejectBlog(blogId: string, reason: string): Promise<Blog>

// Update blog
blogService.updateBlog(blogId: string, data: Partial<Blog>): Promise<Blog>

// Delete blog
blogService.deleteBlog(blogId: string): Promise<boolean>
```

---

## 🔐 Permissions

### Blog Permissions Matrix

| Action | Regular User | Admin |
|--------|---|---|
| **View Published Blogs** | ✅ Yes | ✅ Yes |
| **Create Blog** | ✅ Yes (pending) | ✅ Yes (pending) |
| **Edit Own Blog** | ✅ Yes (resets to pending) | ✅ Yes |
| **Delete Own Blog** | ✅ Yes | ✅ Yes |
| **Delete Any Blog** | ❌ No | ✅ Yes |
| **View All Blogs** | ❌ No | ✅ Yes |
| **Approve Blog** | ❌ No | ✅ Yes |
| **Reject Blog** | ❌ No | ✅ Yes |
| **Feature Blog** | ❌ No | ✅ Yes |
| **View Rejection Reason** | ✅ Yes (own) | ✅ Yes |

### Admin Role

Admin status is determined by email. Configure in `lib/adminHelper.ts`:

```typescript
const ADMIN_EMAILS = [
  "admin@mindmesh.club",
  "gaurav@mindmesh.club",
  // Add more admin emails
];
```

---

## 📊 Blog Statuses

| Status | Meaning | Visible to Public | Visible to Author |
|--------|---------|---|---|
| **draft** | Not submitted | ❌ No | ✅ Yes |
| **pending** | Awaiting admin review | ❌ No | ✅ Yes |
| **approved** | Published | ✅ Yes | ✅ Yes |
| **rejected** | Denied, shows reason | ❌ No | ✅ Yes |

---

## 🚀 Routes

### Public Routes
- `/blog` - Blog listing page
- `/blog/[slug]` - Individual blog post
- `/blog/write` - Create blog (login required)

### Admin Routes
- `/admin/blog` - Blog management dashboard

---

## 🛠️ Configuration

### Environment Variables

```bash
# Already configured in your .env
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id
NEXT_PUBLIC_APPWRITE_DATABASE_ID=68ee09da002cce9f7e39
```

### Admin Configuration

Edit `lib/adminHelper.ts` to add admin emails:

```typescript
const ADMIN_EMAILS = [
  "your-email@mindmesh.club",
  "admin@mindmesh.club",
];
```

---

## 🐛 Troubleshooting

### Problem: "Blog not found" when submitting

**Solution:**
1. Verify `blogs` collection exists in Appwrite
2. Check all attributes are created correctly
3. Verify collection ID: `blogs`

### Problem: Images not uploading

**Solution:**
1. Check `blog-images` bucket exists
2. Verify file size < 5MB
3. Verify file type is JPEG/PNG/WebP/GIF
4. Check bucket permissions allow write for authenticated users

### Problem: Blog appears as "pending" forever

**Solution:**
1. Admin must click "Approve" button
2. Verify admin email is in `ADMIN_EMAILS` in `lib/adminHelper.ts`
3. Clear browser cache and reload admin panel

### Problem: Can't see "Approve" button as admin

**Solution:**
1. Verify your email is in `lib/adminHelper.ts` ADMIN_EMAILS
2. Log out and log back in
3. Check browser console for errors

### Problem: "Unauthorized" error when creating blog

**Solution:**
1. Make sure you're logged in
2. Check user ID is being passed correctly
3. Verify Appwrite session is valid

---

## 📈 Performance Tips

1. **Add Indexes** - All recommended indexes improve query speed
2. **Limit Results** - Use pagination for blog lists
3. **Cache Published Blogs** - They rarely change
4. **Optimize Images** - Compress before uploading
5. **Use CDN** - Store images on CDN for faster delivery

---

## 🔄 Blog Workflow Example

```
1. User writes blog at /blog/write
   ↓
2. Blog saved with status="pending"
   ↓
3. Admin sees it in /admin/blog → Pending tab
   ↓
4a. Admin approves → status="approved", publishedAt=now
    → Blog visible on /blog
   ↓
4b. Admin rejects with reason
    → User sees rejection message
    → Can edit and resubmit
```

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review `lib/blog.ts` comments
3. Check browser console for errors
4. Verify Appwrite collection setup
5. Check admin email configuration

---

## ✅ Checklist

- [ ] Create `blogs` collection in Appwrite
- [ ] Add all required attributes
- [ ] Create all indexes
- [ ] Create `blog-images` bucket
- [ ] Set bucket permissions
- [ ] Update admin emails in `lib/adminHelper.ts`
- [ ] Test blog creation at `/blog/write`
- [ ] Test blog approval at `/admin/blog`
- [ ] Verify blog appears on `/blog`
- [ ] Test rejection workflow
- [ ] Deploy to production

---

## 🎉 You're All Set!

Your blog system is ready. Start creating and publishing content!
