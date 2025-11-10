import { NextRequest, NextResponse } from "next/server";
import { blogService } from "@/lib/blog";
import { getErrorMessage } from "@/lib/errorHandler";
import { isUserAdminByEmail } from "@/lib/adminConfig";
import { account } from "@/lib/appwrite";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const data = await request.json();
    const reason = data.reason || "No reason provided";

    const blog = await blogService.rejectBlog(params.id, reason);

    return NextResponse.json({
      success: true,
      data: blog,
      message: "Blog rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting blog:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
