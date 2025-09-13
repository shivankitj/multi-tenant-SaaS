// src/app/api/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> } // <-- Promise added
) {
  const { path } = await params; // Await karo

  console.log('Dynamic API path:', path);

  // This is a catch-all route, so we'll return a 404 for any API route that doesn't exist
  return NextResponse.json({ error: 'API route not found', path }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> } // <-- Promise added
) {
  const { path } = await params; // Await karo
  return NextResponse.json({ error: 'API route not found', method: 'POST', path }, { status: 404 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> } // <-- Promise added
) {
  const { path } = await params; // Await karo
  return NextResponse.json({ error: 'API route not found', method: 'PUT', path }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> } // <-- Promise added
) {
  const { path } = await params; // Await karo
  return NextResponse.json({ error: 'API route not found', method: 'DELETE', path }, { status: 404 });
}