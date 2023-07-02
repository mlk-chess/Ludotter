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
        const { data: user, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single()
        if (error) {
            console.error(error)
            return NextResponse.error()
        }

        if (req.nextUrl.pathname.startsWith('/admin')) {
            if (user?.role !== 'ADMIN') {
                const redirectUrl = req.nextUrl.clone()
                redirectUrl.pathname = '/'
                return NextResponse.redirect(redirectUrl)
            }
        }

        if (req.nextUrl.pathname.startsWith('/admin')) {
            if (user?.role !== 'CLIENT') {
                const redirectUrl = req.nextUrl.clone()
                redirectUrl.pathname = '/'
                return NextResponse.redirect(redirectUrl)
            }
        }

        return res
    }else if (
        req.nextUrl.pathname.startsWith('/admin') ||
        req.nextUrl.pathname.startsWith('/me') ||
        req.nextUrl.pathname === '/profile' ||
        req.nextUrl.pathname === '/logout' ||
        req.nextUrl.pathname === '/event/me' 
        ) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/login'
        return NextResponse.redirect(redirectUrl)
    }
}