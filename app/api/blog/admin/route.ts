import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/blog";
import { getErrorMessage } from "@/lib/errorHandler";
import { isUserAdminByEmail } from "@/lib/adminConfig";
import { account } from "@/lib/appwrite";

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const session = await account.getSession("current").catch(() => null);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await account.get().catch(() => null);
    if (!user || !isUserAdminByEmail(user.email)) {
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";

    let blogs;

    if (status === "pending") {
      blogs = await blogService.getPendingBlogs();
    } else {
      blogs = await blogService.getAllBlogs();
    }

    return NextResponse.json({
      success: true,
      data: blogs,
      total: blogs.length,
    });
  } catch (error) {
    console.error("Admin blog API error:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
