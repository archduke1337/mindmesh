import { NextRequest, NextResponse } from "next/server";
import { galleryService } from "@/lib/database";
import { getErrorMessage } from "@/lib/errorHandler";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const image = await galleryService.getImageById(params.id);

    return NextResponse.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error("Error fetching gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 404 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();

    const image = await galleryService.updateImage(params.id, data);

    return NextResponse.json({
      success: true,
      data: image,
      message: "Gallery image updated successfully",
    });
  } catch (error) {
    console.error("Error updating gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await galleryService.deleteImage(params.id);

    return NextResponse.json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    return NextResponse.json(
      {
        success: false,
        error: getErrorMessage(error),
      },
      { status: 500 }
    );
  }
}
