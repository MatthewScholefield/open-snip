import { nanoid } from 'nanoid';
import { CodeFile, Snippet, type CreateSnippetRequest, type UpdateSnippetRequest, type RecentSnippet } from '../types';
import { dbOperations } from './db';
import { type } from 'arktype';

const BLOBSE_BASE_URL = 'https://blobse.us.to';

export class BlobseError extends Error {
  status: number | undefined;
  response: Response | undefined;

  constructor(
    message: string,
    status?: number,
    response?: Response
  ) {
    super(message);
    this.name = 'BlobseError';
    this.status = status;
    this.response = response;
  }
}

async function handleResponse(response: Response): Promise<any> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.detail || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new BlobseError(errorMessage, response.status, response);
  }

  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

export const blobApi = {
  async createBlob(data: string): Promise<string> {
    const response = await fetch(`${BLOBSE_BASE_URL}/blob/new`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'text/plain',
      },
    });

    const resourceUrl = await handleResponse(response);
    return resourceUrl.split('/').pop(); // Extract blob ID from URL
  },

  async getBlob(blobId: string): Promise<string> {
    const response = await fetch(`${BLOBSE_BASE_URL}/blob/${blobId}`);
    return handleResponse(response);
  },

  async updateBlob(blobId: string, data: string): Promise<void> {
    const response = await fetch(`${BLOBSE_BASE_URL}/blob/${blobId}`, {
      method: 'PUT',
      body: data,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    await handleResponse(response);
  },

  async deleteBlob(blobId: string): Promise<void> {
    const response = await fetch(`${BLOBSE_BASE_URL}/blob/${blobId}`, {
      method: 'DELETE',
    });
    await handleResponse(response);
  },
};

export const snippetApi = {
  async createSnippet(request: CreateSnippetRequest): Promise<Snippet> {
    const now = new Date().toISOString();
    const snippetId = nanoid();

    // Create files with IDs
    const files: CodeFile[] = request.files.map(file => ({
      ...file,
      id: nanoid(),
    }));

    const snippet: Snippet = {
      id: snippetId,
      title: request.title,
      description: request.description,
      files,
      createdAt: now,
      updatedAt: now,
      blobId: '', // Will be set after blob creation
    };

    // Serialize and store snippet data
    const snippetData = JSON.stringify(snippet);
    const blobId = await blobApi.createBlob(snippetData);
    
    snippet.blobId = blobId;
    
    // Update blob with correct blobId
    const updatedSnippetData = JSON.stringify(snippet);
    await blobApi.updateBlob(blobId, updatedSnippetData);

    // Store in recent snippets
    const recentSnippet: RecentSnippet = {
      id: snippet.id,
      title: snippet.title,
      createdAt: snippet.createdAt,
      blobId: snippet.blobId,
    };
    await dbOperations.addRecentSnippet(recentSnippet);

    return snippet;
  },

  async getSnippet(blobId: string): Promise<Snippet> {
    const snippetData = await blobApi.getBlob(blobId);
    const parsed = JSON.parse(snippetData);
    
    // Validate using ArkType
    const result = Snippet(parsed);
    if (result instanceof type.errors) {
      throw new Error(`Invalid snippet data: ${result.summary}`);
    }
    
    return result;
  },

  async updateSnippet(blobId: string, request: UpdateSnippetRequest): Promise<Snippet> {
    const snippet = await this.getSnippet(blobId);
    const now = new Date().toISOString();

    const updatedSnippet: Snippet = {
      ...snippet,
      ...request,
      updatedAt: now,
    };

    const snippetData = JSON.stringify(updatedSnippet);
    await blobApi.updateBlob(blobId, snippetData);

    return updatedSnippet;
  },

  async deleteSnippet(blobId: string): Promise<void> {
    await blobApi.deleteBlob(blobId);
    
    // Remove from recent snippets
    const recentSnippets = await dbOperations.getRecentSnippets();
    const snippetToRemove = recentSnippets.find(s => s.blobId === blobId);
    if (snippetToRemove) {
      await dbOperations.removeRecentSnippet(snippetToRemove.id);
    }
  },
};
