import isJson from '../utils/isJson';
import { bnToHex } from '../utils/Parsers';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface HttpResponse {
  /* eslint-disable */
  json: () => any;
  /* eslint-disable */
  data: any;
  status: number;
  /* eslint-disable */
  error?: any;
}

/**
 * Wrapper for axios http calls
 */
export const axiosWrapper = {
  get,
  post,
  put,
  delete: _delete
};

async function get(url: string): Promise<HttpResponse> {
  const requestOptions: AxiosRequestConfig = {
    url,
    method: 'GET',
    timeout: 7000
  };
  return handleRequest(requestOptions);
}

async function post(url: string, body: any): Promise<HttpResponse> {
  const requestOptions: AxiosRequestConfig = {
    url,
    method: 'POST',
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(body)
  };
  return handleRequest(requestOptions);
}

async function put(url: string, body: any): Promise<HttpResponse> {
  const requestOptions: AxiosRequestConfig = {
    url,
    method: 'PUT',
    timeout: 7000,
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify(body)
  };
  return handleRequest(requestOptions);
}

async function _delete(url: string): Promise<HttpResponse> {
  const requestOptions: AxiosRequestConfig = {
    method: 'DELETE',
    timeout: 5000,
    url
  };
  return handleRequest(requestOptions);
}

async function handleRequest(requestOptions: AxiosRequestConfig) {
  try {
    const response = await axios.request(requestOptions);
    if (process.env.NODE_ENV != 'production') {
      console.log(
        `${requestOptions.method}(${requestOptions.url}) ${JSON.stringify(
          response.status
        )}`
      );
    }
    return handleResponse(response);
  } catch (err) {
    return {
      json: () => {
        return undefined;
      },
      data: (err as any).message ? (err as any).message : `Unknown Error!`,
      status: 500,
      error: true
    };
  }
}

async function handleResponse(response: AxiosResponse): Promise<HttpResponse> {
  const e = response.statusText;
  const s = response.status;
  const d = response.data;
  try {
    if (s != 200) {
      return {
        json: () => {
          return undefined;
        },
        data: e,
        status: s,
        error: true
      };
    }
    if (d.length == 0) {
      return {
        json: () => {
          return undefined;
        },
        data: e,
        status: s,
        error: true
      };
    }
    let data = !!d && !isJson(d) && JSON.parse(d);
    if (Array.isArray(data) && data.length > 0) {
      // Special handle for big number..
      if (data[0].type === 'BigNumber') {
        data = bnToHex(BigInt(data[0]));
      }
      if (data[0].type === 'bigint') {
        data = bnToHex(BigInt(data[0]));
      }
    }
    return {
      json: () => {
        return d;
      },
      data: d,
      status: s
    };
  } catch (err) {
    console.log(err);
    return {
      json: () => {
        return undefined;
      },
      data: (err as any).message ? (err as any).message : `Unknown Error: ${e}`,
      status: s,
      error: e
    };
  }
}
