import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StorySummary } from '../../../../core/models/story.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-story-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div 
      class="story-card bg-neutral-900 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:scale-105 hover:shadow-highlight"
    >
      <!-- Cover Image or Placeholder -->
      <div 
        class="h-48 bg-cover bg-center relative" 
        [style.backgroundImage]="story.coverImage ? 'url(' + story.coverImage + ')' : 'linear-gradient(to right, #0284c7, #7dd3fc)'"
      >
        <!-- Genre Badge -->
        <div class="absolute top-3 right-3 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded">
          {{ story.genre | titlecase }}
        </div>
      </div>
      
      <!-- Content -->
      <div class="p-4">
        <h3 class="text-xl font-bold mb-2 text-white">{{ story.title }}</h3>
        <p class="text-neutral-400 text-sm mb-2">by {{ story.author }}</p>
        
        <p class="text-neutral-300 text-sm mb-4 line-clamp-3">{{ story.description }}</p>
        
        <div class="flex justify-between items-center">
          <span class="text-xs text-neutral-400">{{ story.nodeCount }} segments</span>
          
          <app-button 
            variant="primary"
            size="sm"
            [routerLink]="['/story', story.id]"
          >
            Start Reading
          </app-button>
        </div>
      </div>
    </div>
  `
})
export class StoryCardComponent {
  @Input() story!: StorySummary;
}