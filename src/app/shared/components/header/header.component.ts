import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="bg-neutral-900 text-white shadow-lg">
      <div class="container mx-auto px-4 py-3">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
            </svg>
            <h1 class="text-xl font-bold tracking-tight">
              <span class="text-primary-400">Story</span>
              <span class="text-secondary-400">Brancher</span>
            </h1>
          </div>
          
          <nav>
            <ul class="flex space-x-6">
              <li>
                <a 
                  routerLink="/" 
                  routerLinkActive="text-primary-400 font-medium"
                  [routerLinkActiveOptions]="{exact: true}" 
                  class="text-gray-300 hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a 
                  routerLink="/library" 
                  routerLinkActive="text-primary-400 font-medium"
                  class="text-gray-300 hover:text-white transition-colors duration-200">
                  Library
                </a>
              </li>
              <li>
                <a 
                  routerLink="/creator" 
                  routerLinkActive="text-primary-400 font-medium"
                  class="text-gray-300 hover:text-white transition-colors duration-200">
                  Create
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {}