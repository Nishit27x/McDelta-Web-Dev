
import { type NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/session-verifier';
import admin from '@/lib/firebase-admin';

async function isAdmin(uid: string): Promise<boolean> {
  const db = admin.database();
  const adminGamertags = (process.env.ADMIN_GAMERTAGS || '').split(',').map(g => g.trim().toLowerCase()).filter(Boolean);
  
  const userRef = db.ref(`users/${uid}`);
  const snapshot = await userRef.once('value');
  if (!snapshot.exists()) return false;
  
  const userProfile = snapshot.val();
  return adminGamertags.includes(userProfile.gamertag.toLowerCase());
}

export async function GET(request: NextRequest) {
  // 1. Verify user is an authenticated admin
  let decodedToken;
  try {
    decodedToken = await verifySession(request);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  if (!await isAdmin(decodedToken.uid)) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  // 2. Get Pterodactyl secrets
  const apiKey = process.env.PTERODACTYL_API_KEY;
  const serverId = process.env.PTERODACTYL_SERVER_ID;
  
  if (!apiKey || !serverId) {
    console.error('Missing Pterodactyl API environment variables');
    return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
  }

  // 3. Fetch WebSocket credentials from Pterodactyl
  const pteroApiUrl = `https://panel.zoominghost.com/api/client/servers/${serverId}/websocket`;

  try {
    const apiResponse = await fetch(pteroApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      cache: 'no-store' // Credentials are short-lived
    });

    if (!apiResponse.ok) {
        let errorData;
        try {
            errorData = await apiResponse.json();
            console.error('Pterodactyl API Error fetching websocket creds:', errorData);
        } catch(e) {
            console.error('Pterodactyl API returned non-JSON error:', apiResponse.statusText);
        }
        const errorMessage = errorData?.errors?.[0]?.detail || 'Failed to get live console credentials from hosting panel.';
        return NextResponse.json({ error: errorMessage }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();
    const { token, socket: socketUrl } = data.data;

    if (!token || !socketUrl) {
      console.error('Invalid response from Pterodactyl API when fetching websocket creds.');
      throw new Error('Invalid response from Pterodactyl API.');
    }

    // 4. Return credentials to the client
    return NextResponse.json({ token, socketUrl });

  } catch (error) {
    console.error('Error fetching live console credentials:', error);
    return NextResponse.json({ error: 'Failed to communicate with the hosting panel.' }, { status: 500 });
  }
}
