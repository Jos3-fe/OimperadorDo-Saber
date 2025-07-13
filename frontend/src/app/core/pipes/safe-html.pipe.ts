// src/app/shared/pipes/safe-html.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true // <--- THIS IS CRUCIAL
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string | undefined): SafeHtml {
    // Handle undefined/null case gracefully for the pipe
    return this.sanitizer.bypassSecurityTrustHtml(value || '');
  }
}