// app/api/wards/[districtId]/route.ts
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { districtId: string } }
) {
  const { districtId } = params;

  try {
    const response = await fetch(
      `https://api.vnappmob.com/api/v2/province/ward/${districtId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "force-cache", // Cache lâu dài vì danh sách phường/xã ít thay đổi
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    
    // Set cache headers cho client (browser)
    const res = NextResponse.json(data);
    res.headers.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=3600');
    return res;
  } catch (error) {
    console.error("Error fetching wards:", error);
    return NextResponse.json(
      { error: "Failed to fetch wards" },
      { status: 500 }
    );
  }
}
