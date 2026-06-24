import {
  Component, Input, HostBinding, ViewEncapsulation,
} from '@angular/core';
import { HeadingColumnTitleComponent, HeadingColumnTitleType } from '../heading-column-title/heading-column-title.component';

export interface TableHeaderColumn {
  type: HeadingColumnTitleType;
  label?: string;
  /** When true, column hugs content width to match an actions-type data column */
  shrink?: boolean;
}

@Component({
  selector: 'pds-table-header',
  standalone: true,
  imports: [HeadingColumnTitleComponent],
  templateUrl: './table-header.component.html',
  styleUrl: './table-header.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TableHeaderComponent {
  @HostBinding('class') readonly hostClass = 'pds-table-header';

  @Input() columns: TableHeaderColumn[] = [];
}
