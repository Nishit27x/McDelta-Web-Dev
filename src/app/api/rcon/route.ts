
'use server';

import { type NextRequest, NextResponse } from 'next/server';
import { Rcon } from 'rcon-client';
import * as z from 'zod';

const rconCommandSchema = z.object({
  command: z.string().min(1, 'Command cannot be empty.'),
});


export async function POST(request: NextRequest) {
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
