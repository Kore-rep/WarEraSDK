import axios, { AxiosRequestConfig } from 'axios';
import { EndpointMap, EndpointName, QueuedCall } from './types';

/**
 * API Error class
 */
export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

/**
 * Internal request context that manages batch mode
 */
class RequestContext {
  private batchMode: boolean = false;
  private queue: QueuedCall<unknown>[] = [];
  private baseUrl: string = '';

  setBatchMode(enabled: boolean): void {
    this.batchMode = enabled;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  isBatchMode(): boolean {
    return this.batchMode;
  }

  queueCall<T>(name: string, params: Record<string, unknown>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ name, params, resolve: resolve as (value: unknown) => void, reject });
    });
  }

  async executeBatch(): Promise<unknown[]> {
    if (this.queue.length === 0) {
      return [];
    }

    try {
      // Build the comma-separated function names
      const functionNames = this.queue.map(call => call.name).join(',');
      
      // Build the input object with numeric keys
      const inputObj: Record<string, Record<string, unknown>> = {};
      this.queue.forEach((call, index) => {
        inputObj[index] = call.params;
      });

      // Construct the batch URL
      const url = `${this.baseUrl}/${functionNames}`;
      const response = await axios.get<unknown[]>(url, {
        params: {
          input: JSON.stringify(inputObj),
          batch: 1
        }
      } as AxiosRequestConfig);

      // Response should be an array matching the order of requests
      const results = Array.isArray(response.data) ? response.data : [response.data];
      
      // Resolve each queued promise with its corresponding result
      this.queue.forEach((call, index) => {
        call.resolve(results[index]);
      });

      // Clear the queue
      this.queue = [];

      return results;
    } catch (error) {
      const apiError = error as { message: string; response?: { status: number; data: unknown } };
      
      // Reject all queued promises with the error
      const errorObj = new ApiError(
        apiError.message,
        apiError.response?.status,
        apiError.response?.data
      );
      
      this.queue.forEach(call => {
        call.reject(errorObj);
      });

      // Clear the queue
      this.queue = [];

      throw errorObj;
    }
  }

  clearQueue(): void {
    this.queue = [];
  }
}

// Singleton instance
export const requestContext = new RequestContext();

/**
 * Make a request - either queues it for batch or executes immediately
 */
export async function request<K extends EndpointName>(
  endpointName: K,
  params: EndpointMap[K]['params'],
  baseUrl: string
): Promise<EndpointMap[K]['response']> {
  if (requestContext.isBatchMode()) {
    // Queue the call and return a promise
    return requestContext.queueCall<EndpointMap[K]['response']>(endpointName, params as Record<string, unknown>);
  } else {
    // Execute immediately
    try {
      const url = `${baseUrl}/${endpointName}`;
      const response = await axios.get<EndpointMap[K]['response']>(url, {
        params: {
          input: JSON.stringify(params)
        }
      } as AxiosRequestConfig);
      return response.data;
    } catch (error) {
      const apiError = error as { message: string; response?: { status: number; data: unknown } };
      throw new ApiError(
        apiError.message,
        apiError.response?.status,
        apiError.response?.data
      );
    }
  }
}