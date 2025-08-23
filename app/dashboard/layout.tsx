import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/app/lib/prisma';
import { verifyAuthToken, authCookieOptions } from '@/app/lib/auth';
import Navigation from '@/components/layout/Navigation';
import UserProfile from '@/components/auth/UserProfile';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Welcome to ExpenseSplitter</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">
                    Welcome, {user.name || user.username}!
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* User Profile */}
              <div className="lg:col-span-1">
                <UserProfile user={user} />
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {children}
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
