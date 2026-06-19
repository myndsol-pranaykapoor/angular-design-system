import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'pds-web-footer',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './web-footer.component.html',
  styleUrl: './web-footer.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class WebFooterComponent {
  /** Rights text — split into three runs for the mixed styling */
  @Input() year = '2026';
  @Input() companyName = 'Mynd Integrated Solutions';
  @Input() rightsSuffix = 'All Rights Reserved.';

  /** Powered-by block */
  @Input() poweredByText = 'Powered by';
  @Input() toolLogoSrc = '/images/hrx-logo.svg';
  @Input() toolLogoAlt = 'HRX';
  @Input() companyLogoSrc = '/images/myndx-logo.svg';
  @Input() companyLogoAlt = 'MYNDX';

  /** Tool-logo size — defaults 55×30, change to fit a different logo */
  @Input() toolLogoWidth = 55;
  @Input() toolLogoHeight = 30;

  /** Company-logo size — defaults 83×30, change to fit a different logo */
  @Input() companyLogoWidth = 83;
  @Input() companyLogoHeight = 30;

  /** Two tertiary action buttons (right-aligned) */
  @Input() showAction1 = true;
  @Input() action1Label = 'Privacy Policy';
  @Input() showAction2 = true;
  @Input() action2Label = 'Terms of Service';

  @Output() action1Click = new EventEmitter<void>();
  @Output() action2Click = new EventEmitter<void>();
}
