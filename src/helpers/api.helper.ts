import { APIRequestContext, APIResponse } from '@playwright/test';
import { Logger } from './logger.helper';

export class ApiHelper {
  private readonly logger = new Logger('ApiHelper');
  private token: string | null = null;

  constructor(private readonly request: APIRequestContext) {}

  // ─── Auth ─────────────────────────────────────────────────────────────────
  async login(username: string, password: string): Promise<string> {
    this.logger.info(`API login as: ${username}`);
    const response = await this.request.post('/web/index.php/api/v2/auth/login', {
      data: { username, password },
    });
    await this.assertStatus(response, 200, 'API login');
    const body = await response.json();
    this.token = body.data.token;
    return this.token!;
  }

  async loginWithEnvCredentials(): Promise<string> {
    return this.login(
      process.env.TEST_USERNAME ?? '',
      process.env.TEST_PASSWORD ?? ''
    );
  }

  // ─── HTTP Methods ─────────────────────────────────────────────────────────
  async get(endpoint: string, params?: Record<string, string>): Promise<APIResponse> {
    this.logger.info(`GET ${endpoint}`);
    return this.request.get(endpoint, {
      headers: this.authHeaders(),
      params,
    });
  }

  async post(endpoint: string, body: unknown): Promise<APIResponse> {
    this.logger.info(`POST ${endpoint}`);
    return this.request.post(endpoint, {
      headers: this.authHeaders(),
      data: body,
    });
  }

  async put(endpoint: string, body: unknown): Promise<APIResponse> {
    this.logger.info(`PUT ${endpoint}`);
    return this.request.put(endpoint, {
      headers: this.authHeaders(),
      data: body,
    });
  }

  async patch(endpoint: string, body: unknown): Promise<APIResponse> {
    this.logger.info(`PATCH ${endpoint}`);
    return this.request.patch(endpoint, {
      headers: this.authHeaders(),
      data: body,
    });
  }

  async delete(endpoint: string): Promise<APIResponse> {
    this.logger.info(`DELETE ${endpoint}`);
    return this.request.delete(endpoint, {
      headers: this.authHeaders(),
    });
  }

  // ─── Assertions ───────────────────────────────────────────────────────────
  async assertStatus(response: APIResponse, expectedStatus: number, context = ''): Promise<void> {
    if (response.status() !== expectedStatus) {
      const body = await response.text();
      throw new Error(
        `${context} — expected status ${expectedStatus}, got ${response.status()}.\nBody: ${body}`
      );
    }
  }

  async assertJsonBody<T>(response: APIResponse): Promise<T> {
    const body = await response.json() as T;
    return body;
  }

  // ─── Private ──────────────────────────────────────────────────────────────
  private authHeaders(): Record<string, string> {
    return this.token
      ? { Authorization: `Bearer ${this.token}` }
      : {};
  }
}
