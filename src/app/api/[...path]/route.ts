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
  { params }: { params: { path: string[] } }
) {
  // This is a catch-all route, so we'll return a 404 for any API route that doesn't exist
  return NextResponse.json({ error: 'API route not found' }, { status: 404 });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return NextResponse.json({ error: 'API route not found' }, { status: 404 });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return NextResponse.json({ error: 'API route not found' }, { status: 404 });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return NextResponse.json({ error: 'API route not found' }, { status: 404 });
}