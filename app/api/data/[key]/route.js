import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET  /api/data/[key]  -> { key, value } | 404
// PUT  /api/data/[key]  -> body: { value }  -> { key, value }
// DELETE /api/data/[key] -> { deleted: true }
//
// Every request is scoped to the logged-in user via their session cookie —
// there is no way to pass a user id in and read someone else's data, both
// because we always filter by auth.uid() here AND because Row Level
// Security on the table enforces the same thing at the database level.

export async function GET(request, { params }) {
  const { key } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { data, error } = await supabase
    .from("user_data")
    .select("key, value")
    .eq("user_id", user.id)
    .eq("key", key)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(data);
}

export async function PUT(request, { params }) {
  const { key } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json();
  const value = body?.value;

  const { data, error } = await supabase
    .from("user_data")
    .upsert(
      { user_id: user.id, key, value, updated_at: new Date().toISOString() },
      { onConflict: "user_id,key" }
    )
    .select("key, value")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function DELETE(request, { params }) {
  const { key } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { error } = await supabase.from("user_data").delete().eq("user_id", user.id).eq("key", key);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
