import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryService } from '../../../core/services/story.service';
import { StorySummary } from '../../../core/models/story.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { StoryCardComponent } from '../components/story-card/story-card.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    StoryCardComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-neutral-950 text-white">
      <app-header></app-header>
      
      <main class="flex-grow">
        <div class="container mx-auto px-4 py-8">
          <div class="mb-8 text-center">
            <h1 class="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
              Story Library
            </h1>
            <p class="text-neutral-400 max-w-2xl mx-auto">
              Choose a story to embark on an interactive adventure where your choices shape the narrative.
            </p>
          </div>
          
          @if (loading()) {
            <div class="flex justify-center py-12">
              <div class="animate-pulse-subtle">
                <svg class="w-12 h-12 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </div>
          } @else if (stories().length === 0) {
            <div class="text-center py-12 bg-neutral-900 rounded-lg">
              <svg class="w-16 h-16 text-neutral-700 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 class="text-xl font-medium mb-2">No Stories Found</h2>
              <p class="text-neutral-400">
                Check back later for new stories or create your own!
              </p>
            </div>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (story of stories(); track story.id) {
                <app-story-card [story]="story"></app-story-card>
              }
            </div>
          }
        </div>
      </main>
    </div>
  `
})
export class LibraryComponent implements OnInit {
  private storyService = inject(StoryService);
  
  stories = signal<StorySummary[]>([]);
  loading = signal<boolean>(true);
  
  ngOnInit(): void {
    this.loadStories();
  }
  
  private loadStories(): void {
    this.storyService.getAllStories().subscribe(
      stories => {
        this.stories.set(stories);
        this.loading.set(false);
      },
      error => {
        console.error('Error loading stories', error);
        this.loading.set(false);
      }
    );
  }
}