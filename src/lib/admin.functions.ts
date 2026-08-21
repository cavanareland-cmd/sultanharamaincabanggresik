import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/**
 * Verify whether the signed-in user is an admin.
 *
 * This reads the `user_roles` table through the authenticated client, so it is
 * governed by RLS (the "Users can read own roles" policy) and needs ONLY the
 * publishable key + the user session — no service-role key. That makes it safe
 * to call from any deployment, including self-hosted Vercel where the
 * service-role key is not available.
 */
export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (error) {
      console.error("[checkIsAdmin] query failed:", error);
      throw new Error("Tidak dapat memverifikasi akses admin.");
    }
    return { isAdmin: Boolean(data) };
  });

/**
 * One-time bootstrap that promotes the first signed-in user to admin.
 *
 * This calls the `claim_first_admin` SQL function, which is restricted to the
 * service role, so it requires `SUPABASE_SERVICE_ROLE_KEY`. That key is present
 * in the Lovable Cloud runtime but is NOT exposed for self-hosted deployments
 * (e.g. Vercel). Claim admin once from the Lovable preview; the resulting row
 * persists in the shared Lovable Cloud database, after which `checkIsAdmin`
 * recognizes the user as admin everywhere.
 */
export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin.rpc("claim_first_admin", {
      _user_id: context.userId,
    });
    if (error) {
      console.error("[claimFirstAdmin] rpc failed:", error);
      throw new Error("Tidak dapat memverifikasi akses admin.");
    }
    return { isAdmin: Boolean(data) };
  });
