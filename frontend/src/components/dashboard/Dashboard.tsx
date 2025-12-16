import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link2,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Plus,
  LogOut,
  User,
} from 'lucide-react';
import api from '@/services/api';
import { useAuthStore } from '@/context/authStore';
import { StatsCard } from './StatsCard';
import { RecentLinks } from './RecentLinks';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function Dashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, logout } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', user?.email],
    queryFn: () => api.getDashboard(),
    refetchOnMount: 'always',
  });

  const handleLogout = () => {
    // Clear all React Query cache before logout
    queryClient.clear();
    logout();
    navigate('/');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load dashboard</p>
        </div>
      </div>
    );
  }

  const { stats, recent_links } = data.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">News Verifier</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="h-5 w-5" />
                <span className="text-sm">{user?.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h2>
          <p className="text-gray-600 mt-1">Here's an overview of your news verification activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Links"
            value={stats.total_links}
            icon={Link2}
            color="blue"
          />
          <StatsCard
            title="Verified"
            value={stats.verified_links}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Pending"
            value={stats.pending_links}
            icon={Clock}
            color="yellow"
          />
          <StatsCard
            title="Avg. Credibility"
            value={stats.average_credibility ? `${(stats.average_credibility * 100).toFixed(0)}%` : 'N/A'}
            icon={TrendingUp}
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/links/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add New Link
          </Link>
          <Link
            to="/links"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Link2 className="h-5 w-5" />
            View All Links
          </Link>
        </div>

        {/* Recent Links */}
        <RecentLinks links={recent_links} />
      </main>
    </div>
  );
}
