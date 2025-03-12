import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { StoryService } from '../../../core/services/story.service';
import { BookmarkService } from '../../../core/services/bookmark.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { StoryContentComponent } from '../components/story-content/story-content.component';
import { ProgressTrackerComponent } from '../components/progress-tracker/progress-tracker.component';
import { StoryChoice } from '../../../core/models/node.model';

@Component({
  selector: 'app-story-player',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    ButtonComponent,
    StoryContentComponent,
    ProgressTrackerComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-neutral-950 text-white">
      <app-header></app-header>
      
      <main class="flex-grow">
        <div class="container mx-auto px-4 py-8">
          <!-- Story Header -->
          @if (story()) {
            <div class="mb-8">
              <h1 class="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
                {{ story()?.title }}
              </h1>
              <p class="text-neutral-400">by {{ story()?.author }}</p>
            </div>
          }
          
          <!-- Progress Tracker -->
          <div class="mb-6">
            <app-progress-tracker
              [visitedNodes]="visitedNodes()"
              [totalNodes]="totalNodes()"
              [canGoBack]="canGoBack()"
              (goBack)="handleGoBack()"
              (showMap)="showStoryMap()"
              (saveBookmark)="saveBookmark()"
            ></app-progress-tracker>
          </div>
          
          <!-- Story Content -->
          <div class="story-container">
            <app-story-content
              [storyNode]="currentNode()"
              (choiceMade)="handleChoice($event)"
            ></app-story-content>
          </div>
        </div>
      </main>
      
      <footer class="py-4 bg-neutral-900 text-center text-neutral-400 text-sm">
        <div class="container mx-auto">
          <p>Interactive Story Brancher &copy; {{ currentYear }}</p>
        </div>
      </footer>
    </div>
  `
})
export class StoryPlayerComponent implements OnInit {
  private storyService = inject(StoryService);
  private bookmarkService = inject(BookmarkService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  // Get reactive signals from services
  story = this.storyService.currentStory;
  currentNode = this.storyService.currentNode;
  visitedNodes = this.storyService.visitedNodes;
  
  totalNodes = signal<number>(0);
  canGoBack = computed(() => this.storyService.storyHistory().length > 1);
  currentYear = new Date().getFullYear();
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const storyId = params['id'];
      if (storyId) {
        this.storyService.loadStory(storyId).subscribe(success => {
          if (success && this.story()) {
            this.totalNodes.set(Object.keys(this.story()!.nodes).length);
          } else {
            this.router.navigate(['/library']);
          }
        });
      }
    });
  }
  
  handleChoice(choice: StoryChoice): void {
    this.storyService.navigateToNode(choice.nextNodeId);
  }
  
  handleGoBack(): void {
    this.storyService.goBack();
  }
  
  showStoryMap(): void {
    const storyId = this.story()?.id;
    if (storyId) {
      this.router.navigate(['/map', storyId]);
    }
  }
  
  saveBookmark(): void {
    const story = this.story();
    const currentNode = this.currentNode();
    if (story && currentNode) {
      this.bookmarkService.addBookmark(
        story.id,
        currentNode.id,
        this.storyService.storyHistory(),
        undefined
      );
      
      // Show a notification (you can add a notification service for this)
      alert('Bookmark saved successfully!');
    }
  }
}