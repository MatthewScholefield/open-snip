import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { SnippetCard } from '../components/SnippetCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { dbOperations } from '../lib/db';
import { snippetApi } from '../lib/api';

export const HomePage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: recentSnippets, isLoading, error } = useQuery({
    queryKey: ['recentSnippets'],
    queryFn: () => dbOperations.getRecentSnippets(),
  });

  const deleteSnippetMutation = useMutation({
    mutationFn: snippetApi.deleteSnippet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recentSnippets'] });
    },
  });

  const handleDeleteSnippet = (blobId: string) => {
    if (window.confirm('Are you sure you want to delete this snippet?')) {
      deleteSnippetMutation.mutate(blobId);
    }
  };

  if (isLoading) {
    return <LoadingSpinner size="lg" className="min-h-96" />;
  }

  if (error) {
    return <ErrorAlert error={error as Error} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Recent Snippets</h1>
        <Link to="/create" className="btn btn-primary">
          Create New Snippet
        </Link>
      </div>

      {!recentSnippets || recentSnippets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold mb-2">No snippets yet</h2>
          <p className="text-base-content/70 mb-6">
            Create your first code snippet to get started
          </p>
          <Link to="/create" className="btn btn-primary">
            Create Snippet
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onDelete={handleDeleteSnippet}
            />
          ))}
        </div>
      )}
    </div>
  );
};
