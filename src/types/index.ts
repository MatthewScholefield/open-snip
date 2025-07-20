import { type } from 'arktype';

export const CodeFile = type({
  id: 'string',
  name: 'string',
  content: 'string',
  language: 'string'
});
export type CodeFile = typeof CodeFile.infer;

export const Snippet = type({
  id: 'string',
  title: 'string',
  description: 'string?',
  files: CodeFile.array(),
  createdAt: 'string',
  updatedAt: 'string',
  blobId: 'string'
});
export type Snippet = typeof Snippet.infer;

export const RecentSnippet = type({
  id: 'string',
  title: 'string',
  createdAt: 'string',
  blobId: 'string'
});
export type RecentSnippet = typeof RecentSnippet.infer;

export interface CreateSnippetRequest {
  title: string;
  description?: string;
  files: Omit<CodeFile, 'id'>[];
}

export interface UpdateSnippetRequest {
  title?: string;
  description?: string;
  files?: CodeFile[];
}

export const SUPPORTED_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'html',
  'css',
  'json',
  'markdown',
  'text'
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];
