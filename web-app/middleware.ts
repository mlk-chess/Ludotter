import { createMiddlewareSupabaseClient, createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiRequest, NextApiResponse } from 'next'
import type { NextRequest } from 'next/server'

// export async function middleware(req: NextRequest) {
//     const res = NextResponse.next()
//     const supabase = createServerSupabaseClient({req, res})
//     const {data: {user}} = await supabase.auth.getUser();

//     console.log(user);
    
    
//     if (user) {
//         return res;
//     }

//     const redirectUrl = req.nextUrl.clone()
//     redirectUrl.pathname = '/login'
//     redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)
//     return NextResponse.redirect(redirectUrl)
// }

export async function middleware (req: NextApiRequest, res: NextApiResponse) {
    const supabaseServerClient = createServerSupabaseClient({
        req,
        res,
    })
    const {
        data: { user },
    } = await supabaseServerClient.auth.getUser()

    console.log(user);
    
    // res.status(200).json({})
}

export const config = {
    matcher: '/',
}