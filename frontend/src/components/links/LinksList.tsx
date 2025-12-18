import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import {
  Link2,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import api from '@/services/api';
import type { LinkStatus, LinkWithVerification } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const statusConfig: Record<LinkStatus, { icon: typeof CheckCircle; color: string; bgColor: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Processing' },
  scraped: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Scraped' },
  verified: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Verified' },
  failed: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Failed' },
};

export function LinksList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState<LinkWithVerification | null>(null);
  const [isAddingToKnowledgeBase, setIsAddingToKnowledgeBase] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['links', page, statusFilter],
    queryFn: () => api.getLinks(page, 10, statusFilter || undefined),
  });

  const deleteMutation = useMutation({
    mutationFn: (linkId: number) => api.deleteLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const handleDelete = (e: React.MouseEvent, linkId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this link?')) {
      deleteMutation.mutate(linkId);
    }
  };

  const handleProcessLinkClick = (e: React.MouseEvent, link: LinkWithVerification) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLink(link);
    setShowConfirmDialog(true);
  };

  const handleAddToKnowledgeBase = async () => {
    if (!selectedLink) return;

    setIsAddingToKnowledgeBase(true);
    try {
      // Send webhook to n8n
      const webhookResponse = await fetch('https://itmc.ibu.ba/webhook/a63a7f08-5538-4c27-b038-5062d1302b5a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: selectedLink.url }),
      });

      // If webhook succeeded, mark link as scraped
      if (webhookResponse.ok) {
        await api.markLinkAsScraped(selectedLink.id);
        queryClient.invalidateQueries({ queryKey: ['links'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    } catch (error) {
      console.error('Failed to add to knowledge base:', error);
    } finally {
      setIsAddingToKnowledgeBase(false);
      setShowConfirmDialog(false);
      setSelectedLink(null);
    }
  };

  const handleSkipKnowledgeBase = () => {
    setShowConfirmDialog(false);
    setSelectedLink(null);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const links = data?.data?.items || [];
  const pagination = data?.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900">All Links</h1>
            </div>
            <Link
              to="/links/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Link
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="verified">Verified</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Links Table */}
        {links.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
            <Link2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No links found</h3>
            <p className="text-gray-500 mb-4">Add a news article URL to get started</p>
            <Link
              to="/links/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Your First Link
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Link
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credibility
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Added
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {links.map((link: LinkWithVerification) => {
                    const status = statusConfig[link.status];
                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={link.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/links/${link.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link2 className="h-5 w-5 text-gray-400 flex-shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate max-w-md">
                                {link.title || link.url}
                              </p>
                              <p className="text-sm text-gray-500 truncate max-w-md">
                                {link.source_domain}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={clsx(
                              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                              status.bgColor,
                              status.color
                            )}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {link.verification?.credibility_score !== null &&
                          link.verification?.credibility_score !== undefined ? (
                            <span
                              className={clsx(
                                'font-medium',
                                link.verification.credibility_score >= 0.7
                                  ? 'text-green-600'
                                  : link.verification.credibility_score >= 0.4
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              )}
                            >
                              {(link.verification.credibility_score * 100).toFixed(0)}%
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDistanceToNow(new Date(link.created_at), { addSuffix: true })}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {link.status === 'pending' && (
                              <button
                                onClick={(e) => handleProcessLinkClick(e, link)}
                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Process Link"
                              >
                                <RefreshCw className="h-4 w-4" />
                              </button>
                            )}
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                              onClick={(e) => handleDelete(e, link.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing {(page - 1) * pagination.page_size + 1} to{' '}
                  {Math.min(page * pagination.page_size, pagination.total)} of {pagination.total} results
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {pagination.total_pages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(pagination.total_pages, p + 1))}
                    disabled={page === pagination.total_pages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Add to Knowledge Base?
            </h3>
            <p className="text-gray-600 mb-6">
              Do you want to add this link to knowledge base? This will create vector embeddings for better analysis.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleSkipKnowledgeBase}
                disabled={isAddingToKnowledgeBase}
                className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                No, Skip
              </button>
              <button
                onClick={handleAddToKnowledgeBase}
                disabled={isAddingToKnowledgeBase}
                className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isAddingToKnowledgeBase ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Yes, Add</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
