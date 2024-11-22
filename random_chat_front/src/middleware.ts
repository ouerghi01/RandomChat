import { NextResponse, NextRequest } from 'next/server'
import { Cookie } from './app/actions';
// Function to verify the user token
async function verifyUserToken(token: string): Promise<boolean> {
    if (!token) {
        return false;
    }
    
    try {
        const response = await fetch('http://localhost:3006/auth/verify', {
            method: 'POST', // Use the appropriate HTTP method
            headers: {
                'Content-Type': 'application/json', // Specify JSON content
                Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
            body: JSON.stringify({}), // Send any required data
        });

        if (!response.ok) {
            const data = await response.json();
            console.error('Token verification failed:', data.error);
            return false;
        }

        const data = await response.json();
        console.log('Token verified successfully:', data);
        return true;
    } catch (error) {
        console.error('Error verifying token:', error);
        return false;
    }
}

export  default async  function middleware(req: NextRequest) {
    const cookie = new Cookie()
    const token =await  cookie.getCookie('access_token')  
    console.log(token);
    const isAuthenticated = await verifyUserToken(token?.value || '');

    // Check if the route is protected
    const protectedRoutes = ['/Messenger'];
    const isProtectedRoute = protectedRoutes.some((route) =>
        req.nextUrl.pathname.startsWith(route)
    );
    console.log(token)
    console.log(isAuthenticated)
    if (!isAuthenticated && isProtectedRoute) {
        return NextResponse.redirect(new URL('/Authentication/login', req.url));
    }
    return NextResponse.next();
}

// Configure which paths the middleware should apply to

export const config = {
    matcher: '/Messenger/:path*', // Matches /Messenger and its subpaths
};

