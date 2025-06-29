import { query } from 'minecraft-server-util';
import { NextResponse } from 'next/server';

export const revalidate = 60; // Revalidate every 60 seconds

const serverConfig = {
  host: 'paid-1.guardxhosting.in',
  port: 25565, // Query port
};

export async function GET() {
  try {
    const response = await query(serverConfig.host, serverConfig.port, {
      timeout: 5000,
      enableSRV: false,
    });

    const data = {
      online: response.players.online,
      max: response.players.max,
      players: response.players.list,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to query Minecraft server:', error);
    return NextResponse.json(
      { online: 0, max: 0, players: [], error: 'Server is offline or unreachable.' },
      { status: 500 }
    );
  }
}
