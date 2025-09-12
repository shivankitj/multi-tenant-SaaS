// src/app/api/notes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAuth } from '@/lib/api-utils';

const prisma = new PrismaClient();

// GET /api/notes - Get all notes for the current tenant
export const GET = withAuth(async (request, user) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        tenantId: user.tenantId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
});

// POST /api/notes - Create a new note
export const POST = withAuth(async (request, user) => {
  try {
    const { title, content } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Check subscription limits for Free plan
    const subscription = await prisma.subscription.findUnique({
      where: {
        tenantId: user.tenantId,
      },
    });

    if (subscription?.planType === 'Free') {
      const noteCount = await prisma.note.count({
        where: {
          tenantId: user.tenantId,
        },
      });

      if (noteCount >= 3) {
        return NextResponse.json(
          { 
            error: 'Free plan limit reached. Upgrade to Pro to create more notes.',
            limitReached: true 
          },
          { status: 403 }
        );
      }
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        authorId: user.userId,
        tenantId: user.tenantId,
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Failed to create note:', error);
    return NextResponse.json(
      { error: 'Failed to create note' },
      { status: 500 }
    );
  }
});