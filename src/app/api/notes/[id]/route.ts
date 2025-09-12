// src/app/api/notes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAuth } from '@/lib/api-utils';

const prisma = new PrismaClient();

// Helper: extract id from URL
function getIdFromRequest(request: NextRequest) {
  const url = new URL(request.url);
  const parts = url.pathname.split('/');
  // /api/notes/<id>
  return parts[3]; // parts[0] = "", parts[1] = "api", parts[2] = "notes", parts[3] = id
}

// GET /api/notes/[id] - Get a specific note
export const GET = withAuth(async (request, user) => {
  try {
    const id = getIdFromRequest(request);

    const note = await prisma.note.findFirst({
      where: {
        id,
        tenantId: user.tenantId, // Ensure tenant isolation
      },
      include: {
        author: {
          select: { email: true },
        },
      },
    });

    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error('Failed to fetch note:', error);
    return NextResponse.json({ error: 'Failed to fetch note' }, { status: 500 });
  }
});

// PUT /api/notes/[id] - Update a note
export const PUT = withAuth(async (request, user) => {
  try {
    const id = getIdFromRequest(request);
    const { title, content } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const existingNote = await prisma.note.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const note = await prisma.note.update({
      where: { id },
      data: { title, content },
      include: {
        author: { select: { email: true } },
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error('Failed to update note:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
});

// DELETE /api/notes/[id] - Delete a note
export const DELETE = withAuth(async (request, user) => {
  try {
    const id = getIdFromRequest(request);

    const existingNote = await prisma.note.findFirst({
      where: { id, tenantId: user.tenantId },
    });

    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    await prisma.note.delete({ where: { id } });

    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Failed to delete note:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
});
