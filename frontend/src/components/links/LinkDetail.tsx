import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  User,
  Calendar,
  Globe,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { clsx } from 'clsx';
import api from '@/services/api';
import type { LinkStatus } from '@/types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

const statusConfig: Record<LinkStatus, { icon: typeof CheckCircle; color: string; bgColor: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Pending' },
  processing: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Processing' },
  scraped: { icon: Clock, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Scraped' },
  verified: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Verified' },
  failed: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Failed' },
};

const verdictColors: Record<string, string> = {
  verified: 'bg-green-100 text-green-800',
  false: 'bg-red-100 text-red-800',
  unverified: 'bg-gray-100 text-gray-800',
  partially_true: 'bg-yellow-100 text-yellow-800',
};

export function LinkDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isAddingToKnowledgeBase, setIsAddingToKnowledgeBase] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['link', id],
    queryFn: () => api.getLink(Number(id)),
    enabled: !!id,
  });

  const handleProcessLinkClick = () => {
    setShowConfirmDialog(true);
  };

  const handleAddToKnowledgeBase = async () => {
    if (!data?.data?.url) return;

    setIsAddingToKnowledgeBase(true);
    try {
      await fetch('https://itmc.ibu.ba/webhook/a63a7f08-5538-4c27-b038-5062d1302b5a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: data.data.url }),
      });
      queryClient.invalidateQueries({ queryKey: ['link', id] });
    } catch (error) {
      console.error('Failed to add to knowledge base:', error);
    } finally {
      setIsAddingToKnowledgeBase(false);
      setShowConfirmDialog(false);
    }
  };

  const handleSkipKnowledgeBase = () => {
    setShowConfirmDialog(false);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !data?.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Link not found</p>
          <button
            onClick={() => navigate('/links')}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Go back to links
          </button>
        </div>
      </div>
    );
  }

  const link = data.data;
  const status = statusConfig[link.status];
  const StatusIcon = status.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/links')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 truncate max-w-md">
                {link.title || 'Link Details'}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {link.status === 'pending' && (
                <button
                  onClick={handleProcessLinkClick}
                  disabled={isAddingToKnowledgeBase}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={clsx('h-4 w-4', isAddingToKnowledgeBase && 'animate-spin')} />
                  Process Link
                </button>
              )}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Open Original
              </a>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Article Info Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {link.title || 'Untitled Article'}
                </h2>
                <span
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
                    status.bgColor,
                    status.color
                  )}
                >
                  <StatusIcon className="h-4 w-4" />
                  {status.label}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                {link.source_domain && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4" />
                    <span>{link.source_domain}</span>
                  </div>
                )}
                {link.author && (
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{link.author}</span>
                  </div>
                )}
                {link.published_at && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{format(new Date(link.published_at), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 break-all">{link.url}</p>
              </div>

              {link.error_message && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="mt-1 text-sm text-red-600">{link.error_message}</p>
                </div>
              )}
            </div>

            {/* Content Preview */}
            {link.content && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Content</h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {link.content.length > 1000
                      ? `${link.content.substring(0, 1000)}...`
                      : link.content}
                  </p>
                </div>
              </div>
            )}

            {/* Verification Results */}
            {link.verification && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification Results</h3>

                {link.verification.summary && (
                  <p className="text-gray-600 mb-6">{link.verification.summary}</p>
                )}

                {link.verification.claims && link.verification.claims.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Claims Checked</h4>
                    {link.verification.claims.map((claim, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-gray-700">{claim.claim}</p>
                          <span
                            className={clsx(
                              'px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0',
                              verdictColors[claim.verdict] || 'bg-gray-100 text-gray-800'
                            )}
                          >
                            {claim.verdict.replace('_', ' ')}
                          </span>
                        </div>
                        {claim.explanation && (
                          <p className="mt-2 text-sm text-gray-500">{claim.explanation}</p>
                        )}
                        {claim.sources.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Sources:</p>
                            <div className="flex flex-wrap gap-1">
                              {claim.sources.map((source, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                                >
                                  {source}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Credibility Score Card */}
            {link.verification?.credibility_score !== null &&
              link.verification?.credibility_score !== undefined && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Credibility Score</h3>
                  <div className="text-center">
                    <div
                      className={clsx(
                        'inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold',
                        link.verification.credibility_score >= 0.7
                          ? 'bg-green-100 text-green-600'
                          : link.verification.credibility_score >= 0.4
                          ? 'bg-yellow-100 text-yellow-600'
                          : 'bg-red-100 text-red-600'
                      )}
                    >
                      {(link.verification.credibility_score * 100).toFixed(0)}%
                    </div>
                    <p className="mt-3 text-sm text-gray-500">
                      {link.verification.credibility_score >= 0.7
                        ? 'High credibility'
                        : link.verification.credibility_score >= 0.4
                        ? 'Medium credibility'
                        : 'Low credibility'}
                    </p>
                  </div>
                </div>
              )}

            {/* Metadata Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm text-gray-500">Added</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {format(new Date(link.created_at), 'MMM d, yyyy h:mm a')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500">Last Updated</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {format(new Date(link.updated_at), 'MMM d, yyyy h:mm a')}
                  </dd>
                </div>
                {link.verification?.verified_at && (
                  <div>
                    <dt className="text-sm text-gray-500">Verified</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {format(new Date(link.verification.verified_at), 'MMM d, yyyy h:mm a')}
                    </dd>
                  </div>
                )}
                {link.verification?.sources_checked && link.verification.sources_checked.length > 0 && (
                  <div>
                    <dt className="text-sm text-gray-500 mb-1">Sources Checked</dt>
                    <dd className="flex flex-wrap gap-1">
                      {link.verification.sources_checked.map((source, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded"
                        >
                          {source}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
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
