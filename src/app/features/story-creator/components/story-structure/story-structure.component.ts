import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryNode } from '../../../../core/models/node.model';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-story-structure',
  standalone: true,
  imports: [CommonModule,FormsModule, ButtonComponent],
  template: `
    <div class="story-structure bg-neutral-900 rounded-lg shadow-lg p-6">
      <h3 class="text-xl font-bold mb-4 text-white">Story Structure</h3>
      
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-neutral-300">Nodes ({{ nodes.length }})</h4>
          
          <app-button 
            variant="secondary" 
            size="sm"
            (buttonClick)="createNewNode()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            New Node
          </app-button>
        </div>
        
        @if (nodes.length === 0) {
          <div class="text-center py-8 bg-neutral-800 rounded-md">
            <p class="text-neutral-400">No nodes created yet.</p>
            <p class="text-neutral-400 text-sm mt-2">Click "New Node" to add your first story node.</p>
          </div>
        } @else {
          <div class="max-h-96 overflow-y-auto">
            <table class="w-full">
              <thead class="bg-neutral-800 sticky top-0">
                <tr>
                  <th class="text-left p-3 text-neutral-300">ID</th>
                  <th class="text-left p-3 text-neutral-300">Preview</th>
                  <th class="text-left p-3 text-neutral-300">Choices</th>
                  <th class="text-center p-3 text-neutral-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (node of nodes; track node.id) {
                  <tr class="border-b border-neutral-800 hover:bg-neutral-800/50">
                    <td class="p-3 text-primary-400">{{ node.id }}</td>
                    <td class="p-3 text-neutral-300">
                      {{ node.content.length > 50 ? node.content.substring(0, 50) + '...' : node.content }}
                    </td>
                    <td class="p-3 text-neutral-400">{{ node.choices.length }}</td>
                    <td class="p-3 text-center">
                      <button 
                        (click)="editNode(node)" 
                        class="text-primary-400 hover:text-primary-300 mx-1"
                        aria-label="Edit node"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      
                      <button 
                        (click)="deleteNode(node.id)" 
                        class="text-red-500 hover:text-red-400 mx-1"
                        aria-label="Delete node"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
      
      <div class="mt-6">
        <h4 class="text-neutral-300 mb-2">Story Start Node</h4>
        
        <div class="flex">
          <select 
            [ngModel]="startNodeId" 
            (ngModelChange)="startNodeChanged($event)"
            class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Select a start node</option>
            @for (node of nodes; track node.id) {
              <option [value]="node.id">{{ node.id }}</option>
            }
          </select>
        </div>
        
        @if (!startNodeId && nodes.length > 0) {
          <p class="mt-2 text-yellow-500 text-sm">
            Please select a start node for your story.
          </p>
        }
      </div>
    </div>
  `
})
export class StoryStructureComponent {
  @Input() nodes: StoryNode[] = [];
  @Input() startNodeId = '';
  
  @Output() newNode = new EventEmitter<void>();
  @Output() editNodeRequest = new EventEmitter<StoryNode>();
  @Output() deleteNodeRequest = new EventEmitter<string>();
  @Output() startNodeSelect = new EventEmitter<string>();
  
  createNewNode(): void {
    this.newNode.emit();
  }
  
  editNode(node: StoryNode): void {
    this.editNodeRequest.emit(node);
  }
  
  deleteNode(nodeId: string): void {
    if (confirm(`Are you sure you want to delete node "${nodeId}"?`)) {
      this.deleteNodeRequest.emit(nodeId);
    }
  }
  
  startNodeChanged(nodeId: string): void {
    this.startNodeSelect.emit(nodeId);
  }
}