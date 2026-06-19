import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ProgressBarComponent } from '../progress-bar/progress-bar.component';

export type FileRowState = 'success' | 'failed' | 'in-process';

@Component({
  selector: 'pds-file-row',
  standalone: true,
  imports: [ButtonComponent, ProgressBarComponent],
  templateUrl: './file-row.component.html',
  styleUrl: './file-row.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class FileRowComponent {
  @Input() state: FileRowState = 'success';
  @Input() fileName = 'file.long.name.pdf';

  /** success — file size text (e.g. "500 MB") */
  @Input() fileSize = '500 MB';
  /** failed — status text */
  @Input() failedText = 'Failed!';
  /** in-process — upload progress 0–100 */
  @Input() progress = 50;

  @Output() cancel = new EventEmitter<void>();

  /** Leading status icon per state */
  get icon(): string {
    if (this.state === 'success') return 'check-inside-circle';
    if (this.state === 'failed')  return 'x-circle';
    return 'circle';                                  // in-process
  }

  get hostClasses(): string[] {
    return ['pds-file-row', `pds-file-row--${this.state}`];
  }
}
