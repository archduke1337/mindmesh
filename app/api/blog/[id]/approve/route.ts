import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/blog";
import { getErrorMessage } from "@/lib/errorHandler";
import { isUserAdminByEmail } from "@/lib/adminConfig";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get user email from request headers (sent by client)
    const userEmail = request.headers.get("x-user-email");
    
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: "Not authenticated - missing user email" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!isUserAdminByEmail(userEmail)) {
      return NextResponse.json(
        { success: false, error: "Not authorized - admin access required" },
        { status: 403 }
      );
    }

    const blog = await blogService.approveBlog(params.id);

    return NextResponse.json({
      success: true,
      data: blog,
      message: "Blog approved successfully",
    });
  } catch (error) {
    console.error("Error approving blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
