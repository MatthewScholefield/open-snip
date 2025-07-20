import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { getLanguageExtension, getLanguageDisplayName } from '../lib/languages';
import type { SnippetFile } from '../types';

interface SnippetFileViewerProps {
  file: SnippetFile;
  theme: 'light' | 'dark';
  onCopyToClipboard: (content: string) => void;
}

export const SnippetFileViewer: React.FC<SnippetFileViewerProps> = ({
  file,
  theme,
  onCopyToClipboard,
}) => {
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
            onClick={() => onCopyToClipboard(file.content)}
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
};
