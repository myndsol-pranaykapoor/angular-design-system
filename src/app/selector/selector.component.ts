import {
  AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter,
  Input, OnDestroy, Output, ViewChild, ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionComponent } from '../option/option.component';

export interface SelectorOption {
  label: string;
  icon?: string;
  avatarSrc?: string;
  showAvatarBadge?: boolean;
  checked?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'pds-selector',
  standalone: true,
  imports: [CommonModule, OptionComponent],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class SelectorComponent implements AfterViewInit, OnDestroy {
  /** Options rendered as a vertical list */
  @Input() options: SelectorOption[] = [];

  /** Container size — changeable per requirement */
  @Input() width = 200;
  @Input() height = 220;

  /** Auto-size threshold — when options.length is at most this, height hugs the content */
  @Input() autoSizeUntil = 6;

  /** Toggle which sub-elements show inside each option */
  @Input() showCheckbox = true;
  @Input() showAvatar = true;
  @Input() showIcon = true;

  /** When list is short (≤ autoSizeUntil), let height hug content; otherwise apply fixed height */
  get computedHeight(): number | null {
    return this.options.length > this.autoSizeUntil ? this.height : null;
  }

  /** Emits when an option's checked state toggles */
  @Output() selectionChange = new EventEmitter<{ index: number; checked: boolean; option: SelectorOption }>();

  @ViewChild('viewport') viewportRef!: ElementRef<HTMLDivElement>;

  /** Scroller appears only when the list overflows (i.e. more than 6 options) */
  protected needsScroll = false;
  protected thumbHeight = 0;
  protected thumbTop = 0;

  private dragging = false;
  private dragStartY = 0;
  private dragStartScrollTop = 0;
  private resizeObserver?: ResizeObserver;

  /** Spacing/2 — track padding top & bottom */
  private readonly TRACK_PADDING = 4;

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.updateThumb();
    this.cdr.detectChanges();
    this.resizeObserver = new ResizeObserver(() => {
      this.updateThumb();
      this.cdr.detectChanges();
    });
    this.resizeObserver.observe(this.viewportRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onScroll(): void {
    this.updateThumb();
  }

  onOptionSelected(index: number, checked: boolean): void {
    this.options[index].checked = checked;
    this.selectionChange.emit({ index, checked, option: this.options[index] });
  }

  startDrag(e: MouseEvent): void {
    e.preventDefault();
    this.dragging = true;
    this.dragStartY = e.clientY;
    this.dragStartScrollTop = this.viewportRef.nativeElement.scrollTop;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  private updateThumb(): void {
    const vp = this.viewportRef.nativeElement;
    const { scrollHeight, clientHeight, scrollTop } = vp;
    this.needsScroll = scrollHeight > clientHeight + 1;
    if (!this.needsScroll) return;
    const trackHeight = clientHeight - this.TRACK_PADDING * 2;
    this.thumbHeight = Math.max(32, (clientHeight / scrollHeight) * trackHeight);
    const maxThumbTop = trackHeight - this.thumbHeight;
    const maxScrollTop = scrollHeight - clientHeight;
    this.thumbTop = this.TRACK_PADDING +
      (maxScrollTop > 0 ? (scrollTop / maxScrollTop) * maxThumbTop : 0);
  }

  private readonly onMouseMove = (e: MouseEvent): void => {
    if (!this.dragging) return;
    const vp = this.viewportRef.nativeElement;
    const maxScrollTop = vp.scrollHeight - vp.clientHeight;
    const trackHeight = vp.clientHeight - this.TRACK_PADDING * 2;
    const maxThumbTop = trackHeight - this.thumbHeight;
    const ratio = maxThumbTop > 0 ? maxScrollTop / maxThumbTop : 0;
    vp.scrollTop = Math.max(0, Math.min(maxScrollTop,
      this.dragStartScrollTop + (e.clientY - this.dragStartY) * ratio));
    this.updateThumb();
    this.cdr.detectChanges();
  };

  private readonly onMouseUp = (): void => {
    this.dragging = false;
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  };
}
