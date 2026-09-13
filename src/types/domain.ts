export type TaskPriority = "normal" | "important";

export type Member = {
  id: string;
  displayName: string;
  role: "owner" | "coordinator" | "member";
};

export type CareTask = {
  id: string;
  circleId: string;
  title: string;
  description: string | null;
  assignedTo: string | null;
  assigneeName: string;
  priority: TaskPriority;
  dueAt: string | null;
  completedAt: string | null;
};

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | {
      ok: false;
      code: string;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
