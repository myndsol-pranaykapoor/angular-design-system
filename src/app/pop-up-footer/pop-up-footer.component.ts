import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'pds-pop-up-footer',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './pop-up-footer.component.html',
  styleUrl: './pop-up-footer.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PopUpFooterComponent {
  @Input() button1Label = 'Button';
  @Input() button2Label = 'Button';
  @Input() button3Label = 'Button';
  @Input() button4Label = 'Button';

  /** Optional left icon for button4 (e.g. download on "Download Sample") */
  @Input() button4LeftIcon = '';

  @Input() showButton1 = true;
  @Input() showButton2 = true;
  @Input() showButton3 = true;
  @Input() showButton4 = true;

  @Input() disabledButton1 = false;
  @Input() disabledButton2 = false;
  @Input() disabledButton3 = false;
  @Input() disabledButton4 = false;

  @Output() button1Click = new EventEmitter<void>();
  @Output() button2Click = new EventEmitter<void>();
  @Output() button3Click = new EventEmitter<void>();
  @Output() button4Click = new EventEmitter<void>();
}
