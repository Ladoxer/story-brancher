// src/app/features/story-creator/pages/story-creator.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NodeEditorComponent } from '../components/node-editor/node-editor.component';
import { StoryStructureComponent } from '../components/story-structure/story-structure.component';
import { StoryNode } from '../../../core/models/node.model';
import { Story, StoryGenre } from '../../../core/models/story.model';

@Component({
  selector: 'app-story-creator',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    ButtonComponent,
    NodeEditorComponent,
    StoryStructureComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-neutral-950 text-white">
      <app-header></app-header>
      
      <main class="flex-grow">
        <div class="container mx-auto px-4 py-8">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-3xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 text-transparent bg-clip-text">
              Story Creator
            </h1>
            
            <div class="flex space-x-3">
              <app-button 
                variant="outline"
                (buttonClick)="exportStory()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Export
              </app-button>
              
              <app-button 
                variant="primary"
                (buttonClick)="saveStory()"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 inline" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Save Story
              </app-button>
            </div>
          </div>
          
          <!-- Story Details Form -->
          <div class="bg-neutral-900 rounded-lg shadow-lg p-6 mb-6">
            <h2 class="text-xl font-bold mb-4 text-white">Story Details</h2>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-neutral-300 mb-2">Title</label>
                <input 
                  type="text" 
                  [(ngModel)]="storyDetails.title" 
                  class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your story title"
                >
              </div>
              
              <div>
                <label class="block text-neutral-300 mb-2">Author</label>
                <input 
                  type="text" 
                  [(ngModel)]="storyDetails.author" 
                  class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Your name"
                >
              </div>
              
              <div>
                <label class="block text-neutral-300 mb-2">Genre</label>
                <select 
                  [(ngModel)]="storyDetails.genre" 
                  class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="fantasy">Fantasy</option>
                  <option value="sci-fi">Science Fiction</option>
                  <option value="mystery">Mystery</option>
                  <option value="horror">Horror</option>
                  <option value="romance">Romance</option>
                  <option value="adventure">Adventure</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label class="block text-neutral-300 mb-2">Cover Image URL (optional)</label>
                <input 
                  type="text" 
                  [(ngModel)]="storyDetails.coverImage" 
                  class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="https://example.com/image.jpg"
                >
              </div>
              
              <div class="md:col-span-2">
                <label class="block text-neutral-300 mb-2">Description</label>
                <textarea 
                  [(ngModel)]="storyDetails.description" 
                  rows="3" 
                  class="w-full px-4 py-2 rounded-md bg-neutral-800 border border-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="A brief description of your story..."
                ></textarea>
              </div>
            </div>
          </div>
          
          <!-- Story Structure/Node Editor Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Story Structure Panel -->
            <div>
              <app-story-structure
                [nodes]="nodes()"
                [startNodeId]="startNodeId()"
                (newNode)="createNewNode()"
                (editNodeRequest)="editNode($event)"
                (deleteNodeRequest)="deleteNode($event)"
                (startNodeSelect)="setStartNode($event)"
              ></app-story-structure>
            </div>
            
            <!-- Node Editor Panel -->
            @if (showNodeEditor()) {
              <div>
                <app-node-editor
                  [isNewNode]="isNewNode()"
                  [node]="currentNode()"
                  (saveNode)="saveNode($event)"
                  (cancelEdit)="cancelNodeEdit()"
                ></app-node-editor>
              </div>
            }
          </div>
        </div>
      </main>
    </div>
  `
})
export class StoryCreatorComponent {
  nodes = signal<StoryNode[]>([]);
  startNodeId = signal<string>('');
  showNodeEditor = signal<boolean>(false);
  isNewNode = signal<boolean>(true);
  currentNode = signal<StoryNode>({
    id: '',
    content: '',
    choices: [],
    metadata: {
      mood: 'neutral',
      image: ''
    }
  });
  
  storyDetails = {
    title: '',
    author: '',
    description: '',
    genre: 'fantasy' as StoryGenre,
    coverImage: '',
  };
  
  createNewNode(): void {
    this.isNewNode.set(true);
    this.currentNode.set({
      id: '',
      content: '',
      choices: [],
      metadata: {
        mood: 'neutral',
        image: ''
      }
    });
    this.showNodeEditor.set(true);
  }
  
  editNode(node: StoryNode): void {
    this.isNewNode.set(false);
    this.currentNode.set({...node});
    this.showNodeEditor.set(true);
  }
  
  saveNode(node: StoryNode): void {
    const currentNodes = this.nodes();
    
    if (this.isNewNode()) {
      // Check if node ID already exists
      if (currentNodes.some(n => n.id === node.id)) {
        alert(`A node with ID "${node.id}" already exists. Please choose a different ID.`);
        return;
      }
      
      // Add new node
      this.nodes.set([...currentNodes, node]);
    } else {
      // Update existing node
      const updatedNodes = currentNodes.map(n => 
        n.id === node.id ? node : n
      );
      this.nodes.set(updatedNodes);
    }
    
    this.showNodeEditor.set(false);
  }
  
  cancelNodeEdit(): void {
    this.showNodeEditor.set(false);
  }
  
  deleteNode(nodeId: string): void {
    const currentNodes = this.nodes();
    
    // Check if node is the start node
    if (nodeId === this.startNodeId()) {
      this.startNodeId.set('');
    }
    
    // Remove node
    this.nodes.set(currentNodes.filter(n => n.id !== nodeId));
    
    // Update references in other nodes
    const updatedNodes = this.nodes().map(node => {
      const updatedChoices = node.choices.map(choice => {
        if (choice.nextNodeId === nodeId) {
          // Mark broken links
          return {...choice, nextNodeId: 'REMOVED'};
        }
        return choice;
      });
      
      return {...node, choices: updatedChoices};
    });
    
    this.nodes.set(updatedNodes);
  }
  
  setStartNode(nodeId: string): void {
    this.startNodeId.set(nodeId);
  }
  
  saveStory(): void {
    if (!this.validateStory()) {
      return;
    }
    
    const story: Story = {
      id: this.generateStoryId(),
      title: this.storyDetails.title,
      author: this.storyDetails.author,
      description: this.storyDetails.description,
      genre: this.storyDetails.genre,
      coverImage: this.storyDetails.coverImage || undefined,
      startNodeId: this.startNodeId(),
      nodes: this.createNodesMap(),
      created: new Date(),
      modified: new Date()
    };
    
    // Here you would typically save to a database or local storage
    alert('Story saved successfully!');
    console.log('Story saved:', story);
  }
  
  exportStory(): void {
    if (!this.validateStory()) {
      return;
    }
    
    const story: Story = {
      id: this.generateStoryId(),
      title: this.storyDetails.title,
      author: this.storyDetails.author,
      description: this.storyDetails.description,
      genre: this.storyDetails.genre,
      coverImage: this.storyDetails.coverImage || undefined,
      startNodeId: this.startNodeId(),
      nodes: this.createNodesMap(),
      created: new Date(),
      modified: new Date()
    };
    
    // Create a download link for the story JSON
    const blob = new Blob([JSON.stringify(story, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.storyDetails.title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  private validateStory(): boolean {
    // Check story details
    if (!this.storyDetails.title.trim()) {
      alert('Please enter a story title.');
      return false;
    }
    
    if (!this.storyDetails.author.trim()) {
      alert('Please enter an author name.');
      return false;
    }
    
    if (!this.storyDetails.description.trim()) {
      alert('Please enter a story description.');
      return false;
    }
    
    // Check nodes
    if (this.nodes().length === 0) {
      alert('Your story needs at least one node.');
      return false;
    }
    
    // Check start node
    if (!this.startNodeId()) {
      alert('Please select a start node for your story.');
      return false;
    }
    
    // Check for broken links
    const brokenLinks = this.checkForBrokenLinks();
    if (brokenLinks.length > 0) {
      alert(`Found broken links in your story: ${brokenLinks.join(', ')}`);
      return false;
    }
    
    return true;
  }
  
  private checkForBrokenLinks(): string[] {
    const brokenLinks: string[] = [];
    const nodeIds = new Set(this.nodes().map(node => node.id));
    
    this.nodes().forEach(node => {
      node.choices.forEach(choice => {
        if (choice.nextNodeId && choice.nextNodeId !== 'REMOVED' && !nodeIds.has(choice.nextNodeId)) {
          brokenLinks.push(`"${node.id}" -> "${choice.nextNodeId}"`);
        }
      });
    });
    
    return brokenLinks;
  }
  
  private createNodesMap(): Record<string, StoryNode> {
    const nodesMap: Record<string, StoryNode> = {};
    
    this.nodes().forEach(node => {
      nodesMap[node.id] = { ...node };
    });
    
    return nodesMap;
  }
  
  private generateStoryId(): string {
    return this.storyDetails.title.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .substring(0, 30) + 
      '-' + 
      Date.now().toString(36);
  }
}