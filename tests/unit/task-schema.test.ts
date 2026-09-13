import { describe, expect, expectTypeOf, it } from "vitest";
import type { input, output } from "zod";

import { taskSchema } from "@/features/tasks/schemas";

const validTask = {
  assignedTo: "7ebf1028-dbd2-4d85-91eb-c4c58ad02e6e",
  circleId: "f75ad7d2-1a76-47c8-aafa-2511f41249e7",
  description: "  Hubungi pengemudi  ",
  dueAt: "2026-09-14T02:00:00.000Z",
  priority: "important" as const,
  title: "  Konfirmasi transportasi  ",
} satisfies input<typeof taskSchema>;

describe("taskSchema", () => {
  it("trims human-entered task text", () => {
    const result = taskSchema.parse(validTask);

    expect(result.title).toBe("Konfirmasi transportasi");
    expect(result.description).toBe("Hubungi pengemudi");
    expectTypeOf(result).toEqualTypeOf<output<typeof taskSchema>>();
  });

  it("rejects a title that is blank after trimming", () => {
    const result = taskSchema.safeParse({ ...validTask, title: "   " });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.title).toContain(
      "Judul tugas wajib diisi.",
    );
  });

  it("accepts Better Auth identifiers", () => {
    const result = taskSchema.safeParse({
      ...validTask,
      assignedTo: "XkN7V2mQpR9sT4wY6zA8bC1dE3fG5hJ0",
      circleId: "circle_7Hk2mN9qP4sT6vX8",
    });

    expect(result.success).toBe(true);
  });

  it("rejects unknown priorities and unsafe identifiers", () => {
    const result = taskSchema.safeParse({
      ...validTask,
      assignedTo: "id with spaces",
      circleId: "<script>",
      priority: "urgent",
    });

    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.assignedTo).toBeDefined();
    expect(result.error?.flatten().fieldErrors.circleId).toBeDefined();
    expect(result.error?.flatten().fieldErrors.priority).toBeDefined();
  });

  it("accepts omitted optional fields", () => {
    const requiredTask = {
      assignedTo: validTask.assignedTo,
      circleId: validTask.circleId,
      priority: validTask.priority,
      title: validTask.title,
    } satisfies input<typeof taskSchema>;

    expect(taskSchema.safeParse(requiredTask).success).toBe(true);
  });

  it("enforces the title length boundary", () => {
    expect(
      taskSchema.safeParse({ ...validTask, title: "a".repeat(120) }).success,
    ).toBe(true);
    expect(
      taskSchema.safeParse({ ...validTask, title: "a".repeat(121) }).success,
    ).toBe(false);
  });

  it("enforces the description length boundary after trimming", () => {
    expect(
      taskSchema.safeParse({
        ...validTask,
        description: `  ${"a".repeat(1000)}  `,
      }).success,
    ).toBe(true);
    expect(
      taskSchema.safeParse({
        ...validTask,
        description: "a".repeat(1001),
      }).success,
    ).toBe(false);
  });
});
