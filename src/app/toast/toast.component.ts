import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';

export type ToastType = 'success' | 'warning' | 'error';

const TOAST_CONFIG: Record<ToastType, { iconColor: string; titleColor: string; borderColor: string; bgColor: string; icon: string }> = {
  success: { iconColor: '#51b389', titleColor: '#51b389', borderColor: '#51b389', bgColor: '#f8fff9', icon: 'check-circle' },
  warning: { iconColor: '#ff9800', titleColor: '#ff9800', borderColor: '#ff9800', bgColor: '#fffff7', icon: 'alert-triangle' },
  error:   { iconColor: '#f44336', titleColor: '#f44336', borderColor: '#f44336', bgColor: '#fff3f3', icon: 'alert-circle'  },
};

@Component({
  selector: 'pds-toast',
  standalone: true,
  imports: [PopUpHeaderComponent],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ToastComponent implements OnChanges {
  @Input() type: ToastType = 'success';
  @Input() message = '';
  @Input() visible = false;

  @Output() dismissed = new EventEmitter<void>();

  protected showing = false;
  private dismissTimer: ReturnType<typeof setTimeout> | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible']) {
      if (this.visible) {
        this.showing = true;
      }
    }
  }

  get config() { return TOAST_CONFIG[this.type]; }

  dismiss(): void {
    this.showing = false;
    this.dismissTimer = setTimeout(() => this.dismissed.emit(), 350);
  }

  ngOnDestroy(): void {
    if (this.dismissTimer) clearTimeout(this.dismissTimer);
  }
}
