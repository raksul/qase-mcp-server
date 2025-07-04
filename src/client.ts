import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type { QaseProject, QaseTestCase, QaseTestRun, QaseResponse, QaseError, QaseBulkOperation, QaseTestCaseCreate, QaseTestCaseUpdate } from './types/api.js';

export class QaseClient {
  private readonly client: AxiosInstance;

  constructor() {
    const token = process.env.QASE_API_TOKEN;
    if (!token) {
      throw new Error('QASE_API_TOKEN environment variable is required');
    }

    this.client = axios.create({
      baseURL: 'https://api.qase.io/v1',
      headers: {
        'Token': token,
        'Content-Type': 'application/json',
      },
    });
  }

  async getProjects(): Promise<QaseResponse<QaseProject[]>> {
    try {
      const response = await this.client.get('/project');
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getTestCases(projectCode: string, options?: { suite_id?: number }): Promise<QaseResponse<QaseTestCase[]>> {
    try {
      const params = options ? { ...options } : {};
      const response = await this.client.get(`/case/${projectCode}`, { params });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * steps_type: 'gherkin' をデフォルトで付与するユーティリティ
   */
  private withDefaultStepsType<T extends { steps_type?: string }>(obj: T): T {
    return {
      ...obj,
      steps_type: obj.steps_type ?? 'gherkin',
    };
  }

  async createTestCase(projectCode: string, testCase: QaseTestCaseCreate): Promise<QaseResponse<{ id: number }>> {
    try {
      const normalizedTestCase = this.withDefaultStepsType(testCase);
      const response = await this.client.post(`/case/${projectCode}`, normalizedTestCase);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async getTestRuns(projectCode: string): Promise<QaseResponse<QaseTestRun[]>> {
    try {
      const response = await this.client.get(`/run/${projectCode}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createSuite(projectCode: string, suite: { title: string; description?: string; preconditions?: string; parent_id?: number }): Promise<QaseResponse<{ id: number }>> {
    try {
      const response = await this.client.post(`/suite/${projectCode}`, suite);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createTestRun(projectCode: string, run: { title: string; description?: string; cases?: number[] }): Promise<QaseResponse<{ id: number }>> {
    try {
      const response = await this.client.post(`/run/${projectCode}`, run);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async createTestCasesInBulk(projectCode: string, cases: QaseTestCaseCreate[]): Promise<QaseResponse<{ ids: number[] }>> {
    try {
      const normalizedCases = cases.map((c) => this.withDefaultStepsType(c));
      const payload: QaseBulkOperation = { cases: normalizedCases };
      const response = await this.client.post(`/case/${projectCode}/bulk`, payload);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateTestCase(projectCode: string, caseId: number, testCase: QaseTestCaseUpdate): Promise<QaseResponse<{ id: number }>> {
    try {
      const normalizedTestCase = this.withDefaultStepsType(testCase);
      const response = await this.client.patch(`/case/${projectCode}/${caseId}`, normalizedTestCase);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const errorResponse: QaseError = {
        status: false,
        errorMessage: error.response?.data?.message || error.message,
      };
      throw new Error(JSON.stringify(errorResponse));
    }
    throw error;
  }
}
