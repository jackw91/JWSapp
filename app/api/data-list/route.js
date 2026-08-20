import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/data-list?prefix=session:&values=1
//
// Lists every key (for this user) starting with `prefix`. Pass values=1 to
// get the full { key, value } rows back in one round trip instead of just
// the keys — the app uses this to load every logged session in a single
// request rather than one fetch per week/day.

export async function GET(request) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const prefix = searchParams.get("prefix") || "";
  const includeValues = searchParams.get("values") === "1";

  const columns = includeValues ? "key, value" : "key";
  const { data, error } = await supabase
    .from("user_data")
    .select(columns)
    .eq("user_id", user.id)
    .like("key", `${prefix}%`);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (includeValues) {
    return NextResponse.json({ items: data });
  }
  return NextResponse.json({ keys: data.map((row) => row.key) });
}
