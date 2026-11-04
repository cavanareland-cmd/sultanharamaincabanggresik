export function canShowAdminNavigation(
  userId: string | null,
  role: { role: string } | null,
  failed: boolean,
): boolean {
  return Boolean(userId && !failed && role?.role === "admin");
}