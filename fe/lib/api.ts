// Định nghĩa kiểu dữ liệu trả về từ API
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

// Cấu hình cơ bản

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"; // Đặt trong .env

// Hàm helper để thêm headers mặc định
const getDefaultHeaders = (customHeaders?: HeadersInit): HeadersInit => ({
  "Content-Type": "application/json",
  ...customHeaders,
});

// Hàm làm mới token
const refreshToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: getDefaultHeaders(),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    // Backend sẽ set lại accessToken qua cookie, không cần trả về token
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

// Hàm request chung với auto refresh token
const requestWithRefresh = async <T>(
  method: string,
  endpoint: string,
  body?: any,
  headers?: HeadersInit,
  isRetry: boolean = false
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: getDefaultHeaders(headers),
      body: body ? JSON.stringify(body) : null,
      credentials: "include",
    });

    const data = await response.json();

    if (response.status === 401 && !isRetry) {
      // Nếu lỗi 401 và chưa thử lại, làm mới token
      const refreshed = await refreshToken();
      if (refreshed) {
        // Thử lại request với accessToken mới từ cookie
        return requestWithRefresh<T>(method, endpoint, body, headers, true);
      } else {
        throw new Error("Unable to refresh token");
      }
    }

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
};

// GET
export async function apiGet<T>(
  endpoint: string,
  headers?: HeadersInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getDefaultHeaders(headers),
      credentials: "include",
      cache: "no-store",
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
  body: U | FormData,
  headers?: HeadersInit
): Promise<ApiResponse<T>> {
  console.log(BASE_URL);
  try {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: isFormData ? headers : getDefaultHeaders(headers),
      body: isFormData ? body : JSON.stringify(body),
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
  body: U | FormData,
  headers?: HeadersInit
): Promise<ApiResponse<T>> {
  try {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: isFormData ? headers : getDefaultHeaders(headers),
      body: isFormData ? body : JSON.stringify(body),
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

// DELETE
export async function apiDelete<T>(
  endpoint: string,
  headers?: HeadersInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getDefaultHeaders(headers),
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
