// Định nghĩa kiểu dữ liệu trả về từ API
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const detectTagsFromEndpoint = (endpoint: string): string[] => {
  const tags: string[] = [];

  if (endpoint.includes("/laptop")) tags.push("laptops");
  if (endpoint.includes("/mobile")) tags.push("mobiles");
  if (endpoint.includes("/tablet")) tags.push("tablets");
  if (endpoint.includes("/headphone")) tags.push("headphones");
  if (endpoint.includes("/order")) tags.push("orders");
  if (endpoint.includes("/user") || endpoint.includes("/customer"))
    tags.push("users");
  return tags.length > 0 ? tags : ["general"];
};

const callRevalidateAPI = async (tags: string[]): Promise<void> => {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tags }),
    });
  } catch (error) {
    console.error("Failed to revalidate cache:", error);
  }
};

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
  headers?: HeadersInit,
  tags?: string[]
): Promise<ApiResponse<T>> {
  try {
    const autoTags = detectTagsFromEndpoint(endpoint);
    const cacheTags = tags || autoTags;

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getDefaultHeaders(headers),
      credentials: "include",
      cache: "force-cache",
      next: { tags: cacheTags },
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
  headers?: HeadersInit,
  tags?: string[]
): Promise<ApiResponse<T>> {
  try {
    const isFormData = body instanceof FormData;
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: isFormData ? headers : getDefaultHeaders(headers),
      body: isFormData ? body : JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();

    // Revalidate cache nếu request thành công
    if (response.ok) {
      const autoTags = detectTagsFromEndpoint(endpoint);
      const revalidateTags = tags || autoTags;
      await callRevalidateAPI(revalidateTags);
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
}

// PATCH
export async function apiPatch<T, U>(
  endpoint: string,
  body: U | FormData,
  headers?: HeadersInit,
  tags?: string[]
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

    // Revalidate cache nếu request thành công
    if (response.ok) {
      const autoTags = detectTagsFromEndpoint(endpoint);
      const revalidateTags = tags || autoTags;
      await callRevalidateAPI(revalidateTags);
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
}

// PUT
export async function apiPut<T, U>(
  endpoint: string,
  body: U,
  headers?: HeadersInit,
  tags?: string[]
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getDefaultHeaders(headers),
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await response.json();

    // Revalidate cache nếu request thành công
    if (response.ok) {
      const autoTags = detectTagsFromEndpoint(endpoint);
      const revalidateTags = tags || autoTags;
      await callRevalidateAPI(revalidateTags);
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
}

// DELETE
export async function apiDelete<T>(
  endpoint: string,
  headers?: HeadersInit,
  tags?: string[]
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getDefaultHeaders(headers),
      credentials: "include",
    });

    const data = await response.json();

    // Revalidate cache nếu request thành công
    if (response.ok) {
      const autoTags = detectTagsFromEndpoint(endpoint);
      const revalidateTags = tags || autoTags;
      await callRevalidateAPI(revalidateTags);
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
}

// Hàm tiện ích để revalidate cache theo yêu cầu
export const revalidateCache = async (tags: string | string[]) => {
  const tagArray = Array.isArray(tags) ? tags : [tags];
  await callRevalidateAPI(tagArray);
};

// Hàm tiện ích để revalidate tất cả cache của sản phẩm
export const revalidateAllProducts = async () => {
  const productTags = ["laptops", "mobiles", "tablets", "headphones"];
  await callRevalidateAPI(productTags);
};
