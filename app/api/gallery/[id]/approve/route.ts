import { NextRequest, NextResponse } from "next/server";
import { galleryService } from "@/lib/database";
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

    const image = await galleryService.approveImage(params.id);

    return NextResponse.json({
      success: true,
      data: image,
      message: "Gallery image approved successfully",
    });
  } catch (error) {
    console.error("Error approving gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
