import {
  Component, Input, Output, EventEmitter, ViewChildren, QueryList,
  ElementRef, ViewEncapsulation,
} from '@angular/core';
import { PopupLayoutComponent } from '../popup-layout/popup-layout.component';
import { CardHeaderComponent } from '../card-header/card-header.component';
import { CardFooterComponent } from '../card-footer/card-footer.component';
import { DateTimeSelectionStateComponent, DateTimeSelectionState } from '../date-time-selection-state/date-time-selection-state.component';

export type TimePickerType = '12-hour-time' | '24-hour-time';

@Component({
  selector: 'pds-time-picker',
  standalone: true,
  imports: [PopupLayoutComponent, CardHeaderComponent, CardFooterComponent, DateTimeSelectionStateComponent],
  templateUrl: './time-picker.component.html',
  styleUrl: './time-picker.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class TimePickerComponent {
  @Input() type: TimePickerType = '12-hour-time';
  @Input() showSeconds = true;

  private _visible = false;
  @Input() set visible(v: boolean) {
    this._visible = v;
    if (v) setTimeout(() => this.scrollAllToSelected(), 0);  // columns render with the popup
  }
  get visible(): boolean { return this._visible; }

  @Output() closed = new EventEmitter<void>();
  @Output() timeSelected = new EventEmitter<string>();

  @ViewChildren('col') private cols!: QueryList<ElementRef<HTMLElement>>;

  /** 24px cell + 4px gap (spacing/2) — one scroll step */
  private readonly PITCH = 28;

  constructor() { this.setIndicesToNow(); }

  get title(): string { return this.type === '12-hour-time' ? '12 Hours' : '24 Hours'; }

  // ── COLUMN DATA ──────────────────────────────────────────────────────────
  get hours(): string[] {
    return this.type === '12-hour-time'
      ? Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))   // 01–12
      : Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));       // 00–23
  }
  readonly minutes  = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  readonly seconds  = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
  readonly meridiem = ['AM', 'PM'];

  selectedHourIdx = 0;
  selectedMinuteIdx = 0;
  selectedSecondIdx = 0;
  selectedMeridiemIdx = 0;

  // ── STATE PER CELL — centered cell is selected ───────────────────────────
  hourState(i: number):   DateTimeSelectionState { return i === this.selectedHourIdx     ? 'selected' : 'default'; }
  minuteState(i: number): DateTimeSelectionState { return i === this.selectedMinuteIdx   ? 'selected' : 'default'; }
  secondState(i: number): DateTimeSelectionState { return i === this.selectedSecondIdx   ? 'selected' : 'default'; }
  meridiemState(i: number): DateTimeSelectionState { return i === this.selectedMeridiemIdx ? 'selected' : 'default'; }

  // ── SCROLL → SELECTION ───────────────────────────────────────────────────
  onScroll(e: Event, col: 'hour' | 'minute' | 'second' | 'meridiem'): void {
    const el = e.target as HTMLElement;
    const len = this.lengthFor(col);
    const idx = Math.max(0, Math.min(len - 1, Math.round(el.scrollTop / this.PITCH)));
    if (col === 'hour')          this.selectedHourIdx = idx;
    else if (col === 'minute')   this.selectedMinuteIdx = idx;
    else if (col === 'second')   this.selectedSecondIdx = idx;
    else                         this.selectedMeridiemIdx = idx;
  }

  /** Click a cell → smooth-scroll it to the centre (which selects it) */
  scrollToIndex(col: 'hour' | 'minute' | 'second' | 'meridiem', idx: number): void {
    const el = this.colEl(col);
    el?.scrollTo({ top: idx * this.PITCH, behavior: 'smooth' });
  }

  private lengthFor(col: 'hour' | 'minute' | 'second' | 'meridiem'): number {
    if (col === 'hour')   return this.hours.length;
    if (col === 'minute') return this.minutes.length;
    if (col === 'second') return this.seconds.length;
    return this.meridiem.length;
  }

  private colEl(col: string): HTMLElement | undefined {
    return this.cols?.find(r => r.nativeElement.dataset['col'] === col)?.nativeElement;
  }

  private scrollAllToSelected(): void {
    const map: [string, number][] = [
      ['hour', this.selectedHourIdx],
      ['minute', this.selectedMinuteIdx],
      ['second', this.selectedSecondIdx],
      ['meridiem', this.selectedMeridiemIdx],
    ];
    for (const [col, idx] of map) {
      const el = this.colEl(col);
      if (el) el.scrollTop = idx * this.PITCH;   // instant on open
    }
  }

  // ── NOW / FOOTER ─────────────────────────────────────────────────────────
  private setIndicesToNow(): void {
    const now = new Date();
    const h24 = now.getHours();
    if (this.type === '12-hour-time') {
      this.selectedMeridiemIdx = h24 >= 12 ? 1 : 0;
      const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
      this.selectedHourIdx = h12 - 1;            // hours array '01'..'12'
    } else {
      this.selectedHourIdx = h24;                // hours array '00'..'23'
    }
    this.selectedMinuteIdx = now.getMinutes();
    this.selectedSecondIdx = now.getSeconds();
  }

  protected now(): void {
    this.setIndicesToNow();
    setTimeout(() => {
      const map: [string, number][] = [
        ['hour', this.selectedHourIdx],
        ['minute', this.selectedMinuteIdx],
        ['second', this.selectedSecondIdx],
        ['meridiem', this.selectedMeridiemIdx],
      ];
      for (const [col, idx] of map) this.colEl(col)?.scrollTo({ top: idx * this.PITCH, behavior: 'smooth' });
    }, 0);
  }

  protected confirm(): void {
    const hh = this.hours[this.selectedHourIdx];
    const mm = this.minutes[this.selectedMinuteIdx];
    const ss = this.seconds[this.selectedSecondIdx];
    let value = this.showSeconds ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`;
    if (this.type === '12-hour-time') value += ` ${this.meridiem[this.selectedMeridiemIdx]}`;
    this.timeSelected.emit(value);
    this.closed.emit();
  }

  protected cancel(): void { this.closed.emit(); }
}
