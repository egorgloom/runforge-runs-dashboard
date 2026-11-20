export type RunStatus = "queued" | "running" | "succeeded" | "failed";

export type Run = {
  id: string;
  name: string;
  repository: string;
  branch: string;
  status: RunStatus;
  createdAt: string;
  durationSeconds?: number;
  logs: string[];
  result?: string;
};

export type StatusFilter = RunStatus | "all";

export type SortOption =
  | "date-desc"
  | "date-asc"
  | "duration-desc"
  | "duration-asc";
