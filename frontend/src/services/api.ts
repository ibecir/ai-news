import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  APIResponse,
  UserWithStats,
  LinkWithVerification,
  LinkDetail,
  LinkStats,
  PaginatedLinks,
  DashboardData,
  LoginRequest,
  LinkCreateRequest,
  LinkUpdateRequest,
  Link,
} from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

class ApiService {
  private client: AxiosInstance;
  private userEmail: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor to include user email header
    this.client.interceptors.request.use((config) => {
      if (this.userEmail) {
        config.headers['X-User-Email'] = this.userEmail;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<APIResponse<unknown>>) => {
        if (error.response?.status === 401) {
          // Clear user email and redirect to login
          this.userEmail = null;
          localStorage.removeItem('userEmail');
          window.location.href = '/';
        }
        throw error;
      }
    );

    // Restore email from localStorage
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      this.userEmail = storedEmail;
    }
  }

  setUserEmail(email: string | null) {
    this.userEmail = email;
    if (email) {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.removeItem('userEmail');
    }
  }

  getUserEmail(): string | null {
    return this.userEmail;
  }

  // Auth endpoints
  async login(data: LoginRequest): Promise<APIResponse<UserWithStats>> {
    const response = await this.client.post<APIResponse<UserWithStats>>('/auth/login', data);
    if (response.data.success && response.data.data) {
      this.setUserEmail(data.email);
    }
    return response.data;
  }

  async checkEmail(email: string): Promise<APIResponse<{ exists: boolean; email: string }>> {
    const response = await this.client.post<APIResponse<{ exists: boolean; email: string }>>(
      '/auth/check-email',
      { email }
    );
    return response.data;
  }

  logout() {
    this.setUserEmail(null);
  }

  // Link endpoints
  async getLinks(
    page: number = 1,
    pageSize: number = 10,
    status?: string
  ): Promise<APIResponse<PaginatedLinks>> {
    const params = new URLSearchParams({
      page: page.toString(),
      page_size: pageSize.toString(),
    });
    if (status) {
      params.append('status_filter', status);
    }
    const response = await this.client.get<APIResponse<PaginatedLinks>>(`/links?${params}`);
    return response.data;
  }

  async getLink(linkId: number): Promise<APIResponse<LinkDetail>> {
    const response = await this.client.get<APIResponse<LinkDetail>>(`/links/${linkId}`);
    return response.data;
  }

  async createLink(data: LinkCreateRequest): Promise<APIResponse<Link>> {
    const response = await this.client.post<APIResponse<Link>>('/links', data);
    return response.data;
  }

  async updateLink(linkId: number, data: LinkUpdateRequest): Promise<APIResponse<Link>> {
    const response = await this.client.patch<APIResponse<Link>>(`/links/${linkId}`, data);
    return response.data;
  }

  async deleteLink(linkId: number): Promise<APIResponse<null>> {
    const response = await this.client.delete<APIResponse<null>>(`/links/${linkId}`);
    return response.data;
  }

  async scrapeLink(linkId: number): Promise<APIResponse<Link>> {
    const response = await this.client.post<APIResponse<Link>>(`/links/${linkId}/scrape`);
    return response.data;
  }

  async getLinkStats(): Promise<APIResponse<LinkStats>> {
    const response = await this.client.get<APIResponse<LinkStats>>('/links/stats');
    return response.data;
  }

  // Dashboard endpoint
  async getDashboard(): Promise<APIResponse<DashboardData>> {
    const response = await this.client.get<APIResponse<DashboardData>>('/dashboard');
    return response.data;
  }
}

export const api = new ApiService();
export default api;
