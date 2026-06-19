import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'pds-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProgressBarComponent {
  @Input() progress = 0; // 0–100

  get clampedProgress(): number {
    return Math.min(100, Math.max(0, this.progress));
  }

  get barWidth(): string {
    const pct = this.clampedProgress;
    return pct === 0 ? '6px' : `${pct}%`;
  }
}
