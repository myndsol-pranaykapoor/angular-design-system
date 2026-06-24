import {
  Component, Input, Output, EventEmitter,
  HostBinding, ViewEncapsulation, ChangeDetectorRef, inject, ElementRef, ViewChild,
} from '@angular/core';
import { SelectorComponent, SelectorOption } from '../selector/selector.component';

export interface PaginationState {
  page: number;
  pageSize: number;
}

@Component({
  selector: 'pds-pagination',
  standalone: true,
  imports: [SelectorComponent],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PaginationComponent {
  @HostBinding('class') readonly hostClass = 'pds-pagination';

  @Input() totalItems = 100;
  @Input() pageSize = 10;
  @Input() currentPage = 1;
  @Input() pageSizeOptions: number[] = [10, 25, 50, 100];

  @Output() pageChange = new EventEmitter<PaginationState>();

  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('sizeBtnRef') sizeBtnRef!: ElementRef<HTMLButtonElement>;

  protected sizeDropdownOpen = false;
  protected dropdownTop = 0;
  protected dropdownLeft = 0;
  protected readonly dropdownWidth = 60;             /* 60px wide */

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  get showingText(): string {
    if (this.totalItems === 0) return '0 out of 0';
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(this.currentPage * this.pageSize, this.totalItems);
    return `${start} - ${end} out of ${this.totalItems}`;
  }

  get visiblePages(): (number | '...')[] {
    const total = this.totalPages;
    const cur = this.currentPage;
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (cur <= 4) return [1, 2, 3, 4, 5, '...', total];
    if (cur >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
    return [1, '...', cur - 1, cur, cur + 1, '...', total];
  }

  get selectorOptions(): SelectorOption[] {
    return this.pageSizeOptions.map(opt => ({
      label: String(opt),
      checked: opt === this.pageSize,
    }));
  }

  protected goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.pageChange.emit({ page: this.currentPage, pageSize: this.pageSize });
    this.cdr.detectChanges();
  }

  protected prevPage(): void { this.goToPage(this.currentPage - 1); }
  protected nextPage(): void { this.goToPage(this.currentPage + 1); }

  protected toggleSizeDropdown(): void {
    if (!this.sizeDropdownOpen) {
      const rect = this.sizeBtnRef.nativeElement.getBoundingClientRect();
      this.dropdownTop = rect.top - 2;        /* Spacing/1 (2px) gap above button */
      this.dropdownLeft = rect.left;
    }
    this.sizeDropdownOpen = !this.sizeDropdownOpen;
    this.cdr.detectChanges();
  }

  protected closeSizeDropdown(): void {
    this.sizeDropdownOpen = false;
    this.cdr.detectChanges();
  }

  protected onSizeSelected(event: { index: number; option: SelectorOption }): void {
    const size = this.pageSizeOptions[event.index];
    if (size == null) return;
    this.pageSize = size;
    this.currentPage = 1;
    this.sizeDropdownOpen = false;
    this.pageChange.emit({ page: 1, pageSize: size });
    this.cdr.detectChanges();
  }
}
