import { supabase } from "../../../lib/supabase";

export const POST = async ({ request, redirect }) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  // Validation
  if (!name) {
    return new Response("Name is required", { status: 400 });
  }
  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  // Sign up user
  const { data: auth_data, error: auth_error } = await supabase.auth.signUp({
    password,
  });

  // Insert user profile
  const { data: profile_data, error: profile_error } = await supabase
    .from("profiles")
    .insert({ user_id: auth_data.user.id, name, email });

  if (profile_error) {
    console.log(profile_error);
    return new Response(profile_error.message || "Profile insert failed", { status: 500 });
  }

  return redirect("/signin");
};
