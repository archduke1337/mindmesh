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
    const isFeatured = data.isFeatured || false;

    const blog = await blogService.updateBlog(params.id, {
      featured: isFeatured,
    });

    return NextResponse.json({
      success: true,
      data: blog,
      message: `Blog ${isFeatured ? "marked as featured" : "removed from featured"}`,
    });
  } catch (error) {
    console.error("Error toggling featured:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
