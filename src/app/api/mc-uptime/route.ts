
import { NextResponse } from 'next/server';

// Note: Revalidation is handled by the `next: { revalidate: 60 }` option in the fetch call.
// This is the recommended approach in Next.js App Router for granular cache control.

export async function GET() {
  const apiKey = process.env.PTERODACTYL_API_KEY;
  const serverId = process.env.PTERODACTYL_SERVER_ID;

  if (!apiKey || !serverId) {
    console.error('Missing Pterodactyl API environment variables');
    return NextResponse.json(
      { error: 'Server configuration error.', state: 'offline', uptime: 0 },
      { status: 500 }
    );
  }

  const pteroApiUrl = `https://panel.zoominghost.com/api/client/servers/${serverId}/resources`;

  try {
    const apiResponse = await fetch(pteroApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });

    if (!apiResponse.ok) {
        let errorMessage = 'An unknown error occurred with the hosting panel.';
        try {
            const errorData = await apiResponse.json();
            console.error('Pterodactyl API Error:', errorData);
            errorMessage = errorData.errors?.[0]?.detail || errorMessage;
        } catch (e) {
            // In case the error response is not JSON
            console.error('Pterodactyl API returned non-JSON error:', apiResponse.statusText);
        }
        return NextResponse.json(
          { error: `API Error: ${errorMessage}`, state: 'offline', uptime: 0 },
          { status: apiResponse.status }
        );
    }

    const data = await apiResponse.json();
    const uptime = data.attributes.resources.uptime; // Uptime in milliseconds
    const currentState = data.attributes.current_state; // e.g., "running", "offline"

    return NextResponse.json({ uptime, state: currentState });

  } catch (error) {
    console.error('Failed to send request to Pterodactyl API:', error);
    return NextResponse.json(
      { error: 'Failed to communicate with the hosting panel.', state: 'offline', uptime: 0 },
      { status: 500 }
    );
  }
}
