import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { snippetApi } from '../lib/api';
import { SnippetFileViewer } from '../components/SnippetFileViewer';

export const ViewSnippetPage: React.FC = () => {
  const { blobId } = useParams<{ blobId: string }>();
  const [theme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  const { data: snippet, isLoading, error } = useQuery({
    queryKey: ['snippet', blobId],
    queryFn: () => snippetApi.getSnippet(blobId!),
    enabled: !!blobId,
  });

  const handleCopyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const handleShareSnippet = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    // You could add a toast notification here
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-96" />;
  }

  if (error) {
    return <ErrorAlert error={error as Error} />;
  }

  if (!snippet) {
    return <ErrorAlert error="Snippet not found" />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{snippet.title}</h1>
          {snippet.description && (
            <p className="text-base-content/70 mt-2">{snippet.description}</p>
          )}
          <div className="text-sm text-base-content/60 mt-2">
            Created {formatDate(snippet.createdAt)}
            {snippet.updatedAt !== snippet.createdAt && (
              <span> • Updated {formatDate(snippet.updatedAt)}</span>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            className="btn btn-outline btn-sm"
            onClick={handleShareSnippet}
          >
            📋 Share
          </button>
          <Link
            to={`/snippet/${blobId}/edit`}
            className="btn btn-primary btn-sm"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {snippet.files.map((file) => (
          <SnippetFileViewer
            key={file.id}
            file={file}
            theme={theme}
            onCopyToClipboard={handleCopyToClipboard}
          />
        ))}
      </div>
    </div>
  );
};
