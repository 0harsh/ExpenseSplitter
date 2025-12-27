
import Navigation from '@/components/layout/Navigation';
import DashboardUserProvider from '@/lib/DashboardUserProvider';

export default async function DashboardLayout({children}: {children: React.ReactNode;}) {

  return (
    <>
      <DashboardUserProvider>
        <Navigation />
        <div className="min-h-screen bg-gray-50 pt-16">
          {children}
        </div>
      </DashboardUserProvider>
    </>
  );
}
