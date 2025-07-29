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

export async function loginMagicLink(prevState,formData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email"),
  };

  const { error } = await supabase.auth.signInWithOtp({
    email: data.email,
    emailRedirectTo: `${process.env.SITE_URL}/onboard`,
  });

  if (error) {
    return {error:'Error try again'}
  }

  revalidatePath("/", "layout");
  redirect("/login/confirm");
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
  const { data, error } = await supabase.auth.signOut();
  if (error) {
    console.error(error);
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function signInWithProvider(provider = "null") {
  const supabase = await createClient();

  const auth_callback_url =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/auth/callback"
      : `${process.env.SITE_URL}/auth/callback`;

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

  redirect(data.url);
}

export const signInWithGoogle = async () => {
  await signInWithProvider("google");
};

export async function setUsernameInitial(formData) {
  let firstName = formData.get("firstName");
  let lastName = formData.get("lastName");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    let { data, error } = await supabase.auth.updateUser({
      data: { name: `${firstName} ${lastName}` },
    });
  }
  console.log("after name change");
  revalidatePath("/", "layout");
  redirect("/task");
}

export async function changeName(prevState, formData) {
  let name = formData.get("name");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    let { data, error } = await supabase.auth.updateUser({
      data: { name: name },
    });
    if (data) {
      return { success: "Successfully changed Name!" };
    } else if (error) {
      return { error: "Error changing Name try again." };
    }
  }
  console.log("after name change");
  revalidatePath("/", "layout");
}


