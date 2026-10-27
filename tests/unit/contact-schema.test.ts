import { describe, expect, it } from "vitest";
import { contactSchema } from "@/features/contacts/schemas";

describe("contactSchema", () => {
  it("validates valid contact inputs", () => {
    const valid = {
      circleId: "circle_12345",
      name: "dr. Hendra Sp.A",
      role: "Dokter Spesialis",
      phoneNumber: "08123456789",
      whatsapp: "08123456789",
      address: "RS Harapan Bunda",
      note: "Praktek setiap Selasa dan Kamis",
    };

    const result = contactSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("rejects names shorter than 2 characters", () => {
    const invalid = {
      circleId: "circle_12345",
      name: "A",
      role: "Dokter",
      phoneNumber: "08123456789",
    };

    const result = contactSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.name).toBeDefined();
  });

  it("rejects invalid phone numbers", () => {
    const invalid = {
      circleId: "circle_12345",
      name: "dr. Hendra",
      role: "Dokter",
      phoneNumber: "123",
    };

    const result = contactSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    expect(result.error?.flatten().fieldErrors.phoneNumber).toBeDefined();
  });
});
