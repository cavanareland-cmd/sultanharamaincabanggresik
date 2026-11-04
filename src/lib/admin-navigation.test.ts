import { describe, expect, test } from "bun:test";
import { canShowAdminNavigation } from "./admin-navigation";

describe("Label Koper admin navigation", () => {
  test("shows the menu for a verified admin", () => {
    expect(canShowAdminNavigation("user-1", { role: "admin" }, false)).toBe(true);
  });
  test("hides the menu from non-admin users", () => {
    expect(canShowAdminNavigation("user-1", { role: "user" }, false)).toBe(false);
    expect(canShowAdminNavigation("user-1", null, false)).toBe(false);
  });
  test("hides the menu without an authenticated identity", () => {
    expect(canShowAdminNavigation(null, { role: "admin" }, false)).toBe(false);
  });
  test("fails closed when verification fails", () => {
    expect(canShowAdminNavigation("user-1", { role: "admin" }, true)).toBe(false);
  });
});