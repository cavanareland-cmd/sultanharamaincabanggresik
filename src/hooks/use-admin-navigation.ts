import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { canShowAdminNavigation } from "@/lib/admin-navigation";

export function useAdminNavigation() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let active = true;
    let revision = 0;
    const verify = async (request: number) => {
      try {
        const { data: identity, error: identityError } = await supabase.auth.getUser();
        if (!active || request !== revision) return;
        const userId = identity.user?.id ?? null;
        if (identityError || !userId) { setIsAdmin(false); return; }
        const { data: role, error } = await supabase.from("user_roles")
          .select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
        if (active && request === revision) {
          setIsAdmin(canShowAdminNavigation(userId, role, Boolean(error)));
        }
      } catch {
        if (active && request === revision) setIsAdmin(false);
      }
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      const request = ++revision;
      setIsAdmin(false);
      // Leave the auth callback before making another auth request.
      if (event !== "SIGNED_OUT") void Promise.resolve().then(() => verify(request));
    });
    void verify(++revision);
    return () => { active = false; revision++; subscription.unsubscribe(); };
  }, []);

  return isAdmin;
}