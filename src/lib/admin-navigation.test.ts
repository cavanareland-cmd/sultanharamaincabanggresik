import { describe, it as test } from "node:test";
import { strict as assert } from "node:assert";
import { canShowAdminNavigation } from "./admin-navigation";

describe("Label Koper admin navigation", () => {
  test("shows the menu for a verified admin", () => {
    assert.equal(canShowAdminNavigation("user-1", { role: "admin" }, false), true);
  });
  test("hides the menu from non-admin users", () => {
    assert.equal(canShowAdminNavigation("user-1", { role: "user" }, false), false);
    assert.equal(canShowAdminNavigation("user-1", null, false), false);
  });
  test("hides the menu without an authenticated identity", () => {
    assert.equal(canShowAdminNavigation(null, { role: "admin" }, false), false);
  });
  test("fails closed when verification fails", () => {
    assert.equal(canShowAdminNavigation("user-1", { role: "admin" }, true), false);
  });
});