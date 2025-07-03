
'use server';

import { type NextRequest, NextResponse } from 'next/server';
import { Rcon } from 'rcon-client';
import * as z from 'zod';
import { verifySession } from '@/lib/session-verifier';
import admin from '@/lib/firebase-admin';

const rconCommandSchema = z.object({
  command: z.string().min(1, 'Command cannot be empty.'),
});

async function isAdmin(uid: string): Promise<boolean> {
  if (!admin.apps.length) return false;
  const db = admin.database();
  const adminGamertags = (process.env.ADMIN_GAMERTAGS || '').split(',').map(g => g.trim().toLowerCase()).filter(Boolean);
  
  const userRef = db.ref(`users/${uid}`);
  const snapshot = await userRef.once('value');
  if (!snapshot.exists()) return false;
  
  const userProfile = snapshot.val();
  if (!userProfile.gamertag) return false;

  return adminGamertags.includes(userProfile.gamertag.toLowerCase());
}

export async function POST(request: NextRequest) {
  try {
    const decodedToken = await verifySession(request);
    if (!await isAdmin(decodedToken.uid)) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const validation = rconCommandSchema.safeParse(body);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const errorMessage = fieldErrors.command?.[0] || "Invalid command.";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }

  const { command } = validation.data;

  // RCON Connection Details (as provided)
  const rconHost = 'paid-1.guardxhosting.in';
  const rconPort = 25783;
  const rconPassword = 'ẟiﬀerentiation';
  
  try {
    // Connect to RCON and execute the command
    const rcon = await Rcon.connect({
      host: rconHost,
      port: rconPort,
      password: rconPassword,
    });

    const response = await rcon.send(command);
    await rcon.end();
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('RCON command failed:', error);
    return NextResponse.json({ error: 'Failed to execute command. The server might be offline or RCON is not enabled.' }, { status: 500 });
  }
}
