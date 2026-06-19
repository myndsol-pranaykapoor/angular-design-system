import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';
import { SelectorComponent, SelectorOption } from '../selector/selector.component';

@Component({
  selector: 'pds-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, SelectorComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SearchComponent implements OnDestroy {
  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement> | null = null;
  @ViewChild('searchHost') searchHost: ElementRef<HTMLDivElement> | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.removeReposition();
  }

  @Input() placeholder = 'Search';

  /** Suggestion list — when provided, an overlay selector appears below as user types */
  @Input() suggestions: string[] = [];

  @Output() search = new EventEmitter<string>();
  @Output() cleared = new EventEmitter<void>();
  @Output() suggestionSelected = new EventEmitter<string>();

  searchValue = '';
  isHovered = false;
  isFocused = false;

  /** Overlay state — absolute-positioned coords relative to viewport */
  overlayVisible = false;
  overlayTop = 0;
  overlayLeft = 0;
  overlayWidth = 0;

  focusInput(): void {
    setTimeout(() => this.searchInput?.nativeElement.focus(), 0);
  }

  onFocus(): void {
    this.isFocused = true;
    this.updateOverlayVisibility();
  }

  clearSearch(event: Event): void {
    event.stopPropagation();
    this.searchValue = '';
    this.cleared.emit();
    this.setOverlayVisible(false);
    this.focusInput();
  }

  onBlur(): void {
    this.isFocused = false;
    if (this.searchValue.length > 0) {
      this.search.emit(this.searchValue);
    }
  }

  onInput(): void {
    this.updateOverlayVisibility();
  }

  private updateOverlayVisibility(): void {
    const hasSuggestions = this.suggestions.length > 0;
    const hasInput = this.searchValue.trim().length > 0;
    const matches = this.filteredSuggestions.length > 0;
    const shouldShow = hasSuggestions && hasInput && matches;
    if (shouldShow) this.updateOverlayPosition();
    this.setOverlayVisible(shouldShow);
  }

  private updateOverlayPosition(): void {
    if (!this.searchHost) return;
    const rect = this.searchHost.nativeElement.getBoundingClientRect();
    this.overlayTop = rect.bottom + 2;     // 2px gap under search
    this.overlayLeft = rect.left;
    this.overlayWidth = rect.width;        // match search width
  }

  /** Toggle overlay visibility and wire/unwire the scroll-follow listeners */
  private setOverlayVisible(visible: boolean): void {
    if (visible === this.overlayVisible) return;
    this.overlayVisible = visible;
    if (visible) this.addReposition();
    else this.removeReposition();
  }

  /** Keep the overlay glued under the search on scroll/resize (capture phase) */
  private readonly reposition = (): void => {
    if (!this.overlayVisible) return;
    this.updateOverlayPosition();
    this.cdr.detectChanges();
  };

  private addReposition(): void {
    window.addEventListener('scroll', this.reposition, true);
    window.addEventListener('resize', this.reposition);
  }

  private removeReposition(): void {
    window.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition);
  }

  get filteredSuggestions(): SelectorOption[] {
    const q = this.searchValue.trim().toLowerCase();
    if (!q) return [];
    return this.suggestions
      .filter(s => s.toLowerCase().includes(q))
      .map(label => ({ label, icon: 'search' }));
  }

  onSuggestionSelected(opt: { index: number; checked: boolean; option: SelectorOption }): void {
    const label = opt.option.label;
    this.searchValue = label;
    this.setOverlayVisible(false);
    this.suggestionSelected.emit(label);
    this.search.emit(label);
  }

  closeOverlay(): void {
    this.setOverlayVisible(false);
  }
}
