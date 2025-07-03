
// This route has been deprecated in favor of /api/auth/admin-login.
// It is no longer in use.
import { NextResponse } from 'next/server';

export async function POST() {
    return NextResponse.json({ error: 'This endpoint is deprecated.' }, { status: 410 });
}
