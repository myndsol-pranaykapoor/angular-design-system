import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pds-label-container',
  standalone: true,
  templateUrl: './label-container.component.html',
  styleUrl: './label-container.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class LabelContainerComponent {
  /** Title text for the input */
  @Input() label = 'Label';

  /** Supporting icon — only shown when required */
  @Input() showSupportingIcon = false;
  @Input() supportingIcon = '';
  /** Supporting icon colour (Secondary/3 default; semantic for input-field status states) */
  @Input() supportingIconColor = '#263b74';

  /** "optional" — only shown when the input is not mandatory */
  @Input() showOptional = false;
  @Input() optionalText = 'optional';

  /** Info icon — only shown when extra information is to be conveyed */
  @Input() showInfo = false;
  @Input() infoIcon = 'info';
}
