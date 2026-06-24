import {
  Component, Input, Output, EventEmitter,
  HostBinding, ViewEncapsulation, ChangeDetectorRef, ApplicationRef, inject, signal, computed, WritableSignal,
} from '@angular/core';
import { TableHeaderColumn } from '../table-header/table-header.component';
import { HeadingColumnTitleComponent } from '../heading-column-title/heading-column-title.component';
import { DataRowTabComponent } from '../data-row-tab/data-row-tab.component';
import { DataRowTabConfig } from '../data-row/data-row.component';
import { PaginationComponent, PaginationState } from '../pagination/pagination.component';
import { CheckboxComponent, CheckboxType } from '../checkbox/checkbox.component';

export type { DataRowTabConfig, TableHeaderColumn };

@Component({
  selector: 'pds-table',
  standalone: true,
  imports: [HeadingColumnTitleComponent, CheckboxComponent, DataRowTabComponent, PaginationComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent {
  @HostBinding('class') readonly hostClass = 'pds-table';

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly appRef = inject(ApplicationRef);

  @Input() columns: TableHeaderColumn[] = [];
  @Input() rows: DataRowTabConfig[][] = [];

  @Input() totalItems = 0;
  @Input() set pageSize(v: number) { this._pageSize.set(v); }
  get pageSize(): number { return this._pageSize(); }
  private readonly _pageSize = signal(10);

  @Input() set currentPage(v: number) { this._currentPage.set(v); }
  get currentPage(): number { return this._currentPage(); }
  private readonly _currentPage = signal(1);

  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

  @Output() pageChange = new EventEmitter<PaginationState>();

  protected onPaginationChange(state: PaginationState): void {
    this.pageChange.emit(state);
  }

  /** Index of the currently hovered data row (-1 = none) */
  protected hoveredRow = -1;

  protected onRowEnter(i: number): void { this.hoveredRow = i; this.cdr.detectChanges(); }
  protected onRowLeave(): void  { this.hoveredRow = -1; this.cdr.detectChanges(); }

  /** CSS grid-template-columns derived from column definitions */
  get colsTemplate(): string {
    return this.columns.map(col =>
      (col.type === 'checkbox' || col.shrink) ? 'auto' : '1fr'
    ).join(' ');
  }

  // ── ROW SELECTION (signal-driven for automatic reactivity) ───────

  private readonly _selectedRows = signal(new Set<number>());

  /** Global index of row ri on the current page */
  private gi(ri: number): number {
    return (this._currentPage() - 1) * this._pageSize() + ri;
  }

  protected readonly headerCheckboxType = computed<CheckboxType>(() => {
    const s = this._selectedRows();
    if (s.size === 0) return 'cleared';
    if (s.size >= this.totalItems && this.totalItems > 0) return 'checked';
    return 'indeterminate';
  });

  protected isRowSelected(ri: number): boolean {
    return this._selectedRows().has(this.gi(ri));
  }

  protected onHeaderCheckboxChange(next: CheckboxType): void {
    if (next === 'checked') {
      // select ALL rows across all pages
      const s = new Set<number>();
      for (let i = 0; i < this.totalItems; i++) s.add(i);
      this._selectedRows.set(s);
    } else {
      // clear all selections
      this._selectedRows.set(new Set());
    }
    this.cdr.detectChanges();
  }

  protected onRowCheckboxChange(ri: number, ci: number): void {
    if (ci !== 0) return;
    const g = this.gi(ri);
    const s = new Set(this._selectedRows());
    if (s.has(g)) s.delete(g); else s.add(g);
    this._selectedRows.set(s);
    this.cdr.detectChanges();
  }
}
