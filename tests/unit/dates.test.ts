import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { formatDate, isOverdue } from "@/lib/dates";

describe("date helpers", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-13T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("uses a clear label when a task has no due date", () => {
    expect(formatDate(null)).toBe("Tanpa tenggat");
  });

  it("formats a due date using the Indonesian locale", () => {
    expect(formatDate("2026-09-14T12:00:00.000Z")).toBe("14 Sep 2026");
  });

  it("marks an incomplete task before the current instant as overdue", () => {
    expect(isOverdue("2026-09-13T11:59:59.999Z", null)).toBe(true);
  });

  it("does not mark the exact due instant or a future task as overdue", () => {
    expect(isOverdue("2026-09-13T12:00:00.000Z", null)).toBe(false);
    expect(isOverdue("2026-09-13T12:00:00.001Z", null)).toBe(false);
  });

  it("does not mark completed or undated tasks as overdue", () => {
    expect(
      isOverdue(
        "2026-09-13T11:59:59.999Z",
        "2026-09-13T11:30:00.000Z",
      ),
    ).toBe(false);
    expect(isOverdue(null, null)).toBe(false);
  });

  it("treats an empty due date as undated", () => {
    expect(isOverdue("", null)).toBe(false);
  });
});
