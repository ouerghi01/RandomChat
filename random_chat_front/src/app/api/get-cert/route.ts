import { loadCert } from '../../../lib/loadCert';


export default async function POST(req: Request ) {
    try {
      const cert = loadCert(); // Load the certificate
      return new Response(JSON.stringify({ cert }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error fetching certificate' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  
}
