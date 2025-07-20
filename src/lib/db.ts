import Dexie, { type EntityTable } from 'dexie';
import type { RecentSnippet } from '../types';

export interface RecentSnippetRecord {
  id: string;
  title: string;
  createdAt: string;
  blobId: string;
}

export class SnippetDatabase extends Dexie {
  recentSnippets!: EntityTable<RecentSnippetRecord, 'id'>;

  constructor() {
    super('SnippetDatabase');
    this.version(1).stores({
      recentSnippets: 'id, createdAt, title, blobId'
    });
  }
}

export const db = new SnippetDatabase();

export const dbOperations = {
  async addRecentSnippet(snippet: RecentSnippet): Promise<void> {
    await db.recentSnippets.put(snippet);
  },

  async getRecentSnippets(limit = 20): Promise<RecentSnippet[]> {
    return await db.recentSnippets
      .orderBy('createdAt')
      .reverse()
      .limit(limit)
      .toArray();
  },

  async removeRecentSnippet(id: string): Promise<void> {
    await db.recentSnippets.delete(id);
  },

  async clearRecentSnippets(): Promise<void> {
    await db.recentSnippets.clear();
  }
};
