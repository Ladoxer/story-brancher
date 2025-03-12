import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-progress-tracker',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="progress-tracker p-4 bg-neutral-800 rounded-lg shadow-md">
      <div class="flex justify-between items-center mb-4">
        <span class="text-neutral-300 text-sm">Progress: {{ visitedNodes.length }} / {{ totalNodes }}</span>
        
        <div class="flex space-x-2">
          <app-button 
            variant="outline" 
            size="sm" 
            [disabled]="!canGoBack"
            (buttonClick)="goBack.emit()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
            </svg>
            Back
          </app-button>
          
          <app-button 
            variant="outline" 
            size="sm"
            (buttonClick)="showMap.emit()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12 1.586l-4 4H2a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V6.586l-4-4H12zM6 6h2.293L10 4.293 11.707 6H14v8H6V6z" clip-rule="evenodd" />
            </svg>
            Story Map
          </app-button>
          
          <app-button 
            variant="outline" 
            size="sm"
            (buttonClick)="saveBookmark.emit()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
            </svg>
            Bookmark
          </app-button>
        </div>
      </div>
      
      <div class="progress-bar w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
        <div 
          class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-500 ease-out"
          [style.width.%]="progressPercentage"
        ></div>
      </div>
    </div>
  `
})
export class ProgressTrackerComponent {
  @Input() visitedNodes: string[] = [];
  @Input() totalNodes = 0;
  @Input() canGoBack = false;
  
  @Output() goBack = new EventEmitter<void>();
  @Output() showMap = new EventEmitter<void>();
  @Output() saveBookmark = new EventEmitter<void>();
  
  get progressPercentage(): number {
    if (this.totalNodes === 0) return 0;
    return (this.visitedNodes.length / this.totalNodes) * 100;
  }
}