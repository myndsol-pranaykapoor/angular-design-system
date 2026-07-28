import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pds-popup-layout',
  standalone: true,
  templateUrl: './popup-layout.component.html',
  styleUrl: './popup-layout.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PopupLayoutComponent {
  @Input() visible = false;
  /** Fixed pixel width, or 'auto' to hug content */
  @Input() width: number | 'auto' = 400;
  /** Fixed pixel height, or 'auto' to hug content (no fixed height, no scroll) */
  @Input() height: number | 'auto' = 400;
  /** Render the pop-up-header slot. Set false when there is no header (e.g. date-range). */
  @Input() showHeader = true;
  /** Apply the bordered play-area chrome (border · padding · radius). Set false for custom content. */
  @Input() playAreaChrome = true;

  /** Anchor the popup to fixed coords (top/left) instead of centring — used for dropdown-style overlays */
  @Input() anchored = false;
  @Input() anchorTop = 0;
  @Input() anchorLeft = 0;

  /** Fill the parent element (position relative · height 100%) instead of fixed-centring.
   *  Suppresses the built-in backdrop — the host (e.g. filter-drawer) provides its own. */
  @Input() fillParent = false;

  @Output() closed = new EventEmitter<void>();

  /** Pixel value for [style.height.px], or null when 'auto' so no height is applied */
  get heightPx(): number | null {
    return this.height === 'auto' ? null : this.height;
  }

  get widthPx(): number | null {
    return this.width === 'auto' ? null : this.width;
  }

  get isAutoHeight(): boolean { return this.height === 'auto'; }
  get isAutoWidth(): boolean { return this.width === 'auto'; }

  onBackdropClick(): void {
    this.closed.emit();
  }
}
