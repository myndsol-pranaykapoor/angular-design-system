import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { PopupLayoutComponent } from '../popup-layout/popup-layout.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { PopUpFooterComponent } from '../pop-up-footer/pop-up-footer.component';

export type SemanticPopupType = 'success' | 'warning' | 'error';

interface SemanticConfig {
  icon: string; iconColor: string; illustration: string;
  defaultTitle: string; defaultSubtitle: string;
}

const CONFIG: Record<SemanticPopupType, SemanticConfig> = {
  success: { icon: 'check-inside-circle', iconColor: '#51b389', illustration: 'man-celebrating',
              defaultTitle: 'Success', defaultSubtitle: 'The action was completed successfully.' },
  warning: { icon: 'alert-triangle',      iconColor: '#ff9800', illustration: 'announcement',
              defaultTitle: 'Warning', defaultSubtitle: 'Please review before proceeding.' },
  error:   { icon: 'x-circle',            iconColor: '#f44336', illustration: 'faq',
              defaultTitle: 'Error', defaultSubtitle: 'Something went wrong. Please try again.' },
};

@Component({
  selector: 'pds-semantic-popup',
  standalone: true,
  imports: [PopupLayoutComponent, PopUpHeaderComponent, PopUpFooterComponent],
  templateUrl: './semantic-popup.component.html',
  styleUrl: './semantic-popup.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SemanticPopupComponent {
  @Input() type: SemanticPopupType = 'success';
  @Input() visible = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() confirmLabel = 'Confirm';
  @Input() cancelLabel = 'Cancel';
  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  get config(): SemanticConfig { return CONFIG[this.type]; }
  get resolvedTitle(): string { return this.title || this.config.defaultTitle; }
  get resolvedSubtitle(): string { return this.subtitle || this.config.defaultSubtitle; }
  onConfirm(): void { this.confirmed.emit(); this.closed.emit(); }
  onCancel(): void  { this.cancelled.emit(); this.closed.emit(); }
}
