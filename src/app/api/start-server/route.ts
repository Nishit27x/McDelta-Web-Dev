import { type NextRequest, NextResponse } from 'next/server';
import * as z from 'zod';

const startServerSchema = z.object({
  adminSecret: z.string(),
});

export async function POST(request: NextRequest) {
  // 1. Get secrets from environment variables
  const apiKey = process.env.PTERODACTYL_API_KEY;
  const serverId = process.env.PTERODACTYL_SERVER_ID;
  const adminSecret = process.env.ADMIN_SECRET_TOKEN;

  if (!apiKey || !serverId || !adminSecret) {
    console.error('Missing environment variables for Pterodactyl API');
    return NextResponse.json(
      { error: 'Server configuration error. Please contact the administrator.' },
      { status: 500 }
    );
  }

  // 2. Validate request body and secret token
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 });
  }
  
  const validation = startServerSchema.safeParse(body);
  if (!validation.success) {
     return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (validation.data.adminSecret !== adminSecret) {
    return NextResponse.json({ error: 'Unauthorized: Invalid secret token.' }, { status: 403 });
  }

  // 3. Call the Pterodactyl API
  const pteroApiUrl = `https://panel.zoominghost.com/api/client/servers/${serverId}/power`;

  try {
    const apiResponse = await fetch(pteroApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ signal: 'start' }),
    });

    // Pterodactyl API returns 204 No Content on success
    if (apiResponse.status === 204) {
      return NextResponse.json(
        { message: 'Server start signal sent successfully.' },
        { status: 200 }
      );
    }
    
    // Handle potential errors from the API
    const errorData = await apiResponse.json();
    console.error('Pterodactyl API Error:', errorData);
    const errorMessage = errorData.errors?.[0]?.detail || 'An unknown error occurred with the hosting panel.';
    return NextResponse.json(
      { error: `API Error: ${errorMessage}` },
      { status: apiResponse.status }
    );

  } catch (error) {
    console.error('Failed to send request to Pterodactyl API:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with the hosting panel.' },
      { status: 500 }
    );
  }
}
