import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StoryNode, StoryChoice } from '../../../../core/models/node.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-node-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  template: `
    <div class="node-editor bg-neutral-900 rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold mb-4 text-white">
        {{ isNewNode ? 'Create New Node' : 'Edit Node' }}
      </h3>
      
      <div class="mb-4">
        <label class="block text-neutral-300 mb-2">Node ID</label>
        <input 
          type="text" 
          [(ngModel)]="node.id" 
          [disabled]="!isNewNode"
          class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="unique-node-id"
        >
        @if(!isNewNode) {
          <p class="mt-1 text-xs text-neutral-400">Node ID cannot be changed after creation.</p>
        }
      </div>
      
      <div class="mb-4">
        <label class="block text-neutral-300 mb-2">Content (Markdown supported)</label>
        <textarea 
          [(ngModel)]="node.content" 
          rows="6" 
          class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Write your story content here..."
        ></textarea>
      </div>
      
      <div class="mb-4">
        <label class="block text-neutral-300 mb-2">Background Image URL (optional)</label>
        <input 
          type="text" 
          [(ngModel)]="node.metadata!.image" 
          class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="https://example.com/image.jpg"
        >
      </div>
      
      <div class="mb-4">
        <label class="block text-neutral-300 mb-2">Mood</label>
        <select 
          [(ngModel)]="node.metadata!.mood" 
          class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="neutral">Neutral</option>
          <option value="tense">Tense</option>
          <option value="happy">Happy</option>
          <option value="mysterious">Mysterious</option>
          <option value="sad">Sad</option>
        </select>
      </div>
      
      <div class="mb-6">
        <label class="block text-neutral-300 mb-2">Choices</label>
        
        @for (choice of node.choices; track $index) {
          <div class="choice-item mb-4 p-4 bg-neutral-800 rounded-md">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-neutral-200">Choice {{ $index + 1 }}</h4>
              
              <button 
                (click)="removeChoice($index)" 
                class="text-red-400 hover:text-red-300"
                aria-label="Remove choice"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            
            <div class="mb-2">
              <label class="block text-neutral-400 text-sm mb-1">Choice Text</label>
              <input 
                type="text" 
                [(ngModel)]="choice.text" 
                class="w-full px-3 py-2 rounded-md bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="What the player will see as a choice"
              >
            </div>
            
            <div class="mb-2">
              <label class="block text-neutral-400 text-sm mb-1">Next Node ID</label>
              <input 
                type="text" 
                [(ngModel)]="choice.nextNodeId" 
                class="w-full px-3 py-2 rounded-md bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="ID of the node this choice leads to"
              >
            </div>
            
            <div>
              <label class="block text-neutral-400 text-sm mb-1">Consequence (optional)</label>
              <input 
                type="text" 
                [(ngModel)]="choice.consequence" 
                class="w-full px-3 py-2 rounded-md bg-neutral-700 border border-neutral-600 text-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Short description of consequence"
              >
            </div>
          </div>
        }
        
        <app-button 
          variant="secondary" 
          size="sm"
          (buttonClick)="addChoice()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          Add Choice
        </app-button>
      </div>
      
      <div class="flex justify-end space-x-3">
        <app-button 
          variant="outline"
          (buttonClick)="cancel()"
        >
          Cancel
        </app-button>
        
        <app-button 
          (buttonClick)="save()"
        >
          Save Node
        </app-button>
      </div>
    </div>
  `
})
export class NodeEditorComponent {
  @Input() isNewNode = true;
  @Input() node: StoryNode = {
    id: '',
    content: '',
    choices: [],
    metadata: {
      mood: 'neutral',
      image: ''
    }
  };
  
  @Output() saveNode = new EventEmitter<StoryNode>();
  @Output() cancelEdit = new EventEmitter<void>();
  
  addChoice(): void {
    this.node.choices.push({
      text: '',
      nextNodeId: ''
    });
  }
  
  removeChoice(index: number): void {
    this.node.choices.splice(index, 1);
  }
  
  save(): void {
    if (!this.validateNode()) {
      return;
    }
    
    this.saveNode.emit({...this.node});
  }
  
  cancel(): void {
    this.cancelEdit.emit();
  }
  
  private validateNode(): boolean {
    if (!this.node.id.trim()) {
      alert('Node ID is required.');
      return false;
    }
    
    if (!this.node.content.trim()) {
      alert('Node content is required.');
      return false;
    }
    
    // Check if all choices have text and next node ID
    for (let i = 0; i < this.node.choices.length; i++) {
      const choice = this.node.choices[i];
      if (!choice.text.trim() || !choice.nextNodeId.trim()) {
        alert(`Choice ${i + 1} is incomplete. Both text and next node ID are required.`);
        return false;
      }
    }
    
    return true;
  }
}