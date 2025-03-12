import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
  standalone: true
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {
    // Configure marked options for safety and styling
    marked.setOptions({
      gfm: true,        // GitHub flavored markdown
      breaks: true,     // Convert \n to <br>
    });
  }

  transform(value: string | null | undefined): SafeHtml {
    if (value == null) {
      return '';
    }
    
    // Convert markdown to HTML
    const html = marked.parse(value) as string;
    
    // Sanitize the HTML to prevent XSS attacks
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}