# Adding Missing Blog Attributes to Appwrite

The blog approval workflow requires the following attributes in your Appwrite "blog" collection. This document guides you through adding them manually via the Appwrite Console.

## Missing Attributes

These attributes are referenced by the blog service but may not exist in your collection:

1. **publishedAt** - DateTime when the blog was approved
2. **rejectionReason** - String reason why a blog was rejected
3. **rejectionHistory** - JSON array of rejection records (stored as String)
4. **rejectionCount** - Integer count of how many times a blog was rejected

## Steps to Add Attributes

### 1. Go to Appwrite Console
- Navigate to: https://fra.cloud.appwrite.io/console
- Go to: **Databases** → **mindmesh** → **blog** collection

### 2. Add Each Missing Attribute

Click **"Add Attribute"** for each of the following:

#### **publishedAt** (String Attribute)
- **Attribute ID**: `publishedAt`
- **Type**: String
- **Required**: No (unchecked)
- **Size**: 256
- **Default Value**: (leave empty)

#### **rejectionReason** (String Attribute)
- **Attribute ID**: `rejectionReason`
- **Type**: String
- **Required**: No (unchecked)
- **Size**: 65536
- **Default Value**: (leave empty)

#### **rejectionHistory** (String Attribute for JSON Storage)
- **Attribute ID**: `rejectionHistory`
- **Type**: String
- **Required**: No (unchecked)
- **Size**: 65536 (to accommodate JSON array)
- **Default Value**: (leave empty)

#### **rejectionCount** (Integer Attribute)
- **Attribute ID**: `rejectionCount`
- **Type**: Integer
- **Required**: No (unchecked)
- **Min Value**: 0
- **Max Value**: (leave empty)
- **Default Value**: 0

## Verification

Once you've added all attributes:

1. Return to your app
2. Restart the dev server: `npm run dev`
3. Try approving or rejecting a blog from the admin panel
4. Check browser console for confirmation

## Alternative: Using Appwrite Admin SDK

If you prefer to add these programmatically, you can modify the database setup script to create these attributes directly. However, this requires elevated API key permissions.

## Troubleshooting

If you get an error like:
- **"Attribute not found in schema: publishedAt"**
  → Add the publishedAt attribute as shown above

- **"Invalid document structure"**
  → Ensure all attributes are added before attempting to create/update blogs

## Blog Workflow After Setup

1. **Create Blog** - Status set to "pending"
2. **Admin Reviews** - Admin sees pending blogs in admin panel
3. **Approve Blog** - Status → "approved", publishedAt → current timestamp
4. **Blog Published** - Appears in /blog public listing
5. **Feature Blog** - Can be marked as featured in admin panel
6. **Reject Blog** - Status → "rejected", rejectionReason recorded, rejectionHistory updated

---

**Note**: The code has been updated to gracefully handle missing attributes and provide helpful error messages if you forget to add them.
