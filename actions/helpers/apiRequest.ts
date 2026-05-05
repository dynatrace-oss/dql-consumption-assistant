import type { ApiResponse } from './types';

export async function apiRequest<T>(
  url: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  accessToken?: string,
  body?: string[],
): Promise<ApiResponse<T>> {
  const headers = new Headers();

  if (accessToken) {
    headers.append('Authorization', `Bearer ${accessToken}`);
  }

  if (body) {
    headers.append('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    method,
    headers,
    cache: 'no-cache',
    redirect: 'follow' as RequestRedirect,
    body: body ? JSON.stringify(body) : undefined, // request body
  });

  // consume response body once, as the response stream can only be read once
  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${responseText}`);
  }

  let parsed: T | null = null;
  if (responseText) {
    try {
      parsed = JSON.parse(responseText) as T; // if server returned valid JSON
    } catch {
      parsed = responseText as unknown as T; // fallback: treat it as plain text
    }
  }

  return {
    status: response.status,
    ok: response.ok,
    data: parsed,
  };
}
