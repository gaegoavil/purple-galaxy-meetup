// Edge Function: admin-review
// Temporary admin review endpoint protected by ADMIN_REVIEW_PASSWORD.
// TODO: Replace with proper Supabase Auth + admin roles (user_roles table with RLS).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-admin-password",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Authenticate with admin password
  const adminPassword = Deno.env.get("ADMIN_REVIEW_PASSWORD");
  const provided = req.headers.get("x-admin-password");
  if (!adminPassword || provided !== adminPassword) {
    return json({ error: "Unauthorized" }, 401);
  }

  // Service-role client bypasses RLS
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const url = new URL(req.url);
  const action = url.searchParams.get("action");

  // GET ?action=list&status=pending
  if (req.method === "GET" && action === "list") {
    const status = url.searchParams.get("status");
    let query = supabase.from("members").select("*").order("created_at", { ascending: false });
    if (status) {
      query = query.eq("status", status);
    }
    const { data, error } = await query;
    if (error) return json({ error: error.message }, 500);
    return json(data);
  }

  // POST ?action=update-status  body: { id, status }
  if (req.method === "POST" && action === "update-status") {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) return json({ error: "id and status required" }, 400);
    const validStatuses = ["pending", "under_review", "approved", "rejected"];
    if (!validStatuses.includes(status)) return json({ error: "Invalid status" }, 400);

    const { data, error } = await supabase
      .from("members")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) return json({ error: error.message }, 500);
    return json(data);
  }

  return json({ error: "Unknown action" }, 400);
});
