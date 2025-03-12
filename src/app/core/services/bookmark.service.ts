import { Injectable, signal } from '@angular/core';
import { BookmarkedPath } from '../models/story.model';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private readonly STORAGE_KEY = 'story_bookmarks';
  
  bookmarks = signal<BookmarkedPath[]>([]);
  
  constructor() {
    this.loadBookmarks();
  }
  
  addBookmark(storyId: string, nodeId: string, path: string[], note?: string): void {
    const bookmark: BookmarkedPath = {
      storyId,
      nodeId,
      path,
      savedAt: new Date(),
      note
    };
    
    this.bookmarks.update(bookmarks => [...bookmarks, bookmark]);
    this.saveBookmarks();
  }
  
  removeBookmark(storyId: string, nodeId: string): void {
    this.bookmarks.update(bookmarks => 
      bookmarks.filter(b => !(b.storyId === storyId && b.nodeId === nodeId))
    );
    this.saveBookmarks();
  }
  
  private saveBookmarks(): void {
    const bookmarks = this.bookmarks();
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bookmarks));
  }
  
  private loadBookmarks(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const bookmarks = JSON.parse(stored) as BookmarkedPath[];
        // Convert saved dates back to Date objects
        bookmarks.forEach(b => b.savedAt = new Date(b.savedAt));
        this.bookmarks.set(bookmarks);
      }
    } catch (error) {
      console.error('Error loading bookmarks', error);
    }
  }
}