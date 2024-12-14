import axios from 'axios';
import https from 'https';
import fs from 'fs';



export async function POST(req: Request): Promise<Response> {
    // Extract the body data
    const { access_token: token } = await req.json();

    if (!token) {
        return new Response(
            JSON.stringify({ error: 'Token is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
    }

    // Create an HTTPS agent with the self-signed certificate
    const agent = new https.Agent({
        ca: fs.readFileSync('/app/secrets/certificate.crt'), // Adjust the path to your certificate
    });

    try {
        // Make the request with Axios
        const response = await axios.post(
            'https://nginx-server/auth/verify',
            {}, // Send any required data as the body
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                httpsAgent: agent, // Use the custom HTTPS agent
            }
        );

        console.log('Token verified successfully:', response.data);

        // Return a successful response
        return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Token verification failed:', error.response.data.error);
            return new Response(
                JSON.stringify({ error: error.response.data.error }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        } else if (error instanceof Error) {
            console.error('Error verifying token:', error.message);
            return new Response(
                JSON.stringify({ error: error.message }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        } else {
            console.error('Unexpected error:', error);
            return new Response(
                JSON.stringify({ error: 'Unexpected error' }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }
}



