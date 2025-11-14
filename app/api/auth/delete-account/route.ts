import { NextRequest, NextResponse } from "next/server";
import { account } from "@/lib/appwrite";

export async function DELETE(request: NextRequest) {
  try {
    // Get the authorization session (Appwrite will verify the user)
    // Delete the user account
    await account.deleteIdentity("password");
    
    // Invalidate the session
    await account.deleteSession("current");

    return NextResponse.json(
      {
        success: true,
        message: "Account deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting account:", error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete account",
      },
      { status: 500 }
    );
  }
}
