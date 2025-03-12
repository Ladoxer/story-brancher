import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  template: `
    <button
      [ngClass]="[
        'px-4 py-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 transform active:scale-95',
        variant === 'primary' ? 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500' : '',
        variant === 'secondary' ? 'bg-secondary-600 hover:bg-secondary-700 text-white focus:ring-secondary-500' : '',
        variant === 'outline' ? 'bg-transparent border border-primary-600 text-primary-700 hover:bg-primary-50 focus:ring-primary-400' : '',
        variant === 'ghost' ? 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400' : '',
        variant === 'danger' ? 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500' : '',
        size === 'sm' ? 'text-sm py-1 px-3' : '',
        size === 'lg' ? 'text-lg py-3 px-6' : '',
        fullWidth ? 'w-full' : '',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        className
      ]"
      [disabled]="disabled"
      [type]="type"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() fullWidth = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() className = '';
  
  @Output() buttonClick = new EventEmitter<MouseEvent>();
  
  handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.buttonClick.emit(event);
    }
  }
}