import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { useLocalStorage } from 'usehooks-ts';
import { getLanguageExtension, getLanguageDisplayName, detectLanguageFromFilename } from '../lib/languages';
import { SUPPORTED_LANGUAGES, type SupportedLanguage, type CodeFile } from '../types';

interface CodeEditorProps {
  file: CodeFile;
  onChange: (file: CodeFile) => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ 
  file, 
  onChange, 
  onDelete,
  showDelete = true 
}) => {
  const [theme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  const handleNameChange = (name: string) => {
    const detectedLanguage = detectLanguageFromFilename(name);
    onChange({
      ...file,
      name,
      language: detectedLanguage,
    });
  };

  const handleLanguageChange = (language: SupportedLanguage) => {
    onChange({
      ...file,
      language,
    });
  };

  const handleContentChange = (content: string) => {
    onChange({
      ...file,
      content,
    });
  };

  const extensions = React.useMemo(() => {
    const langExtension = getLanguageExtension(file.language);
    return langExtension ? [langExtension] : [];
  }, [file.language]);

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="label">
              <span className="label-text">Filename</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={file.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="filename.js"
            />
          </div>
          
          <div className="flex-none">
            <label className="label">
              <span className="label-text">Language</span>
            </label>
            <select
              className="select select-bordered"
              value={file.language}
              onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {getLanguageDisplayName(lang)}
                </option>
              ))}
            </select>
          </div>

          {showDelete && onDelete && (
            <div className="flex-none">
              <label className="label">
                <span className="label-text">&nbsp;</span>
              </label>
              <button
                className="btn btn-error btn-outline"
                onClick={onDelete}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="border border-base-300 rounded-lg overflow-hidden">
          <CodeMirror
            value={file.content}
            onChange={handleContentChange}
            extensions={extensions}
            theme={theme === 'dark' ? oneDark : undefined}
            placeholder="Enter your code here..."
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