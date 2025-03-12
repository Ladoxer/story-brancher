import { Component, Input, Output, EventEmitter, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarkdownPipe } from '../../../../shared/pipes/markdown.pipe';
import { StoryNode, StoryChoice } from '../../../../core/models/node.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-story-content',
  standalone: true,
  imports: [CommonModule, MarkdownPipe],
  template: `
    <div class="story-content" 
         [ngClass]="{'animate-fade-in': animateIn()}"
         [ngStyle]="{'background-image': node?.metadata?.image ? 'url(' + node?.metadata?.image + ')' : ''}">
      
      <div class="content-wrapper p-6 bg-neutral-900 bg-opacity-90 rounded-lg shadow-lg text-white">
        <!-- Story content -->
        <div class="prose prose-lg prose-invert max-w-none mb-8">
          <div [innerHTML]="node?.content | markdown"></div>
        </div>
        
        <!-- Choices -->
        <div class="choices-container mt-6 space-y-3">
          <h3 class="text-lg font-medium text-neutral-200 mb-3">What will you do?</h3>
          
          @for (choice of node?.choices || []; track choice.nextNodeId) {
            <button 
              (click)="chooseOption(choice)"
              class="choice-button w-full text-left p-4 rounded-md border border-primary-700 bg-neutral-800 hover:bg-primary-900 hover:border-primary-500 transition-colors duration-200 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
            >
              {{ choice.text }}
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .story-content {
      position: relative;
      background-size: cover;
      background-position: center;
      border-radius: 0.5rem;
      overflow: hidden;
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .content-wrapper {
      width: 100%;
      max-width: 800px;
    }
    
    .choice-button {
      position: relative;
      overflow: hidden;
    }
    
    .choice-button::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, transparent, rgba(14, 165, 233, 0.2), transparent);
      transform: translateX(-100%);
      transition: transform 0.5s ease;
    }
    
    .choice-button:hover::after {
      transform: translateX(100%);
    }
  `],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class StoryContentComponent {
  @Input() set storyNode(value: StoryNode | null) {
    this._node.set(value);
    if (value) {
      this.animateIn.set(true);
      setTimeout(() => this.animateIn.set(false), 500);
    }
  }
  
  get node(): StoryNode | null {
    return this._node();
  }
  
  @Output() choiceMade = new EventEmitter<StoryChoice>();
  
  private _node = signal<StoryNode | null>(null);
  animateIn = signal(false);
  
  chooseOption(choice: StoryChoice): void {
    this.choiceMade.emit(choice);
  }
}