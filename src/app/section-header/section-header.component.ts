import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ButtonComponent, ButtonContent, ButtonType } from '../button/button.component';

@Component({
  selector: 'pds-section-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './section-header.component.html',
  styleUrl: './section-header.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SectionHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() iconColor = 'var(--pds-primary-3)';
  @Input() titleColor = '';

  @Input() showIcon = true;
  @Input() showTitle = true;
  @Input() showSubtitle = false;

  @Input() showButton1 = true;
  @Input() showButton2 = true;
  @Input() showButton3 = true;
  @Input() showButton4 = true;

  @Input() button1Icon = '';
  @Input() button2Icon = '';
  @Input() button3Icon = '';
  @Input() button4Icon = '';

  @Input() button1Type: ButtonType = 'primary';
  @Input() button2Type: ButtonType = 'secondary';
  @Input() button3Type: ButtonType = 'tertiary';
  @Input() button4Type: ButtonType = 'tertiary';

  @Input() button1Label = '';
  @Input() button2Label = '';
  @Input() button3Label = '';
  @Input() button4Label = '';

  @Input() button1RightIcon = '';
  @Input() button2RightIcon = '';
  @Input() button3RightIcon = '';
  @Input() button4RightIcon = '';

  @Input() buttonSpacing: 'default' | 'space-between' = 'default';

  @Input() disabledButton1 = false;
  @Input() disabledButton2 = false;
  @Input() disabledButton3 = false;
  @Input() disabledButton4 = false;

  @Output() button1Click = new EventEmitter<void>();
  @Output() button2Click = new EventEmitter<void>();
  @Output() button3Click = new EventEmitter<void>();
  @Output() button4Click = new EventEmitter<void>();

  getButtonContent(centerIcon: string, label: string, rightIcon: string): ButtonContent {
    if (label && rightIcon) return 'right-icon';
    if (label)              return 'only-text';
    return 'only-icon';
  }

  get showIconTitleGroup(): boolean {
    return this.showIcon || this.showTitle;
  }

  get hostClasses(): string[] {
    return [
      'pds-section-header',
      this.showSubtitle ? 'pds-section-header--with-subtitle' : '',
    ].filter(Boolean);
  }
}
