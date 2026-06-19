import { Component, Input, Output, EventEmitter, HostBinding, ViewEncapsulation } from '@angular/core';
import { CardHeaderComponent } from '../card-header/card-header.component';
import { CardFooterComponent } from '../card-footer/card-footer.component';

export type ToolTipDirection = 'up' | 'down' | 'left' | 'right';

@Component({
  selector: 'pds-tool-tip',
  standalone: true,
  imports: [CardHeaderComponent, CardFooterComponent],
  templateUrl: './tool-tip.component.html',
  styleUrl: './tool-tip.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ToolTipComponent {
  @Input() direction: ToolTipDirection = 'up';
  @Input() title = 'Title Text';
  @Input() subtitle = 'Long tool-tip description will show here.';
  @Input() showFooter = true;
  @Input() actionLabel = 'Action';
  /** Body width (px) */
  @Input() width = 240;

  @Output() actionClick = new EventEmitter<void>();

  @HostBinding('class') get hostClass(): string {
    return `pds-tool-tip pds-tool-tip--${this.direction}`;
  }
}
