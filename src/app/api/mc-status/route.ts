import { status } from 'minecraft-server-util';
import { NextResponse } from 'next/server';

export const revalidate = 0; // Set to 0 to disable caching and ensure real-time status

const serverConfig = {
  host: 'paid-1.guardxhosting.in',
  port: 25501, // Game port for status ping
};

export async function GET() {
  try {
    const response = await status(serverConfig.host, serverConfig.port, {
      timeout: 5000,
      enableSRV: false,
    });

    const data = {
      online: response.players.online,
      max: response.players.max,
      players: response.players.sample ? response.players.sample.map(p => ({ name: p.name, id: p.id })) : [],
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to query Minecraft server:', error);
    return NextResponse.json(
      { online: 0, max: 0, players: [], error: 'Server is offline or unreachable.' },
      { status: 200 } // Return 200 OK with an error payload for the client to handle
    );
  }
}
