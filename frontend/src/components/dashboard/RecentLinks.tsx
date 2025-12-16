import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { clsx } from 'clsx';
import type { LinkWithVerification, LinkStatus } from '@/types';

interface RecentLinksProps {
  links: LinkWithVerification[];
}

const statusConfig: Record<LinkStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  pending: { icon: Clock, color: 'text-yellow-500', label: 'Pending' },
  processing: { icon: Clock, color: 'text-blue-500', label: 'Processing' },
  scraped: { icon: Clock, color: 'text-blue-500', label: 'Scraped' },
  verified: { icon: CheckCircle, color: 'text-green-500', label: 'Verified' },
  failed: { icon: XCircle, color: 'text-red-500', label: 'Failed' },
};

export function RecentLinks({ links }: RecentLinksProps) {
  if (links.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No links yet</h3>
          <p className="text-gray-500 mb-4">Start by adding a news article URL to verify</p>
          <Link
            to="/links/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Recent Links</h3>
      </div>
      <div className="divide-y divide-gray-100">
        {links.map((link) => {
          const status = statusConfig[link.status];
          const StatusIcon = status.icon;

          return (
            <Link
              key={link.id}
              to={`/links/${link.id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className={clsx('mt-1', status.color)}>
                  <StatusIcon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {link.title || link.url}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gray-500">{link.source_domain}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(link.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {link.verification?.credibility_score !== null && link.verification?.credibility_score !== undefined && (
                    <div className="mt-2">
                      <span
                        className={clsx(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          link.verification.credibility_score >= 0.7
                            ? 'bg-green-100 text-green-800'
                            : link.verification.credibility_score >= 0.4
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        )}
                      >
                        {(link.verification.credibility_score * 100).toFixed(0)}% Credibility
                      </span>
                    </div>
                  )}
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400" />
              </div>
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-gray-100">
        <Link
          to="/links"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View all links →
        </Link>
      </div>
    </div>
  );
}
