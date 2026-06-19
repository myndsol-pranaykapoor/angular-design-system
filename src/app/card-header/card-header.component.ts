import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ButtonComponent, ButtonContent, ButtonType } from '../button/button.component';

@Component({
  selector: 'pds-card-header',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './card-header.component.html',
  styleUrl: './card-header.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class CardHeaderComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() icon = '';
  @Input() iconColor = '#00ad61'; // Primary/3 default; override for semantic colours (e.g. toast)
  @Input() titleColor = '';       // defaults to CSS (#3f3f3f); override for semantic colours (e.g. toast)

  @Input() showIcon = true;
  @Input() showTitle = true;
  @Input() showSubtitle = false;

  @Input() showButton1 = true;
  @Input() showButton2 = true;
  @Input() showButton3 = true;
  @Input() showButton4 = true;

  // Center icon (only-icon mode) — existing API
  @Input() button1Icon = '';
  @Input() button2Icon = '';
  @Input() button3Icon = '';
  @Input() button4Icon = '';

  // Button types — defaults preserve existing behaviour
  @Input() button1Type: ButtonType = 'primary';
  @Input() button2Type: ButtonType = 'secondary';
  @Input() button3Type: ButtonType = 'tertiary';
  @Input() button4Type: ButtonType = 'tertiary';

  // Text label — when set, button renders as right-icon (label + rightIcon) or only-text
  @Input() button1Label = '';
  @Input() button2Label = '';
  @Input() button3Label = '';
  @Input() button4Label = '';

  // Right icon — used alongside label for right-icon content
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
      'pds-card-header',
      this.showSubtitle ? 'pds-card-header--with-subtitle' : '',
    ].filter(Boolean);
  }
}
