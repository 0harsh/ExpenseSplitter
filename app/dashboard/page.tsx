import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { verifyAuthToken, authCookieOptions } from '@/app/lib/auth';
import UserProfile from '../components/auth/UserProfile';
import Navigation from '../components/layout/Navigation';
import GroupsList from '../components/groups/GroupsList';
import ExpensesList from '../components/expenses/ExpensesList';

export default async function DashboardPage() {
  const { name: cookieName } = authCookieOptions();
  const cookieStore = await cookies();
  const token = cookieStore.get(cookieName)?.value;

  if (!token) {
    redirect('/login');
  }

  try {
    const payload = verifyAuthToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, username: true, name: true, createdAt: true },
    });

    if (!user) {
      redirect('/login');
    }

    // Fetch groups and expenses for the user
    const [groups, expenses, allUsers] = await Promise.all([
      prisma.group.findMany({
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
      }),
      prisma.expense.findMany({
        where: {
          group: {
            members: {
              some: {
                id: user.id
              }
            }
          }
        },
        include: {
          paidBy: {
            select: { id: true, name: true, username: true }
          },
          group: {
            select: { id: true, name: true, members: { select: { id: true, name: true, username: true } } }
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
      }),
      prisma.user.findMany({
        select: { id: true, name: true, username: true }
      })
    ]);

    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome to ExpenseSplitter</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Profile */}
              <div className="lg:col-span-1">
                <UserProfile user={user} />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Groups */}
                <GroupsList groups={groups} users={allUsers} />

                {/* Expenses */}
                <ExpensesList expenses={expenses} groups={groups} />

                {/* Quick Stats */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{groups.length}</div>
                      <div className="text-sm text-gray-500">Active Groups</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">Total Expenses</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {expenses.reduce((sum, expense) => 
                          sum + expense.splits.filter(split => !split.isPaid).length, 0
                        )}
                      </div>
                      <div className="text-sm text-gray-500">Pending Payments</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  } catch {
    redirect('/login');
  }
}
