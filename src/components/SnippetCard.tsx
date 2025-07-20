import React from 'react';
import { Link } from 'react-router-dom';
import { type RecentSnippet } from '../types';

interface SnippetCardProps {
  snippet: RecentSnippet;
  onDelete?: (blobId: string) => void;
}

export const SnippetCard: React.FC<SnippetCardProps> = ({ snippet, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="card bg-base-100 border border-base-300 hover:shadow-md transition-shadow">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="card-title text-lg">
              <Link 
                to={`/snippet/${snippet.blobId}`}
                className="link link-hover"
              >
                {snippet.title}
              </Link>
            </h3>
            <p className="text-sm text-base-content/70 mt-1">
              Created {formatDate(snippet.createdAt)}
            </p>
          </div>
          
          {onDelete && (
            <div className="flex-none">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onDelete(snippet.blobId)}
              >
                🗑️
              </button>
            </div>
          )}
        </div>

        <div className="card-actions justify-end mt-4">
          <Link 
            to={`/snippet/${snippet.blobId}`}
            className="btn btn-primary btn-sm"
          >
            View
          </Link>
          <Link 
            to={`/snippet/${snippet.blobId}/edit`}
            className="btn btn-outline btn-sm"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};