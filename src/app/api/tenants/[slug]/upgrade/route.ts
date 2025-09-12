// src/app/api/tenants/[slug]/upgrade/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAdminAuth } from '@/lib/api-utils';

const prisma = new PrismaClient();

export const POST = withAdminAuth(async (request: NextRequest, user: any) => {
  try {
    // URL: /api/tenants/acme/upgrade
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    // parts = ["", "api", "tenants", "acme", "upgrade"]
    const slug = parts[3]; // "acme"

    // Verify the admin is upgrading their own tenant
    if (user.tenantSlug !== slug) {
      return NextResponse.json(
        { error: 'You can only upgrade your own tenant' },
        { status: 403 }
      );
    }

    // Update the subscription to Pro
    const subscription = await prisma.subscription.update({
      where: { tenantId: user.tenantId },
      data: { planType: 'Pro' },
    });

    return NextResponse.json({
      message: 'Subscription upgraded to Pro successfully',
      subscription,
    });
  } catch (error) {
    console.error('Failed to upgrade subscription:', error);
    return NextResponse.json(
      { error: 'Failed to upgrade subscription' },
      { status: 500 }
    );
  }
});
