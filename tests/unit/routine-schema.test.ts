import { describe, expect, it } from "vitest";
import { routineSchema, routineToggleSchema } from "@/features/routines/schemas";

describe("routineSchema", () => {
  it("validates a complete routine input", () => {
    const valid = {
      circleId: "circle_12345",
      title: "Amlodipine 5mg",
      category: "MEDICATION" as const,
      timeOfDay: "MORNING" as const,
      customTime: "08:00 WIB",
      note: "Minum sesudah makan",
    };

    const result = routineSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects blank routine title", () => {
    const invalid = {
      circleId: "circle_12345",
      title: "   ",
    };

    const result = routineSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("validates toggle routine schema with valid date string", () => {
    const validToggle = {
      routineId: "routine_123",
      circleId: "circle_123",
      completed: true,
      dateStr: "2026-10-27",
    };

    expect(routineToggleSchema.safeParse(validToggle).success).toBe(true);
  });

  it("rejects invalid date format in toggle", () => {
    const invalidToggle = {
      routineId: "routine_123",
      circleId: "circle_123",
      completed: true,
      dateStr: "27-10-2026",
    };

    expect(routineToggleSchema.safeParse(invalidToggle).success).toBe(false);
  });
});
