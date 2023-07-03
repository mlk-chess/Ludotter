import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareSupabaseClient({ req, res })
    const {
        data: { session },
    } = await supabase.auth.getSession()
    
    if (session?.user) {
        //Have to check if a user has verified his email
        return res
    }

    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    return NextResponse.redirect(redirectUrl)
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
    ]
}