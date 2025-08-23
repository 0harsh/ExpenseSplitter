import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { getCurrentUser } from '@/app/lib/serverAuth';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const { title, description, amount, date, groupId, splits } = await request.json();

    if (!title || !amount || !groupId) {
      return NextResponse.json({ error: 'Title, amount, and group are required' }, { status: 400 });
    }

    // Create the expense with splits
    const expense = await prisma.expense.create({
      data: {
        title,
        description,
        amount: parseFloat(amount),
        date: date ? new Date(date) : new Date(),
        paidById: user.id,
        groupId,
        splits: {
          create: splits.map((split: any) => ({
            userId: split.userId,
            amount: parseFloat(split.amount),
            percentage: split.percentage ? parseFloat(split.percentage) : null
          }))
        }
      },
      include: {
        paidBy: {
          select: { id: true, name: true, username: true }
        },
        group: {
          select: { id: true, name: true, members: { include: { user: { select: { id: true, name: true, username: true } } } } }
        },
        splits: {
          include: {
            user: {
              select: { id: true, name: true, username: true }
            }
          }
        }
      }
    });

    return NextResponse.json(expense);
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating expense:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');

    const whereClause: any = {
      group: {
        members: {
          some: {
            userId: user.id
          }
        }
      }
    };

    if (groupId) {
      whereClause.groupId = groupId;
    }

    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        paidBy: {
          select: { id: true, name: true, username: true }
        },
        group: {
          select: { id: true, name: true, members: { include: { user: { select: { id: true, name: true, username: true } } } } }
        },
        splits: {
          include: {
            user: {
              select: { id: true, name: true, username: true }
            }
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    return NextResponse.json(expenses);
  } catch (error) {
    if (error instanceof Error && error.message.includes('authentication')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching expenses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
