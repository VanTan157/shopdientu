// app/api/provinces/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://api.vnappmob.com/api/v2/province", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "force-cache", // Cache lâu dài vì danh sách tỉnh ít thay đổi
      next: { revalidate: 86400 }, // Revalidate mỗi 24 giờ
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    // Set cache headers cho client (browser)
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
    return res;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    return NextResponse.json(
      { error: "Failed to fetch provinces" },
      { status: 500 }
    );
  }
}
