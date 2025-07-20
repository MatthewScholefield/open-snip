import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { nanoid } from 'nanoid';
import { CodeEditor } from '../components/CodeEditor';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { snippetApi } from '../lib/api';
import { type CodeFile, type CreateSnippetRequest } from '../types';

export const CreateSnippetPage: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [files, setFiles] = React.useState<CodeFile[]>([
    {
      id: nanoid(),
      name: 'index.js',
      content: '',
      language: 'javascript',
    },
  ]);

  const createSnippetMutation = useMutation({
    mutationFn: snippetApi.createSnippet,
    onSuccess: (snippet) => {
      navigate(`/snippet/${snippet.blobId}`);
    },
  });

  const handleAddFile = () => {
    const newFile: CodeFile = {
      id: nanoid(),
      name: `file${files.length + 1}.js`,
      content: '',
      language: 'javascript',
    };
    setFiles([...files, newFile]);
  };

  const handleFileChange = (index: number, updatedFile: CodeFile) => {
    const newFiles = [...files];
    newFiles[index] = updatedFile;
    setFiles(newFiles);
  };

  const handleDeleteFile = (index: number) => {
    if (files.length > 1) {
      const newFiles = files.filter((_, i) => i !== index);
      setFiles(newFiles);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    if (files.some(file => !file.name.trim())) {
      alert('Please ensure all files have names');
      return;
    }

    const request: CreateSnippetRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      files: files.map(({ id, ...file }) => file),
    };

    createSnippetMutation.mutate(request);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Create New Snippet</h1>

      {createSnippetMutation.error && (
        <ErrorAlert error={createSnippetMutation.error as Error} />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My awesome snippet"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description of your snippet"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Files</h2>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleAddFile}
            >
              Add File
            </button>
          </div>

          {files.map((file, index) => (
            <CodeEditor
              key={file.id}
              file={file}
              onChange={(updatedFile) => handleFileChange(index, updatedFile)}
              onDelete={files.length > 1 ? () => handleDeleteFile(index) : undefined}
              showDelete={files.length > 1}
            />
          ))}
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={createSnippetMutation.isPending}
          >
            {createSnippetMutation.isPending ? (
              <>
                <LoadingSpinner size="sm" />
                Creating...
              </>
            ) : (
              'Create Snippet'
            )}
          </button>
          
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};