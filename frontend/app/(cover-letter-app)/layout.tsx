import Sidebar from './app-components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Sidebar />
        <div className="ml-64 min-h-screen">
          {children}
        </div>
      </div>
    </ProtectedRoute>
  );
}