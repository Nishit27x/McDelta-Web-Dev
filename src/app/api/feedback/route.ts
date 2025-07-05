import { NextResponse } from 'next/server';

// This API route is no longer used for feedback submission or retrieval.
// All feedback logic has been moved to the client-side to simplify configuration
// and remove the dependency on server-side secret keys for this feature.
// See src/app/feedback/page.tsx and src/components/landing/feedback.tsx for the new implementation.

export async function GET() {
  return NextResponse.json({ error: 'This endpoint is deprecated.' }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: 'This endpoint is deprecated.' }, { status: 410 });
}
