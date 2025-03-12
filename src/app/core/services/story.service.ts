import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Story, StorySummary, BookmarkedPath } from '../models/story.model';
import { StoryNode } from '../models/node.model';
import { Observable, catchError, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  private http = inject(HttpClient);
  
  // Using signals for reactive state management
  currentStory = signal<Story | null>(null);
  currentNode = signal<StoryNode | null>(null);
  visitedNodes = signal<string[]>([]);
  storyHistory = signal<string[]>([]);
  
  loadStory(storyId: string): Observable<boolean> {
    return this.http.get<Story>(`assets/stories/${storyId}.json`)
      .pipe(
        tap(story => {
          this.currentStory.set(story);
          this.visitedNodes.set([]);
          this.storyHistory.set([]);
          this.navigateToNode(story.startNodeId);
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }
  
  navigateToNode(nodeId: string): void {
    const story = this.currentStory();
    if (!story) return;
    
    const node = story.nodes[nodeId];
    if (!node) return;
    
    this.currentNode.set(node);
    
    // Update visited nodes
    const visited = this.visitedNodes();
    if (!visited.includes(nodeId)) {
      this.visitedNodes.set([...visited, nodeId]);
    }
    
    // Update history
    this.storyHistory.update(history => [...history, nodeId]);
  }
  
  getAllStories(): Observable<StorySummary[]> {
    return this.http.get<StorySummary[]>('assets/stories/index.json')
      .pipe(
        catchError(() => of([]))
      );
  }
  
  getStoryMap(storyId: string): Observable<any> {
    return this.http.get<Story>(`assets/stories/${storyId}.json`)
      .pipe(
        map(story => {
          // Create nodes and links for D3 visualization
          const nodes = Object.values(story.nodes).map(node => ({
            id: node.id,
            name: node.id,
            visited: this.visitedNodes().includes(node.id)
          }));
          
          const links = [];
          for (const nodeId in story.nodes) {
            const node = story.nodes[nodeId];
            for (const choice of node.choices) {
              links.push({
                source: nodeId,
                target: choice.nextNodeId,
                label: choice.text
              });
            }
          }
          
          return { nodes, links };
        }),
        catchError(() => of({ nodes: [], links: [] }))
      );
  }
  
  goBack(): void {
    const history = this.storyHistory();
    if (history.length <= 1) return;
    
    // Remove current node
    const newHistory = history.slice(0, -1);
    this.storyHistory.set(newHistory);
    
    // Navigate to previous node
    const previousNodeId = newHistory[newHistory.length - 1];
    const story = this.currentStory();
    if (!story) return;
    
    this.currentNode.set(story.nodes[previousNodeId]);
  }
}