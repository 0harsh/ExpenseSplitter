import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, description, memberIds } = await request.json();

    if (!name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    // Create the group
    const group = await prisma.group.create({
      data: {
        name,
        description,
        creatorId: user.id,
        members: {
          connect: memberIds?.map((id: string) => ({ id })) || []
        }
      },
      include: {
        creator: {
          select: { id: true, name: true, username: true }
        },
        members: {
          select: { id: true, name: true, username: true }
        }
      }
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const groups = await prisma.group.findMany({
      where: {
        members: {
          some: {
            id: user.id
          }
        }
      },
      include: {
        creator: {
          select: { id: true, name: true, username: true }
        },
        members: {
          select: { id: true, name: true, username: true }
        },
        _count: {
          select: {
            expenses: true,
            members: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
