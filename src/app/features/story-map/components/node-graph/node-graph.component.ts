import { AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  visited: boolean;
}

interface Link {
  source: string;
  target: string;
  label: string;
}

@Component({
  selector: 'app-node-graph',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="graph-container relative w-full h-full bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
      <div class="controls absolute top-4 right-4 flex space-x-2 z-10">
        <button 
          class="px-2 py-1 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors"
          (click)="zoomIn()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <button 
          class="px-2 py-1 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors"
          (click)="zoomOut()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd" />
          </svg>
        </button>
        <button 
          class="px-2 py-1 bg-neutral-800 text-white rounded-md hover:bg-neutral-700 transition-colors"
          (click)="resetZoom()"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
      <svg #svgEl class="w-full h-full"></svg>
    </div>
  `,
  styles: [`
    .node-circle {
      cursor: pointer;
      transition: fill 0.3s ease, stroke-width 0.3s ease;
    }
    
    .node-circle:hover {
      stroke-width: 3px;
    }
    
    .node-label {
      font-size: 12px;
      text-anchor: middle;
      pointer-events: none;
      fill: #fff;
    }
    
    .link {
      stroke-opacity: 0.6;
      stroke-width: 2px;
    }
    
    .link-label {
      font-size: 10px;
      fill: #d4d4d4;
      pointer-events: none;
    }
  `]
})
export class NodeGraphComponent implements AfterViewInit, OnChanges {
  @Input() nodes: Node[] = [];
  @Input() links: Link[] = [];
  @Input() currentNodeId: string | null = null;
  
  @ViewChild('svgEl') svgElement!: ElementRef<SVGElement>;
  
  private svg: any;
  private width = 0;
  private height = 0;
  private simulation: any;
  private zoom: any;
  private g: any;
  
  ngAfterViewInit(): void {
    this.initializeGraph();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['nodes'] || changes['links'] || changes['currentNodeId']) && this.svg) {
      this.updateGraph();
    }
  }
  
  private initializeGraph(): void {
    const element = this.svgElement.nativeElement;
    this.width = element.clientWidth;
    this.height = element.clientHeight;
    
    this.svg = d3.select(element)
      .attr('width', this.width)
      .attr('height', this.height);
    
    // Setup zoom behavior
    this.zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        this.g.attr('transform', event.transform);
      });
    
    this.svg.call(this.zoom);
    
    // Create a group for our graph elements
    this.g = this.svg.append('g');
    
    // Initialize force simulation
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(this.width / 2, this.height / 2))
      .force('collision', d3.forceCollide().radius(50));
    
    this.updateGraph();
  }
  
  private updateGraph(): void {
    if (!this.svg || !this.nodes.length) return;
    
    // Clear previous elements
    this.g.selectAll('*').remove();
    
    // Create links
    const link = this.g.append('g')
      .selectAll('path')
      .data(this.links)
      .enter().append('path')
      .attr('class', 'link')
      .attr('stroke', '#4b5563')
      .attr('marker-end', 'url(#arrowhead)');
    
    // Create arrow marker
    this.svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#4b5563');
    
    // Create nodes
    const node = this.g.append('g')
      .selectAll('g')
      .data(this.nodes)
      .enter().append('g')
      .call(d3.drag()
        .on('start', this.dragStarted.bind(this))
        .on('drag', this.dragged.bind(this))
        .on('end', this.dragEnded.bind(this)));
    
    // Add circles to nodes
    node.append('circle')
      .attr('class', 'node-circle')
      .attr('r', 20)
      .attr('fill', (d: Node) => {
        if (d.id === this.currentNodeId) {
          return '#d946ef'; // Highlight current node
        }
        return d.visited ? '#0ea5e9' : '#1f2937';
      })
      .attr('stroke', (d: Node) => {
        if (d.id === this.currentNodeId) {
          return '#f0abfc';
        }
        return d.visited ? '#7dd3fc' : '#4b5563';
      })
      .attr('stroke-width', 2);
    
    // Add labels to nodes
    node.append('text')
      .attr('class', 'node-label')
      .attr('dy', '.35em')
      .text((d: Node) => d.name);
    
    // Add labels to links
    const linkLabel = this.g.append('g')
      .selectAll('text')
      .data(this.links)
      .enter().append('text')
      .attr('class', 'link-label')
      .text((d: Link) => d.label.length > 15 ? d.label.substring(0, 15) + '...' : d.label);
    
    // Update simulation
    this.simulation
      .nodes(this.nodes)
      .on('tick', () => {
        // Update link positions
        link.attr('d', (d: any) => {
          const dx = d.target.x - d.source.x;
          const dy = d.target.y - d.source.y;
          const dr = Math.sqrt(dx * dx + dy * dy);
          
          return `M${d.source.x},${d.source.y}A${dr},${dr} 0 0,1 ${d.target.x},${d.target.y}`;
        });
        
        // Update node positions
        node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
        
        // Update link label positions
        linkLabel.attr('transform', (d: any) => {
          const x = (d.source.x + d.target.x) / 2;
          const y = (d.source.y + d.target.y) / 2;
          return `translate(${x},${y})`;
        });
      });
    
    this.simulation.force('link').links(this.links);
    this.simulation.alphaTarget(0.3).restart();
    
    // Stop simulation after a while to avoid continuous CPU usage
    setTimeout(() => {
      this.simulation.alphaTarget(0);
    }, 3000);
  }
  
  private dragStarted(event: any, d: any): void {
    if (!event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  private dragged(event: any, d: any): void {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  private dragEnded(event: any, d: any): void {
    if (!event.active) this.simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  zoomIn(): void {
    this.svg.transition().duration(300).call(
      this.zoom.scaleBy, 1.2
    );
  }
  
  zoomOut(): void {
    this.svg.transition().duration(300).call(
      this.zoom.scaleBy, 0.8
    );
  }
  
  resetZoom(): void {
    this.svg.transition().duration(300).call(
      this.zoom.transform, d3.zoomIdentity
    );
  }
}