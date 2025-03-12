import { StoryNode } from './node.model';

export interface Story {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  description: string;
  genre: StoryGenre;
  startNodeId: string;
  nodes: Record<string, StoryNode>;
  created: Date;
  modified: Date;
}

export type StoryGenre = 'fantasy' | 'sci-fi' | 'mystery' | 'horror' | 'romance' | 'adventure' | 'other';

export interface StorySummary {
  id: string;
  title: string;
  author: string;
  coverImage?: string;
  description: string;
  genre: StoryGenre;
  nodeCount: number;
}

export interface BookmarkedPath {
  storyId: string;
  nodeId: string;
  path: string[];
  savedAt: Date;
  note?: string;
}