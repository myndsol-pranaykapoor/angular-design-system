import {
  Component, Input, HostBinding, ViewEncapsulation,
} from '@angular/core';
import { DataRowTabComponent, DataRowTabType } from '../data-row-tab/data-row-tab.component';

export interface DataRowTabConfig {
  type: DataRowTabType;
  // profile
  avatarSrc?: string;
  avatarInitials?: string;
  userName?: string;
  showDropdown?: boolean;
  // text
  text?: string;
  // field
  fieldValue?: string;
  fieldPlaceholder?: string;
  fieldSupportingIcon?: string;
  // actions
  showSwitch?: boolean;
  showRadio?: boolean;
  showCheckbox?: boolean;
  showDownload?: boolean;
  showEdit?: boolean;
  showView?: boolean;
  showExternalLink?: boolean;
  showTrash?: boolean;
  showMoreActions?: boolean;
  // chip-tag
  showApproved?: boolean;
  showReconsidered?: boolean;
  showRejected?: boolean;
}

@Component({
  selector: 'pds-data-row',
  standalone: true,
  imports: [DataRowTabComponent],
  templateUrl: './data-row.component.html',
  styleUrl: './data-row.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DataRowComponent {
  @HostBinding('class') readonly hostClass = 'pds-data-row';

  /** Tab columns — each entry maps to one pds-data-row-tab */
  @Input() tabs: DataRowTabConfig[] = [];

  /** Force hover appearance (for demo / static preview) */
  @Input() @HostBinding('class.pds-data-row--hover') hover = false;
}
