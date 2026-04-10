import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Initialize Firebase Admin SDK.
 *
 * Supports two modes:
 * 1. FIREBASE_SERVICE_ACCOUNT env var (base64-encoded JSON) — for Render / production
 * 2. GOOGLE_APPLICATION_CREDENTIALS env var (file path) — for local development
 */
function initializeAdmin() {
  if (admin.apps.length > 0) return admin;

  const base64Key = process.env.FIREBASE_SERVICE_ACCOUNT;
  const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (base64Key) {
    // Production: decode base64 service account
    const serviceAccount = JSON.parse(
      Buffer.from(base64Key, 'base64').toString('utf-8')
    );
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized with base64 service account');
  } else if (credentialsPath) {
    // Local dev: read the JSON file directly
    try {
      const serviceAccount = JSON.parse(readFileSync(credentialsPath, 'utf-8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin initialized from', credentialsPath);
    } catch (err) {
      console.error('❌ Failed to read service account file:', err.message);
      admin.initializeApp();
    }
  } else {
    console.warn(
      '⚠️  No Firebase Admin credentials found. Auth middleware will reject all requests.\n' +
      '   Set FIREBASE_SERVICE_ACCOUNT (base64) or GOOGLE_APPLICATION_CREDENTIALS (file path).'
    );
    admin.initializeApp();
  }

  return admin;
}

const adminInstance = initializeAdmin();

export const adminAuth = adminInstance.auth();
export const adminDb = adminInstance.firestore();
export default adminInstance;
