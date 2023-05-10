import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    console.log(request);
    const { url } = request;

    // Vérifier si la route nécessite une authentification
    if (requiresAuthentication(url)) {
        const token = request.cookies.token;

        if (!token) {
            return NextResponse.redirect('/login');
        }

        try {
            jwt.verify(token, 'secret');
            return NextResponse.next();
        } catch (error) {
            return NextResponse.redirect('/login');
        }
    }

    return NextResponse.next();
}

function requiresAuthentication(url: string) {
    const protectedRoutes = [
        '/dashboard',
        '/profile',
        '/',
        // Ajoutez d'autres routes protégées ici
    ];

    return protectedRoutes.includes(url);
}

export const config = {
    matcher: [
        '/', 
        '/dashboard',
        '/profile'
    ],

};
