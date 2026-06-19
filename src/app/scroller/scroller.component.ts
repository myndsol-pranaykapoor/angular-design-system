import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ElementRef, HostBinding, Input, OnDestroy, ViewChild, ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'pds-scroller',
  standalone: true,
  templateUrl: './scroller.component.html',
  styleUrl: './scroller.component.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'pds-scroller' },
})
export class ScrollerComponent implements AfterViewInit, OnDestroy {
  /** 'overlay' — scrollbar over content (default). 'inline' — viewport & scrollbar side-by-side, gap Spacing/6 */
  @Input() layout: 'overlay' | 'inline' = 'overlay';

  @HostBinding('class.pds-scroller--inline')
  get isInline(): boolean { return this.layout === 'inline'; }

  @ViewChild('viewport') viewportRef!: ElementRef<HTMLDivElement>;

  protected thumbHeight = 0;
  protected thumbTop = 0;
  protected showScrollbar = false;

  private dragging = false;
  private dragStartY = 0;
  private dragStartScrollTop = 0;
  private resizeObserver?: ResizeObserver;

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

  startDrag(e: MouseEvent): void {
    e.preventDefault();
    this.dragging = true;
    this.dragStartY = e.clientY;
    this.dragStartScrollTop = this.viewportRef.nativeElement.scrollTop;
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  // Spacing/2 = 4px padding applied to top and bottom of the track
  private readonly TRACK_PADDING = 4;

  private updateThumb(): void {
    const vp = this.viewportRef.nativeElement;
    const { scrollHeight, clientHeight, scrollTop } = vp;
    this.showScrollbar = scrollHeight > clientHeight;
    if (!this.showScrollbar) return;
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
