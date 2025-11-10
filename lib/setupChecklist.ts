// lib/setupChecklist.ts
/**
 * MindMesh Blog System - Setup Checklist
 * Use this to verify your Appwrite configuration is complete
 */

export interface SetupChecklist {
  database: ChecklistItem;
  collection: ChecklistItem;
  attributes: ChecklistItem[];
  indexes: ChecklistItem[];
  storage: ChecklistItem;
  adminConfig: ChecklistItem;
}

export interface ChecklistItem {
  name: string;
  description: string;
  completed: boolean;
  notes?: string;
}

// ============ BLOG COLLECTION SCHEMA ============

export const BLOG_SCHEMA = {
  collection: {
    name: "blogs",
    description: "Blog posts collection with approval workflow",
  },
  attributes: [
    // String Attributes
    {
      name: "title",
      type: "string",
      required: true,
      description: "Blog post title",
      maxLength: 500,
    },
    {
      name: "slug",
      type: "string",
      required: true,
      description: "URL-friendly slug (e.g., 'my-blog-post')",
      unique: true,
    },
    {
      name: "excerpt",
      type: "string",
      required: true,
      description: "Short summary of the blog",
      maxLength: 500,
    },
    {
      name: "content",
      type: "string",
      required: true,
      description: "Full blog content",
    },
    {
      name: "coverImage",
      type: "string",
      required: true,
      description: "URL to cover image",
    },
    {
      name: "category",
      type: "string",
      required: true,
      description: "Blog category",
    },
    {
      name: "authorId",
      type: "string",
      required: true,
      description: "User ID of the author",
    },
    {
      name: "authorName",
      type: "string",
      required: true,
      description: "Author's display name",
    },
    {
      name: "authorEmail",
      type: "email",
      required: true,
      description: "Author's email address",
    },
    {
      name: "authorAvatar",
      type: "string",
      required: false,
      description: "Author's profile picture URL",
    },
    {
      name: "status",
      type: "string",
      required: true,
      default: "draft",
      description: "Blog status: draft, pending, approved, rejected",
      enum: ["draft", "pending", "approved", "rejected"],
    },
    {
      name: "rejectionReason",
      type: "string",
      required: false,
      description: "Reason for rejection (if applicable)",
    },

    // Array Attributes
    {
      name: "tags",
      type: "array",
      itemsType: "string",
      required: true,
      description: "Blog tags/keywords",
      default: "[]",
    },

    // Integer Attributes
    {
      name: "views",
      type: "integer",
      required: true,
      description: "Number of views",
      default: 0,
      min: 0,
    },
    {
      name: "likes",
      type: "integer",
      required: true,
      description: "Number of likes",
      default: 0,
      min: 0,
    },
    {
      name: "readTime",
      type: "integer",
      required: true,
      description: "Estimated reading time in minutes",
      default: 1,
      min: 1,
      max: 1000,
    },

    // Boolean Attributes
    {
      name: "featured",
      type: "boolean",
      required: true,
      description: "Is this blog featured?",
      default: false,
    },

    // DateTime Attributes
    {
      name: "publishedAt",
      type: "datetime",
      required: false,
      description: "Publication date (set when approved)",
    },
  ],
  indexes: [
    {
      name: "idx_status",
      attribute: "status",
      type: "ascending",
      purpose: "Filter blogs by status (pending, approved, etc.)",
    },
    {
      name: "idx_authorId",
      attribute: "authorId",
      type: "ascending",
      purpose: "Get user's own blogs",
    },
    {
      name: "idx_featured",
      attribute: "featured",
      type: "ascending",
      purpose: "Get featured blogs quickly",
    },
    {
      name: "idx_publishedAt",
      attribute: "publishedAt",
      type: "descending",
      purpose: "Sort by publication date (newest first)",
    },
    {
      name: "idx_category",
      attribute: "category",
      type: "ascending",
      purpose: "Filter blogs by category",
    },
  ],
};

// ============ STORAGE BUCKET SCHEMA ============

export const STORAGE_SCHEMA = {
  bucket: {
    name: "blog-images",
    description: "Storage for blog cover images",
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  },
};

// ============ SETUP FUNCTIONS ============

/**
 * Generate Appwrite setup checklist
 */
export function generateSetupChecklist(): SetupChecklist {
  return {
    database: {
      name: "Database Setup",
      description: 'Use existing database ID: 68ee09da002cce9f7e39',
      completed: false,
      notes: "Verify in Appwrite Console → Databases",
    },
    collection: {
      name: "Create blogs Collection",
      description:
        "Create a new collection named 'blogs' with approval workflow",
      completed: false,
      notes: "Appwrite Console → Databases → Your DB → Create Collection",
    },
    attributes: BLOG_SCHEMA.attributes.map((attr) => ({
      name: attr.name,
      description: `${attr.type}${attr.required ? " (Required)" : " (Optional)"}`,
      completed: false,
      notes: attr.description,
    })),
    indexes: BLOG_SCHEMA.indexes.map((idx) => ({
      name: idx.name,
      description: `Index on "${idx.attribute}" (${idx.type})`,
      completed: false,
      notes: idx.purpose,
    })),
    storage: {
      name: "Create blog-images Bucket",
      description:
        "Storage bucket for blog cover images (max 5MB, images only)",
      completed: false,
      notes:
        "Appwrite Console → Storage → Create Bucket (name: blog-images)",
    },
    adminConfig: {
      name: "Configure Admin Emails",
      description: "Add admin emails to lib/adminHelper.ts",
      completed: false,
      notes: "Update ADMIN_EMAILS constant with your admin email addresses",
    },
  };
}

/**
 * Print setup instructions to console
 */
export function printSetupInstructions(): void {
  console.log(`
╔════════════════════════════════════════════════════════╗
║     MindMesh Blog System - Setup Instructions         ║
╚════════════════════════════════════════════════════════╝

📋 STEP 1: Create blogs Collection
   1. Go to https://cloud.appwrite.io
   2. Select MindMesh project
   3. Go to Databases → ${BLOG_SCHEMA.collection.name}
   4. Click Create Collection
   5. Name: "${BLOG_SCHEMA.collection.name}"
   6. Click Create

🔧 STEP 2: Add Collection Attributes
   Add these attributes to the "blogs" collection:
${BLOG_SCHEMA.attributes.map((attr) => `   - ${attr.name} (${attr.type}${attr.required ? ", Required" : ""})`).join("\n")}

📑 STEP 3: Create Indexes
   Create these indexes for performance:
${BLOG_SCHEMA.indexes.map((idx) => `   - ${idx.name} on "${idx.attribute}" (${idx.type})`).join("\n")}

💾 STEP 4: Create Storage Bucket
   1. Go to Storage section
   2. Click Create Bucket
   3. Name: "${STORAGE_SCHEMA.bucket.name}"
   4. Max File Size: 5MB
   5. Allowed Types: Images only (JPEG, PNG, WebP, GIF)
   6. Click Create

👤 STEP 5: Configure Admin Emails
   1. Open: lib/adminHelper.ts
   2. Update ADMIN_EMAILS constant:
      const ADMIN_EMAILS = [
        "your-email@mindmesh.club",
        "admin@mindmesh.club",
      ];

✅ STEP 6: Verify Setup
   Run in browser console after setup:
   - Go to /blog/write (should load)
   - Create a test blog
   - Go to /admin/blog (should see pending blog)

🎉 Done! Your blog system is ready to use.
  `);
}

/**
 * Validate blog data before submission
 */
export function validateBlogData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Title is required");
  } else if (data.title.length > 500) {
    errors.push("Title must be less than 500 characters");
  }

  if (!data.content || data.content.trim().length === 0) {
    errors.push("Content is required");
  }

  if (!data.category || data.category.trim().length === 0) {
    errors.push("Category is required");
  }

  if (!data.coverImage || !data.coverImage.startsWith("http")) {
    errors.push("Valid cover image URL is required");
  }

  if (!data.excerpt || data.excerpt.trim().length === 0) {
    errors.push("Excerpt is required");
  } else if (data.excerpt.length > 500) {
    errors.push("Excerpt must be less than 500 characters");
  }

  if (data.tags && Array.isArray(data.tags) && data.tags.length > 10) {
    errors.push("Maximum 10 tags allowed");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get setup status summary
 */
export function getSetupStatusSummary(checklist: SetupChecklist): string {
  const completed =
    (checklist.database.completed ? 1 : 0) +
    (checklist.collection.completed ? 1 : 0) +
    checklist.attributes.filter((a) => a.completed).length +
    checklist.indexes.filter((i) => i.completed).length +
    (checklist.storage.completed ? 1 : 0) +
    (checklist.adminConfig.completed ? 1 : 0);

  const total =
    2 +
    checklist.attributes.length +
    checklist.indexes.length +
    2;

  const percentage = Math.round((completed / total) * 100);

  return `Setup Status: ${completed}/${total} (${percentage}%)`;
}
