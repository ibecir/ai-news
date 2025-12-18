import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Link2, Loader2, AlertCircle } from 'lucide-react';
import api from '@/services/api';

export function AddLink() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [addedUrl, setAddedUrl] = useState('');
  const [linkId, setLinkId] = useState<number | null>(null);
  const [isAddingToKnowledgeBase, setIsAddingToKnowledgeBase] = useState(false);

  const mutation = useMutation({
    mutationFn: (url: string) => api.createLink({ url }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setAddedUrl(url);
      setLinkId(data.data?.id || null);
      setShowConfirmDialog(true);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { detail?: string } } };
      setError(error.response?.data?.detail || 'Failed to add link. Please try again.');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      return;
    }

    mutation.mutate(url);
  };

  const handleAddToKnowledgeBase = async () => {
    setIsAddingToKnowledgeBase(true);
    try {
      // Send webhook to n8n
      const webhookResponse = await fetch('https://itmc.ibu.ba/webhook/a63a7f08-5538-4c27-b038-5062d1302b5a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: addedUrl }),
      });

      // If webhook succeeded, mark link as scraped
      if (webhookResponse.ok && linkId) {
        await api.markLinkAsScraped(linkId);
        queryClient.invalidateQueries({ queryKey: ['links'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }
    } catch (error) {
      console.error('Failed to add to knowledge base:', error);
    } finally {
      setIsAddingToKnowledgeBase(false);
      navigateToLink();
    }
  };

  const handleSkipKnowledgeBase = () => {
    navigateToLink();
  };

  const navigateToLink = () => {
    setShowConfirmDialog(false);
    if (linkId) {
      navigate(`/links/${linkId}`);
    } else {
      navigate('/links');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">Add New Link</h1>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Link2 className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Add a News Article</h2>
            <p className="text-gray-500 mt-1">
              Enter the URL of a news article to verify its credibility
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Article URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/news-article"
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                disabled={mutation.isPending}
                required
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={mutation.isPending || !url.trim()}
                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add Link</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Tips for best results:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Use the full URL including https://</li>
            <li>• Ensure the article is publicly accessible</li>
            <li>• Works best with news articles from major publications</li>
          </ul>
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
