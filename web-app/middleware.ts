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
        const {data: user} = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id).single();
        

        if (user == null){

            const {data: user} = await supabase
            .from('company')
            .select('role')
            .eq('authId', session.user.id).single();

            role = user?.role;

        }else{
            role = user?.role;
        }
       
       

        if (role == "ADMIN"){
            if (req.nextUrl.pathname.startsWith('/admin')){
                return res;
            }
        }

        if (role == "COMPANY"){
            if (
                req.nextUrl.pathname.startsWith('/company') ||
                req.nextUrl.pathname.startsWith('/profil')
            ){
                return res;
            }
        }

        if (role == "CLIENT"){
            if (
                req.nextUrl.pathname.startsWith('/me') ||
                req.nextUrl.pathname.startsWith('/profil') ||
                req.nextUrl.pathname.startsWith('/message')

            ){
                return res;
            }
        }
    }

    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.search = ''
    return NextResponse.redirect(redirectUrl)
}

export const config = {
    matcher: [
        '/admin',
        '/admin/:path*',
        '/me/:path*',
        '/message',
        '/profil',
        '/updateProfil',
        '/company',
        '/company/:path*',
    ]
}