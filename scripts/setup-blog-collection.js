#!/usr/bin/env node

/**
 * Script to set up or update the blog collection in Appwrite
 * Usage: node scripts/setup-blog-collection.js
 */

import { Client, Databases, ID } from "node-appwrite";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);

const DATABASE_ID = "68ee09da002cce9f7e39";
const BLOG_COLLECTION_ID = "blog";

async function setupBlogCollection() {
  try {
    console.log("🔍 Checking blog collection...");

    // Try to get collection to see if it exists
    try {
      const collection = await databases.getCollection(DATABASE_ID, BLOG_COLLECTION_ID);
      console.log("✅ Blog collection exists");
      console.log(`📊 Current attributes: ${collection.attributes.map((a) => a.key).join(", ")}`);

      // List of required attributes
      const requiredAttributes = [
        { key: "publishedAt", type: "string", required: false },
        { key: "rejectionReason", type: "string", required: false },
        { key: "rejectionHistory", type: "string", required: false }, // Store as JSON string
        { key: "rejectionCount", type: "integer", required: false },
      ];

      // Check which attributes are missing
      const existingKeys = collection.attributes.map((a) => a.key);
      const missingAttributes = requiredAttributes.filter((attr) => !existingKeys.includes(attr.key));

      if (missingAttributes.length === 0) {
        console.log("✅ All required attributes already exist!");
        return;
      }

      console.log(`\n❌ Missing attributes: ${missingAttributes.map((a) => a.key).join(", ")}`);
      console.log("\n⚠️  To add these attributes, you need to:");
      console.log("1. Go to Appwrite Console: https://cloud.appwrite.io");
      console.log("2. Navigate to: Database → mindmesh → blog collection");
      console.log("3. Click 'Add Attribute' for each missing field:");

      missingAttributes.forEach((attr) => {
        if (attr.key === "publishedAt") {
          console.log(`   - Name: publishedAt, Type: String, Required: No`);
        } else if (attr.key === "rejectionReason") {
          console.log(`   - Name: rejectionReason, Type: String, Required: No`);
        } else if (attr.key === "rejectionHistory") {
          console.log(`   - Name: rejectionHistory, Type: String, Required: No, Max: 65536`);
        } else if (attr.key === "rejectionCount") {
          console.log(`   - Name: rejectionCount, Type: Integer, Required: No, Default: 0`);
        }
      });

      console.log(
        "\n📝 Note: This script displays the required changes. Appwrite doesn't allow programmatic attribute creation via standard API calls."
      );
    } catch (error) {
      if (error.code === 404) {
        console.error("❌ Blog collection not found!");
        console.error("Please create the blog collection in Appwrite first.");
        process.exit(1);
      }
      throw error;
    }
  } catch (error) {
    console.error("❌ Error:", error.message || error);
    process.exit(1);
  }
}

setupBlogCollection();
