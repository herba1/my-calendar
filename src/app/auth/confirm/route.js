import { createClient } from '../../utils/supabase/server.js'
import { redirect } from 'next/navigation'
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') || null
  const next = searchParams.get('next') ?? '/onboard'
//   console.log(token_hash);
//   console.log(type);
//   console.log(next);
  if (token_hash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next)
    }
  }
  // redirect the user to an error page with some instructions
  redirect('/error')
}