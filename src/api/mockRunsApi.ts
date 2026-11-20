import type { Run } from "../model/types";

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

const MOCK_RUNS: Run[] = [
  {
    id: "run-001",
    name: "Auth refactor",
    repository: "web-platform",
    branch: "feature/auth-refactor",
    status: "running",
    createdAt: "2026-11-20T09:12:00Z",
    logs: [
      "[09:12:01] Starting agent",
      "[09:12:04] Installing dependencies...",
      "[09:12:40] Dependencies installed",
      "[09:13:02] Running tests...",
    ],
  },
  {
    id: "run-002",
    name: "Fix checkout tests",
    repository: "payments",
    branch: "fix/checkout-tests",
    status: "succeeded",
    createdAt: "2026-11-19T15:40:00Z",
    durationSeconds: 184,
    logs: [
      "[15:40:00] Starting agent",
      "[15:40:12] Running checkout test suite",
      "[15:42:50] All tests passed",
    ],
    result: "All 42 tests passed successfully.",
  },
  {
    id: "run-003",
    name: "Update dependencies",
    repository: "api-service",
    branch: "chore/update-deps",
    status: "queued",
    createdAt: "2026-11-20T10:01:00Z",
    logs: ["[10:01:00] Queued for runner"],
  },
  {
    id: "run-004",
    name: "Add billing webhook",
    repository: "payments",
    branch: "feat/billing-webhook",
    status: "failed",
    createdAt: "2026-11-18T11:20:00Z",
    durationSeconds: 92,
    logs: [
      "[11:20:00] Starting agent",
      "[11:20:30] Building project",
      "[11:21:32] Error in billing module",
    ],
    result: "TypeError: Cannot read properties of undefined (reading 'amount')",
  },
  {
    id: "run-005",
    name: "Migrate to Vite 6",
    repository: "web-platform",
    branch: "chore/vite-6",
    status: "succeeded",
    createdAt: "2026-11-17T08:00:00Z",
    durationSeconds: 310,
    logs: [
      "[08:00:00] Starting agent",
      "[08:00:45] Updating dependencies",
      "[08:05:10] Build succeeded",
    ],
    result: "Migration complete, bundle size reduced by 12%.",
  },
  {
    id: "run-006",
    name: "Lint API routes",
    repository: "api-service",
    branch: "chore/lint",
    status: "queued",
    createdAt: "2026-11-20T11:30:00Z",
    logs: ["[11:30:00] Queued for runner"],
  },
  {
    id: "run-007",
    name: "E2E smoke tests",
    repository: "web-platform",
    branch: "test/e2e-smoke",
    status: "failed",
    createdAt: "2026-11-16T14:10:00Z",
    durationSeconds: 45,
    logs: [
      "[14:10:00] Starting agent",
      "[14:10:20] Launching browser",
      "[14:10:45] Selector wait timeout",
    ],
    result: 'Timeout waiting for selector [data-testid="checkout-btn"]',
  },
];

export async function fetchRuns(): Promise<Run[]> {
  await delay(800);

  const shouldFail =
    new URLSearchParams(window.location.search).get("fail") === "1";
  if (shouldFail) {
    throw new Error("Failed to load runs list");
  }

  return MOCK_RUNS;
}
