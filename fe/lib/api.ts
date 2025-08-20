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
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

const requestWithRefresh = async <T>(
  method: string,
  endpoint: string,
  body?: any,
  headers?: HeadersInit,
  isRetry: boolean = false
): Promise<IApiResponse<T>> => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: getDefaultHeaders(headers),
      body: body ? JSON.stringify(body) : null,
      credentials: "include",
    });

    const data: IApiResponse<T> = await response.json();

    if (response.status === 401 && !isRetry) {
      const refreshed = await refreshToken();
      if (refreshed) {
        return requestWithRefresh<T>(method, endpoint, body, headers, true);
      } else {
        throw new Error("Unable to refresh token");
      }
    }

    return data;
  } catch (error) {
    return {
      message: "Lỗi không xác định",
      error: error instanceof Error ? error.message : "Lỗi mạng",
      statusCode: 500,
    };
  }
};

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
      credentials: "include",
    };

    if (forceRefresh) {
      fetchOptions.cache = "no-store";
    } else {
      // fetchOptions.cache = "force-cache";
      fetchOptions.cache = "no-store";
      fetchOptions.next = { tags: cacheTags };
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);
    return response.json();
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
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: isFormData ? headers : getDefaultHeaders(headers),
      body: isFormData ? body : JSON.stringify(body),
      credentials: "include",
    });

    const data: IApiResponse<T> = await response.json();

    if (response.ok) {
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
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: isFormData ? headers : getDefaultHeaders(headers),
      body: isFormData ? body : JSON.stringify(body),
      credentials: "include",
    });

    const data: IApiResponse<T> = await response.json();

    if (response.ok) {
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
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getDefaultHeaders(headers),
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data: IApiResponse<T> = await response.json();

    if (response.ok) {
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
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getDefaultHeaders(headers),
      credentials: "include",
    });

    const data: IApiResponse<T> = await response.json();

    if (response.ok) {
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
