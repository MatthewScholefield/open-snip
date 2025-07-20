import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { useLocalStorage } from 'usehooks-ts';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { snippetApi } from '../lib/api';
import { getLanguageExtension, getLanguageDisplayName } from '../lib/languages';

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
        {snippet.files.map((file) => {
          const extensions = React.useMemo(() => {
            const langExtension = getLanguageExtension(file.language);
            return langExtension ? [langExtension] : [];
          }, [file.language]);

          return (
            <div key={file.id} className="card bg-base-100 border border-base-300">
              <div className="card-body p-0">
                <div className="flex justify-between items-center p-4 border-b border-base-300">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold">{file.name}</h3>
                    <span className="badge badge-outline">
                      {getLanguageDisplayName(file.language)}
                    </span>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => handleCopyToClipboard(file.content)}
                  >
                    📋 Copy
                  </button>
                </div>
                
                <div className="overflow-hidden">
                  <CodeMirror
                    value={file.content}
                    extensions={extensions}
                    theme={theme === 'dark' ? oneDark : undefined}
                    editable={false}
                    basicSetup={{
                      lineNumbers: true,
                      foldGutter: true,
                      dropCursor: false,
                      allowMultipleSelections: false,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
