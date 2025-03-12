import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/story-library/pages/library.component').then(m => m.LibraryComponent),
    title: 'Story Library'
  },
  {
    path: 'story/:id',
    loadComponent: () => import('./features/story-player/pages/story-player.component').then(m => m.StoryPlayerComponent),
    title: 'Interactive Story'
  },
  {
    path: 'map/:id',
    loadComponent: () => import('./features/story-map/pages/story-map.component').then(m => m.StoryMapComponent),
    title: 'Story Map'
  },
  {
    path: 'creator',
    loadComponent: () => import('./features/story-creator/pages/story-creator.component').then(m => m.StoryCreatorComponent),
    title: 'Story Creator'
  },
  {
    path: '**',
    redirectTo: ''
  }
];