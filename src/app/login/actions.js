"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// import { createClient } from '@/utils/supabase/server'
import { createClient } from "../utils/supabase/server";

export async function login(formData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  supabase.auth.signOut();
  redirect("/login");
}

export async function signInWithProvider(provider = "null") {
  const supabase = await createClient();

  const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
    },
  });
  console.log(data);

  if (error) {
    console.log(error);
  }

  redirect(data.url)

}

export const signInWithGoogle = async ()=>{
  await signInWithProvider('google');
}
