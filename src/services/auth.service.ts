'use server'
import { createClient } from "@/utils/supabase";
import { redirect } from "next/navigation";

export const login = async (type: 'google' | 'facebook') => {
  const supabase = await createClient();

  const { data } = await supabase.auth.signInWithOAuth({
    provider: type,
    options: {
      redirectTo: getRedirectURL(),
    },
  })
  
  if (data.url) {
    redirect(data.url);
  }
}

export const signOut = async () => {
	const supabase = await createClient();

	const { error } = await supabase.auth.signOut({ scope: 'local' });
	
	return error;
}

const getRedirectURL = () => {
  let url =
    process?.env?.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000/'
  // Make sure to include `https://` when not localhost.
  url = url.startsWith('http') ? url : `https://${url}`
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`
  return url + 'api/authCallback'
}
