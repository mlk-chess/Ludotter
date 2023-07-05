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

        let role = "";
        await fetch(`${process.env.NEXT_PUBLIC_CLIENT_API}/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + session?.access_token
            }
        })
            .then(response => response.json())
            .then((data) => {
                role = data[0].role;
                console.log(role)

                if (role === "ADMIN"){
                    if (req.nextUrl.pathname.startsWith('/admin')){
                        return res;
                    }
                }

                if (role === "COMPANY"){
                    if (
                        req.nextUrl.pathname.startsWith('/me/event') ||
                        req.nextUrl.pathname.startsWith('/profil')
                    ){
                        return res;
                    }
                }

                if (role === "CLIENT"){
                    if (
                        req.nextUrl.pathname.startsWith('/me/ordering') ||
                        req.nextUrl.pathname.startsWith('/me/announcement') ||
                        req.nextUrl.pathname.startsWith('/profil') ||
                        req.nextUrl.pathname.startsWith('/message')

                    ){
                        return res;
                    }
                }
                const redirectUrl = req.nextUrl.clone()
                redirectUrl.pathname = '/'
                redirectUrl.search = ''
                return NextResponse.redirect(redirectUrl)
            }).catch((error) => {
                console.log('error')
                console.log(error);
                const redirectUrl = req.nextUrl.clone()
                redirectUrl.pathname = '/'
                redirectUrl.search = ''
                return NextResponse.redirect(redirectUrl)
            });
    }
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/me/:path*',
        '/message',
        '/profil',
    ]
}