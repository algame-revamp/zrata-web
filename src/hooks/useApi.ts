import { useState } from 'react';

interface ApiOptions {
  baseUrl?: string;
  headers?: Record<string, string>;
}

export function useApi(options: ApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = options.baseUrl || '/api';
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const get = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: defaultHeaders,
      });

      if (!response.ok) {
        throw new Error(`GET ${endpoint} failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'GET request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const post = async (endpoint: string, body: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`POST ${endpoint} failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'POST request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const put = async (endpoint: string, body: any) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: defaultHeaders,
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`PUT ${endpoint} failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'PUT request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const del = async (endpoint: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: defaultHeaders,
      });

      if (!response.ok) {
        throw new Error(`DELETE ${endpoint} failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'DELETE request failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
  };
}