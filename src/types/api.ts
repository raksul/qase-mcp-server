export interface QaseProject {
  id: number;
  title: string;
  code: string;
  counts?: {
    cases: number;
    suites: number;
    runs: number;
    defects: number;
  };
}

export interface QaseTestCase {
  id: number;
  title: string;
  description?: string;
  preconditions?: string;
  postconditions?: string;
  priority?: number;
  severity?: number;
  behavior?: string;
  type?: string;
  layer?: string;
  status?: string;
}

export interface QaseTestRun {
  id: number;
  title: string;
  description?: string;
  status: string;
  start_time?: string;
  end_time?: string;
  stats?: {
    total: number;
    passed: number;
    failed: number;
    blocked: number;
    skipped: number;
  };
}

export interface QaseResponse<T> {
  status: boolean;
  result: T;
}

export interface QaseSuite {
  id: number;
  title: string;
  description?: string;
  preconditions?: string;
  parent_id?: number;
}

export interface QaseError {
  status: boolean;
  errorMessage: string;
}

export interface QaseTestCaseCreate {
  title: string;
  description?: string;
  preconditions?: string;
  postconditions?: string;
  priority?: number;
  severity?: number;
  behavior?: string;
  type?: string;
  layer?: string;
  status?: string;
  suite_id?: number;
  attachments?: string[];
  steps_type: 'gherkin';
  steps?: Array<{
    action: string;
    expected_result?: string;
    data?: string;
    attachments?: string[];
  }>;
}

export interface QaseBulkOperation {
  cases: QaseTestCaseCreate[];
}

export interface QaseTestCaseUpdate {
  title?: string;
  description?: string;
  preconditions?: string;
  postconditions?: string;
  severity?: number;
  priority?: number;
  behavior?: number;
  type?: number;
  layer?: number;
  is_flaky?: number;
  suite_id?: number;
  milestone_id?: number;
  automation?: number;
  status?: number;
  attachments?: string[];
  steps?: Array<{
    action: string;
    expected_result?: string;
    data?: string;
    attachments?: string[];
  }>;
  tags?: string[];
  params?: {
    [key: string]: string[];
  };
  custom_field?: {
    [key: string]: string;
  };
}
