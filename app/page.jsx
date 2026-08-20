import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CalgaryBarbellApp from "@/components/CalgaryBarbellApp";

// Server Component — checks auth server-side before rendering anything
// (the middleware already redirects unauthenticated requests to /login,
// this is a second, cheap belt-and-braces check).
export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return <CalgaryBarbellApp userEmail={user.email} />;
}
