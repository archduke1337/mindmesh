// app/api/appwrite-test/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
    const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

    // Log environment variables (WITHOUT secrets)
    console.log("🔍 Appwrite Configuration:", {
      endpoint,
      projectId,
      databaseId,
      bucketId,
    });

    // Test if endpoint is accessible
    const endpointTest = await fetch(`${endpoint}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!endpointTest.ok) {
      throw new Error(`Endpoint health check failed: ${endpointTest.status}`);
    }

    const healthData = await endpointTest.json();

    return NextResponse.json({
      status: "success",
      message: "Appwrite endpoint is reachable",
      endpoint: endpoint,
      projectId: projectId,
      databaseId: databaseId,
      bucketId: bucketId,
      health: healthData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Appwrite Test Error:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to connect to Appwrite",
        error: error.toString(),
      },
      { status: 500 }
    );
  }
}
