# 🚀 Blog System - Quick Reference

## 📖 Routes

```
User Routes:
/blog                  → Blog listing (public)
/blog/[slug]          → Individual blog post (public)
/blog/write           → Create blog (login required)

Admin Routes:
/admin/blog           → Blog management dashboard
```

## 🔑 Key Files

```
lib/blog.ts                    → Blog service methods
lib/adminHelper.ts             → Admin role checking
app/Blog/write/page.tsx       → Blog creation page
app/admin/blog/page.tsx       → Admin approval page
app/Blog/page.tsx             → Blog listing page
```

## 📝 Blog Creation

1. User fills form at `/blog/write`
2. Submits → Status = "pending"
3. Admin approves at `/admin/blog`
4. Blog appears on `/blog`

## ✅ Admin Emails

Edit `lib/adminHelper.ts`:

```typescript
const ADMIN_EMAILS = [
  "your-email@mindmesh.club",
];
```

## 🗄️ Database Collections

```
Database ID: 68ee09da002cce9f7e39
Collection: blogs
Bucket: blog-images
```

## 📊 Blog Statuses

- `draft` - Not submitted
- `pending` - Awaiting approval
- `approved` - Published
- `rejected` - Denied with reason

## 🎮 API Methods

### User Methods
```typescript
blogService.createBlog(data)           // Submit blog
blogService.getUserBlogs(userId)       // Get my blogs
blogService.uploadBlogImage(file)      // Upload image
blogService.getPublishedBlogs()        // View blogs
blogService.incrementViews(blogId)     // Track views
```

### Admin Methods
```typescript
blogService.getAllBlogs()              // All blogs
blogService.getPendingBlogs()          // Pending approval
blogService.approveBlog(blogId)        // Approve
blogService.rejectBlog(blogId, reason) // Reject
blogService.updateBlog(blogId, data)   // Edit
blogService.deleteBlog(blogId)         // Delete
```

## 🔒 Permissions

```
                Regular User | Admin
View Published     Yes        | Yes
Create Blog        Yes        | Yes
Edit Own           Yes        | Yes
Edit Any           No         | Yes
Delete Own         Yes        | Yes
Delete Any         No         | Yes
Approve            No         | Yes
Reject             No         | Yes
Feature            No         | Yes
```

## 🐛 Common Issues

### Blog not submitting?
→ Check title, content, category, image all filled

### Can't see approve button?
→ Add your email to ADMIN_EMAILS in lib/adminHelper.ts

### Image upload fails?
→ File must be < 5MB, JPEG/PNG/WebP/GIF

### Blog shows "pending" forever?
→ Admin hasn't clicked Approve yet

## 📱 Appwrite Setup

**Collections:**
- [ ] Create "blogs" collection
- [ ] Add all string/array/integer/boolean attributes
- [ ] Create 5 indexes (status, authorId, featured, publishedAt, category)

**Storage:**
- [ ] Create "blog-images" bucket
- [ ] Set max 5MB, images only
- [ ] Allow public read, auth write

**Admin:**
- [ ] Update ADMIN_EMAILS in lib/adminHelper.ts

## 🎯 First Steps

1. Create blogs collection in Appwrite
2. Add admin email to lib/adminHelper.ts
3. Create blog at /blog/write
4. Approve at /admin/blog
5. View on /blog ✅

## 📞 Help

- Documentation: `BLOG_SYSTEM_DOCUMENTATION.md`
- Setup Guide: `BLOG_SETUP_GUIDE.md`
- Code Comments: Check `lib/blog.ts`
