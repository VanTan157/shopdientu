import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get("tag");

  if (!tag) {
    return NextResponse.json(
      { message: "Missing tag parameter" },
      { status: 400 }
    );
  }

  revalidateTag(tag);

  return NextResponse.json({ revalidated: true, now: Date.now() });
}

export async function POST(request: NextRequest) {
  try {
    const { tags } = await request.json();

    if (!tags) {
      return NextResponse.json(
        { error: "Tags parameter is required" },
        { status: 400 }
      );
    }

    const tagArray = Array.isArray(tags) ? tags : [tags];

    // Revalidate các tags
    tagArray.forEach((tag: string) => {
      revalidateTag(tag);
    });

    return NextResponse.json({
      success: true,
      message: `Revalidated tags: ${tagArray.join(", ")}`,
      revalidated: true,
      now: Date.now(),
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
