import { IApiResponse } from "./types/api";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const detectTagsFromEndpoint = (endpoint: string): string[] => {
  const tags: string[] = [];

  if (endpoint.includes("/laptop")) tags.push("laptops");
  if (endpoint.includes("/mobile")) tags.push("mobiles");
  if (endpoint.includes("/tablet")) tags.push("tablets");
  if (endpoint.includes("/headphone")) tags.push("headphones");
  if (endpoint.includes("/order")) tags.push("orders");
  if (endpoint.includes("/cart")) tags.push("carts");
  if (endpoint.includes("/")) tags.push("carts");

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

const getDefaultHeaders = (customHeaders?: HeadersInit): HeadersInit => ({
  "Content-Type": "application/json",
  ...customHeaders,
});

export async function fetchWithAuth<T>(
  url: string,
  options: RequestInit = {},
  retry = true
): Promise<IApiResponse<T>> {
  const fetchOptions: RequestInit = {
    ...options,
    credentials: "include",
  };

  const response = await fetch(`${BASE_URL}${url}`, fetchOptions);

  let data: any = null;
  try {
    data = await response.json();
  } catch (e) {}

  const isUnauthorized =
    response.status === 401 || (data && data.statusCode === 401);

  if (isUnauthorized && retry) {
    try {
      const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        if (refreshData && refreshData.success) {
          return fetchWithAuth(url, options, false);
        }
      } else {
        window.location.href = "/login";
        return {
          success: false,
          message: "Đăng nhập lại để tiếp tục sử dụng trang web",
          statusCode: 401,
        };
      }
    } catch (e) {}
  }
  if (response.ok && data.success) {
    return data as IApiResponse<T>;
  }
  return {
    message: data.message || "Lỗi không xác định",
    statusCode: data.statusCode ?? 500,
    error: data?.error || "Lỗi mạng",
  };
}

export async function apiGet<T>(
  endpoint: string,
  headers?: HeadersInit,
  tags?: string[],
  forceRefresh?: boolean
): Promise<IApiResponse<T>> {
  try {
    const autoTags = detectTagsFromEndpoint(endpoint);
    const cacheTags = tags || autoTags;
    const fetchOptions: RequestInit = {
      method: "GET",
      headers: getDefaultHeaders(headers),
    };

    if (forceRefresh) {
      (fetchOptions as any).cache = "no-store";
    } else {
      (fetchOptions as any).cache = "force-cache";
      (fetchOptions as any).next = { tags: cacheTags };
    }

    return fetchWithAuth<T>(endpoint, fetchOptions);
  } catch (error) {
    return {
      message: "Lỗi không xác định",
      error: error instanceof Error ? error.message : "Lỗi mạng",
      statusCode: 500,
    };
  }
}

export async function apiPost<T, U>(
  endpoint: string,
  body: U | FormData,
  headers?: HeadersInit,
  tags?: string[]
): Promise<IApiResponse<T>> {
  try {
    const isFormData = body instanceof FormData;
    const fetchOptions: RequestInit = {
      method: "POST",
      headers: isFormData ? headers : getDefaultHeaders(headers),
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    };

    const data = await fetchWithAuth<T>(endpoint, fetchOptions);

    if (data && data.success) {
      const autoTags = detectTagsFromEndpoint(endpoint);
      const revalidateTags = tags || autoTags;
      await callRevalidateAPI(revalidateTags);
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Lỗi mạng",
      statusCode: 500,
      message: "Lỗi không xác định",
    };
  }
}

export async function apiPatch<T, U>(
  endpoint: string,
  body: U | FormData,
  headers?: HeadersInit,
  tags?: string[]
): Promise<IApiResponse<T>> {
  try {
    const isFormData = body instanceof FormData;
    const fetchOptions: RequestInit = {
      method: "PATCH",
      headers: isFormData ? headers : getDefaultHeaders(headers),
      body: isFormData ? (body as FormData) : JSON.stringify(body),
    };

    const data = await fetchWithAuth<T>(endpoint, fetchOptions);

    if (data && data.success) {
      const autoTags = detectTagsFromEndpoint(endpoint);
      const revalidateTags = tags || autoTags;
      await callRevalidateAPI(revalidateTags);
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Lỗi mạng",
      statusCode: 500,
      message: "Lỗi không xác định",
    };
  }
}

// PUT
export async function apiPut<T, U>(
  endpoint: string,
  body: U,
  headers?: HeadersInit,
  tags?: string[]
): Promise<IApiResponse<T>> {
  try {
    const fetchOptions: RequestInit = {
      method: "PUT",
      headers: getDefaultHeaders(headers),
      body: JSON.stringify(body),
    };

    const data = await fetchWithAuth<T>(endpoint, fetchOptions);

    if (data && data.success) {
      const autoTags = detectTagsFromEndpoint(endpoint);
      const revalidateTags = tags || autoTags;
      await callRevalidateAPI(revalidateTags);
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Lỗi mạng",
      statusCode: 500,
      message: "Lỗi không xác định",
    };
  }
}

// DELETE
export async function apiDelete<T>(
  endpoint: string,
  headers?: HeadersInit,
  tags?: string[]
): Promise<IApiResponse<T>> {
  try {
    const fetchOptions: RequestInit = {
      method: "DELETE",
      headers: getDefaultHeaders(headers),
    };

    const data = await fetchWithAuth<T>(endpoint, fetchOptions);

    if (data && data.success) {
      const autoTags = detectTagsFromEndpoint(endpoint);
      const revalidateTags = tags || autoTags;
      await callRevalidateAPI(revalidateTags);
    }

    return data;
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Lỗi mạng",
      statusCode: 500,
      message: "Lỗi không xác định",
    };
  }
}

export const revalidateCache = async (tags: string | string[]) => {
  const tagArray = Array.isArray(tags) ? tags : [tags];
  await callRevalidateAPI(tagArray);
};

export const revalidateAllProducts = async () => {
  const productTags = ["laptops", "mobiles", "tablets", "headphones"];
  await callRevalidateAPI(productTags);
};
