import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> } ) {
  try {

    // Get group ID from params
    const { id: groupId } = await params;   
    // Fetch group members
    const groupMembers = await prisma.groupMember.findMany({
      where: { groupId: groupId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    email: true,
                },
            },
        },
    });
    const members = groupMembers.map((member) => member.user);
    return NextResponse.json({ members }, { status: 200 });
  } catch (error) {
    console.error('Error fetching group members:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}