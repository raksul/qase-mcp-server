# Qase MCP Server

Qaseのテスト管理プラットフォームと連携するためのModel Context Protocol (MCP) サーバーです。
テストケースの作成、取得、テスト実行の管理などの機能を提供します。

## セットアップ

### 前提条件

- Node.js v22.17.0
- Qase APIトークン
- TypeScript

### インストール

```bash
# パッケージのインストール
npm install

# ビルド
npm run build
```

### 環境設定

MCPの設定ファイル（`cline_mcp_settings.json`）に以下の設定を追加します：

```json
{
  "mcpServers": {
    "qase": {
      "command": "node",
      "args": ["path/to/qase-mcp-server/build/index.js"],
      "env": {
        "QASE_API_TOKEN": "your-api-token"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

## 利用可能なツール

### get_projects

プロジェクト一覧を取得します。

**入力パラメータ**: なし

**使用例**:
```json
{
  "name": "get_projects"
}
```

### get_test_cases

指定したプロジェクトのテストケース一覧を取得します。

**入力パラメータ**:
- `project_code`: プロジェクトコード（必須）
- `suite_id`: スイートID（オプション）- 指定したスイートに属するテストケースのみを取得

**使用例**:
```json
{
  "name": "get_test_cases",
  "arguments": {
    "project_code": "DEMO",
    "suite_id": 123
  }
}
```

### create_test_case

テストケースを作成します。

**入力パラメータ**:
- `project_code`: プロジェクトコード（必須）
- `title`: テストケースのタイトル（必須）
- `description`: テストケースの説明（オプション）
- `preconditions`: 前提条件（オプション）
- `postconditions`: 事後条件（オプション）
- `suite_id`: 所属するスイートのID（オプション）
- `steps`: テストステップ（オプション）

**使用例**:
```json
{
  "name": "create_test_case",
  "arguments": {
    "project_code": "DEMO",
    "title": "ログイン機能のテスト",
    "description": "ユーザーログイン機能の動作確認",
    "preconditions": "テストユーザーアカウントが作成済みであること",
    "steps": [
      {
        "action": "ログインページにアクセス",
        "expected_result": "ログインフォームが表示される"
      }
    ]
  }
}
```

### create_suite

テストスイートを作成します。

**入力パラメータ**:
- `project_code`: プロジェクトコード（必須）
- `title`: テストスイートのタイトル（必須）
- `description`: テストスイートの説明（オプション）
- `preconditions`: テストスイートの前提条件（オプション）
- `parent_id`: 親スイートのID（オプション）

**使用例**:
```json
{
  "name": "create_suite",
  "arguments": {
    "project_code": "DEMO",
    "title": "認証機能テストスイート",
    "description": "認証に関連する全てのテストケース",
    "preconditions": "テスト用のデータベースが初期化されていること"
  }
}
```

### create_test_run

テスト実行を作成します。

**入力パラメータ**:
- `project_code`: プロジェクトコード（必須）
- `title`: テスト実行のタイトル（必須）
- `description`: テスト実行の説明（オプション）
- `cases`: テスト実行に含めるテストケースのID一覧（オプション）

**使用例**:
```json
{
  "name": "create_test_run",
  "arguments": {
    "project_code": "DEMO",
    "title": "リグレッションテスト実行",
    "description": "v1.2.0リリース前の確認テスト",
    "cases": [1, 2, 3]
  }
}
```

### create_test_cases_in_bulk

複数のテストケースを一括で作成します。

**入力パラメータ**:
- `project_code`: プロジェクトコード（必須）
- `cases`: 作成するテストケースの配列（必須）
  - `title`: テストケースのタイトル（必須）
  - `description`: テストケースの説明（オプション）
  - `steps`: テストケースの手順（オプション）
    - `action`: 手順のアクション（必須）
  - `suite_id`: 所属するスイートのID（オプション）

**使用例**:
```json
{
  "name": "create_test_cases_in_bulk",
  "arguments": {
    "project_code": "DEMO",
    "cases": [
      {
        "title": "ログイン成功パターン",
        "description": "正しい認証情報での確認",
        "steps": [
          {
            "action": "ログインページにアクセス"
          },
          {
            "action": "正しいユーザー名とパスワードを入力"
          }
        ],
        "suite_id": 123
      },
      {
        "title": "ログイン失敗パターン",
        "description": "不正な認証情報での確認",
        "suite_id": 123
      }
    ]
  }
}
```

### update_test_case

既存のテストケースを更新します。

**入力パラメータ**:
- `project_code`: プロジェクトコード（必須）
- `case_id`: テストケースのID（必須）
- `title`: テストケースの新しいタイトル（オプション）
- `description`: テストケースの新しい説明（オプション）
- `preconditions`: 前提条件（オプション）
- `postconditions`: 事後条件（オプション）
- `severity`: 重要度 (0-6)（オプション）
- `priority`: 優先度 (0-3)（オプション）
- `type`: テストタイプ（オプション）
- `layer`: テストレイヤー（オプション）
- `is_flaky`: 不安定なテストかどうか (0 or 1)（オプション）
- `suite_id`: 所属するスイートのID（オプション）
- `steps`: テストステップ（オプション）
  - `action`: 実行するアクション（必須）
  - `expected_result`: 期待される結果（オプション）
  - `data`: テストデータ（オプション）

**使用例**:
```json
{
  "name": "update_test_case",
  "arguments": {
    "project_code": "DEMO",
    "case_id": 456,
    "title": "更新されたログイン機能のテスト",
    "description": "ユーザーログイン機能の詳細な動作確認",
    "severity": 2,
    "priority": 1,
    "steps": [
      {
        "action": "ログインページにアクセスする",
        "expected_result": "ログインフォームが表示される"
      },
      {
        "action": "有効な認証情報を入力してログインボタンをクリック",
        "expected_result": "ダッシュボードページにリダイレクトされる"
      }
    ]
  }
}
```

## エラーハンドリング

各ツールは以下のようなエラーを返す可能性があります：

- 認証エラー: APIトークンが無効または未設定
- パラメータエラー: 必須パラメータの不足や不正な値
- APIエラー: Qase APIからのエラーレスポンス

エラーメッセージには具体的な問題と対処方法が含まれます。

## 開発

```bash
# 開発モードで実行（ファイル変更の監視）
npm run dev

# テストの実行
npm test
```

## ライセンス

ISC
