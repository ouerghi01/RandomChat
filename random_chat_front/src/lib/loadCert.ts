// /lib/loadCert.ts
import fs from 'fs';
import path from 'path';

export function loadCert() {
  const certPath = path.join(process.cwd(), 'secrets', 'cert.pem');
  return fs.readFileSync(certPath, 'utf8'); // Read the certificate
}
