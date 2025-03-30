// Định nghĩa kiểu dữ liệu trả về từ API
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Cấu hình cơ bản

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api"; // Đặt trong .env

// Hàm helper để thêm headers mặc định
const getDefaultHeaders = (customHeaders?: HeadersInit): HeadersInit => ({
  "Content-Type": "application/json",
  ...customHeaders,
});

// GET
export async function apiGet<T>(
  endpoint: string,
  headers?: HeadersInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getDefaultHeaders(headers),
    });

    const data = await response.json();
    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || "Lỗi không xác định",
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Lỗi mạng",
      status: 500,
    };
  }
}

// POST
export async function apiPost<T, U>(
  endpoint: string,
  body: U,
  headers?: HeadersInit
): Promise<ApiResponse<T>> {
  console.log(BASE_URL);
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getDefaultHeaders(headers),
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();
    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || "Lỗi không xác định",
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Lỗi mạng",
      status: 500,
    };
  }
}

// PATCH
export async function apiPatch<T, U>(
  endpoint: string,
  body: U,
  headers?: HeadersInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getDefaultHeaders(headers),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || "Lỗi không xác định",
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Lỗi mạng",
      status: 500,
    };
  }
}

// PUT
export async function apiPut<T, U>(
  endpoint: string,
  body: U,
  headers?: HeadersInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getDefaultHeaders(headers),
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || "Lỗi không xác định",
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Lỗi mạng",
      status: 500,
    };
  }
}

// DELETE
export async function apiDelete<T>(
  endpoint: string,
  headers?: HeadersInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getDefaultHeaders(headers),
    });

    const data = await response.json();
    return {
      data: response.ok ? data : null,
      error: response.ok ? null : data.message || "Lỗi không xác định",
      status: response.status,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Lỗi mạng",
      status: 500,
    };
  }
}
