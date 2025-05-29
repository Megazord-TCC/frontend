import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-icon',
  imports: [],
  templateUrl: './svg-icon.component.html',
  styleUrl: './svg-icon.component.scss'
})
export class SvgIconComponent implements OnChanges{
   @Input() path: string = '';

  @Input() size!: number;  

  svgContent: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges() {
    this.loadSvg();
  }

  private async loadSvg() {
    if (!this.path) return;

    const response = await fetch(this.path);
    let svgText = await response.text();

    // Remove qualquer fill existente para permitir controle via CSS
    svgText = svgText.replace(/fill="[^"]*"/g, '');
    svgText = svgText.replace(/<svg([^>]*)>/, `<svg$1 fill="currentColor">`);

    this.svgContent = this.sanitizer.bypassSecurityTrustHtml(svgText);
  }
}
