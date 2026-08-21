import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

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
