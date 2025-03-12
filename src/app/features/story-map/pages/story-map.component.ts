import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StoryService } from '../../../core/services/story.service';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { NodeGraphComponent } from '../components/node-graph/node-graph.component';

@Component({
  selector: 'app-story-map',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    HeaderComponent,
    ButtonComponent,
    NodeGraphComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-neutral-950 text-white">
      <app-header></app-header>
      
      <main class="flex-grow">
        <div class="container mx-auto px-4 py-8">
          <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">
              Story Map: <span class="text-primary-400">{{ storyTitle() }}</span>
            </h1>
            
            <app-button 
              variant="outline"
              (buttonClick)="navigateToStory()"
            >
              Return to Story
            </app-button>
          </div>
          
          <div class="bg-neutral-900 rounded-lg shadow-lg p-4 mb-6">
            <p class="text-neutral-300">
              This map shows the structure of your story. Nodes represent story segments,
              and connections represent choices. Blue nodes have been visited, while gray nodes 
              are yet to be discovered. The highlighted purple node is your current position.
            </p>
          </div>
          
          <div class="graph-wrapper h-[600px] bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
            <app-node-graph
              [nodes]="graphData().nodes"
              [links]="graphData().links"
              [currentNodeId]="currentNodeId()"
            ></app-node-graph>
          </div>
        </div>
      </main>
    </div>
  `
})
export class StoryMapComponent implements OnInit {
  private storyService = inject(StoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  storyTitle = signal<string>('');
  graphData = signal<{nodes: any[], links: any[]}>({ nodes: [], links: [] });
  currentNodeId = computed(() => this.storyService.currentNode()?.id || null);
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const storyId = params['id'];
      if (storyId) {
        // Get story title
        if (this.storyService.currentStory()?.id === storyId) {
          this.storyTitle.set(this.storyService.currentStory()?.title || '');
        }
        
        // Get graph data
        this.storyService.getStoryMap(storyId).subscribe(data => {
          this.graphData.set(data);
        });
      } else {
        this.router.navigate(['/library']);
      }
    });
  }
  
  navigateToStory(): void {
    const storyId = this.route.snapshot.params['id'];
    if (storyId) {
      this.router.navigate(['/story', storyId]);
    }
  }
}