import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "./App";
import * as api from "./api/mockRunsApi";
import type { Run } from "./model/types";

vi.mock("./api/mockRunsApi", () => ({
  fetchRuns: vi.fn(),
}));

const mockRuns: Run[] = [
  {
    id: "1",
    name: "Run Alpha",
    repository: "repo-1",
    branch: "main",
    status: "running",
    createdAt: "2026-11-20T10:00:00Z",
    logs: ["log 1"],
  },
  {
    id: "2",
    name: "Run Beta",
    repository: "repo-2",
    branch: "dev",
    status: "succeeded",
    createdAt: "2026-11-20T11:00:00Z",
    durationSeconds: 120,
    logs: ["log 2"],
    result: "Success!",
  },
  {
    id: "3",
    name: "Run Gamma",
    repository: "repo-1",
    branch: "fix",
    status: "failed",
    createdAt: "2026-11-20T12:00:00Z",
    logs: ["log 3"],
    result: "Timeout waiting for response",
  },
];

describe("App Integration Tests", () => {
  beforeEach(() => {
    window.history.replaceState({}, "", "/");
    vi.mocked(api.fetchRuns).mockResolvedValue(mockRuns);
  });

  it("1. should filter runs by status", async () => {
    render(<App />);

    await waitFor(() =>
      expect(screen.getByText("Run Alpha")).toBeInTheDocument(),
    );

    expect(screen.getByText("Run Beta")).toBeInTheDocument();
    expect(screen.getByText("Run Gamma")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Running/i }));

    expect(screen.getByText("Run Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Run Beta")).not.toBeInTheDocument();
    expect(screen.queryByText("Run Gamma")).not.toBeInTheDocument();
  });

  it("2. should search runs by name and repository", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText("Run Alpha")).toBeInTheDocument(),
    );

    const searchInput = screen.getByLabelText(/Launch search/i);

    fireEvent.change(searchInput, { target: { value: "Beta" } });
    expect(screen.getByText("Run Beta")).toBeInTheDocument();
    expect(screen.queryByText("Run Alpha")).not.toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "repo-1" } });
    expect(screen.getByText("Run Alpha")).toBeInTheDocument();
    expect(screen.getByText("Run Gamma")).toBeInTheDocument();
    expect(screen.queryByText("Run Beta")).not.toBeInTheDocument();
  });

  it("3. should open details drawer for a succeeded run", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText("Run Beta")).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Open launch details Run Beta/i }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Success!")).toBeInTheDocument();
    expect(screen.getByText("log 2")).toBeInTheDocument();
    expect(screen.getByText(/Back to list/i)).toBeInTheDocument();
  });

  it("4. should reset filters from empty state", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText("Run Alpha")).toBeInTheDocument(),
    );

    const searchInput = screen.getByLabelText(/Launch search/i);

    fireEvent.change(searchInput, {
      target: { value: "Non-existent launch" },
    });

    expect(screen.getByText("Nothing found.")).toBeInTheDocument();
    expect(screen.queryByText("Run Alpha")).not.toBeInTheDocument();

    const resetButton = screen.getByRole("button", {
      name: /Reset the filters/i,
    });
    fireEvent.click(resetButton);

    expect(searchInput).toHaveValue("");
    expect(screen.getByText("Run Alpha")).toBeInTheDocument();
    expect(screen.getByText("Run Beta")).toBeInTheDocument();
    expect(screen.getByText("Run Gamma")).toBeInTheDocument();
  });

  it("5. should ignore invalid status query parameter in URL", async () => {
    window.history.replaceState({}, "", "/?status=abc");

    render(<App />);
    await waitFor(() =>
      expect(screen.getByText("Run Alpha")).toBeInTheDocument(),
    );

    const allButton = screen.getByRole("button", { name: /All/i });
    expect(allButton).toHaveAttribute("aria-pressed", "true");

    expect(screen.getByText("Run Beta")).toBeInTheDocument();
    expect(screen.getByText("Run Gamma")).toBeInTheDocument();
  });

  it("6. should display error styling in details drawer for a failed run", async () => {
    render(<App />);
    await waitFor(() =>
      expect(screen.getByText("Run Beta")).toBeInTheDocument(),
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Open launch details Run Gamma/i }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    const resultBox = screen.getByText(/Timeout waiting/i);
    expect(resultBox).toHaveClass(/resultError/i);
  });

  it("7. should restore valid filters from URL on initial load", async () => {
    window.history.replaceState({}, "", "/?status=failed&q=Gamma");

    render(<App />);
    await waitFor(() =>
      expect(screen.getByText("Run Gamma")).toBeInTheDocument(),
    );

    const failedButton = screen.getByRole("button", { name: /Failed/i });
    expect(failedButton).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByLabelText(/Launch search/i)).toHaveValue("Gamma");

    expect(screen.queryByText("Run Alpha")).not.toBeInTheDocument();
    expect(screen.queryByText("Run Beta")).not.toBeInTheDocument();
  });
});
