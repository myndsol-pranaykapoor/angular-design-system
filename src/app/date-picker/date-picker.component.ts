import { Component, ChangeDetectorRef, ElementRef, HostBinding, Input, Output, EventEmitter, OnDestroy, ViewChild, ViewEncapsulation } from '@angular/core';
import { PopupLayoutComponent } from '../popup-layout/popup-layout.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { PopUpFooterComponent } from '../pop-up-footer/pop-up-footer.component';
import { DateTimeSelectionStateComponent, DateTimeSelectionState } from '../date-time-selection-state/date-time-selection-state.component';
import { SelectorComponent, SelectorOption } from '../selector/selector.component';

export type DatePickerType = 'date-change' | 'year-change' | 'month-change' | 'date-range';

interface DayCell {
  date: Date;
  inCurrentMonth: boolean;
}

@Component({
  selector: 'pds-date-picker',
  standalone: true,
  imports: [PopupLayoutComponent, PopUpHeaderComponent, PopUpFooterComponent, DateTimeSelectionStateComponent, SelectorComponent],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DatePickerComponent implements OnDestroy {
  @ViewChild('hostRef', { static: true }) hostRef!: ElementRef<HTMLDivElement>;
  @Input() type: DatePickerType = 'date-change';
  @Input() visible = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void { this.removeOverlayReposition(); }

  /** Anchor the picker to fixed coords instead of centring (e.g. under an input field) */
  @Input() anchored = false;
  @Input() anchorTop = 0;
  @Input() anchorLeft = 0;

  /** Host classes so CSS can scope layout overrides per type */
  @HostBinding('class.pds-date-picker--date-change')
  get isDateChange(): boolean { return this.type === 'date-change'; }
  @HostBinding('class.pds-date-picker--year-change')
  get isYearChange(): boolean { return this.type === 'year-change'; }
  @HostBinding('class.pds-date-picker--month-change')
  get isMonthChange(): boolean { return this.type === 'month-change'; }
  @HostBinding('class.pds-date-picker--date-range')
  get isDateRange(): boolean { return this.type === 'date-range'; }

  @Output() closed = new EventEmitter<void>();
  @Output() dateSelected = new EventEmitter<Date>();

  protected readonly weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  protected readonly today = new Date();

  protected viewYear  = new Date().getFullYear();
  protected viewMonth = new Date().getMonth();
  protected selectedDate: Date | null = null;

  get monthName(): string {
    return new Date(this.viewYear, this.viewMonth, 1)
      .toLocaleString('default', { month: 'short' });
  }

  get yearStr(): string {
    return this.viewYear.toString();
  }

  // ── YEAR-CHANGE GRID ────────────────────────────────────────────────────
  protected yearSetStart = new Date().getFullYear() - 6; // current year at position 6 in 15-year range
  /** Year the user has picked — null until clicked, so the current year shows as `now` by default */
  protected selectedYear: number | null = null;

  get yearRangeTitle(): string {
    return `${this.yearSetStart} – ${this.yearSetStart + 14}`;
  }

  get yearGrid(): number[][] {
    const rows: number[][] = [];
    for (let r = 0; r < 5; r++) {
      const row: number[] = [];
      for (let c = 0; c < 3; c++) row.push(this.yearSetStart + r * 3 + c);
      rows.push(row);
    }
    return rows;
  }

  protected getYearState(year: number): DateTimeSelectionState {
    if (this.selectedYear !== null && year === this.selectedYear) return 'selected';
    if (year === this.today.getFullYear())                        return 'now';
    return 'default';
  }

  protected prevYearSet(): void { this.yearSetStart -= 15; }
  protected nextYearSet(): void { this.yearSetStart += 15; }

  protected selectYear(year: number): void {
    this.selectedYear = year;
  }

  // ── MONTH-CHANGE GRID ────────────────────────────────────────────────────
  private readonly MONTHS_SHORT = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];

  /** 4 rows × 3 month indices (0–11) */
  get monthGrid(): number[][] {
    const rows: number[][] = [];
    for (let r = 0; r < 4; r++) rows.push([r * 3, r * 3 + 1, r * 3 + 2]);
    return rows;
  }

  protected monthShort(idx: number): string { return this.MONTHS_SHORT[idx]; }

  /** Month the user has picked (year-aware) — null until clicked, so the current month shows as `now` by default */
  protected selectedMonth: { year: number; month: number } | null = null;

  protected getMonthState(idx: number): DateTimeSelectionState {
    if (this.selectedMonth && this.selectedMonth.year === this.viewYear && this.selectedMonth.month === idx) return 'selected';
    if (idx === this.today.getMonth() && this.viewYear === this.today.getFullYear()) return 'now';
    return 'default';
  }

  protected selectMonth(idx: number): void { this.selectedMonth = { year: this.viewYear, month: idx }; }

  // month-change nav (« / ») moves the displayed year
  protected prevYear(): void { this.viewYear -= 1; }
  protected nextYear(): void { this.viewYear += 1; }

  // ── HEADER NAV DISPATCH (button-2 = prev · button-1 = next) ───────────────
  get navPrevIcon(): string { return this.type === 'date-change' ? 'chevron-left'  : 'chevrons-left';  }
  get navNextIcon(): string { return this.type === 'date-change' ? 'chevron-right' : 'chevrons-right'; }

  protected onPrevNav(): void {
    if (this.type === 'date-change')       this.prevMonth();
    else if (this.type === 'year-change')  this.prevYearSet();
    else if (this.type === 'month-change') this.prevYear();
  }

  protected onNextNav(): void {
    if (this.type === 'date-change')       this.nextMonth();
    else if (this.type === 'year-change')  this.nextYearSet();
    else if (this.type === 'month-change') this.nextYear();
  }

  /** Build a 7-column month grid (with leading/trailing days) for any year/month */
  private buildGrid(year: number, month: number): DayCell[][] {
    const firstDay      = new Date(year, month, 1).getDay();
    const daysInMonth   = new Date(year, month + 1, 0).getDate();
    const prevMonthLast = new Date(year, month, 0).getDate();

    const cells: DayCell[] = [];

    // Leading days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      cells.push({ date: new Date(year, month - 1, prevMonthLast - i), inCurrentMonth: false });
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), inCurrentMonth: true });
    }
    // Trailing days from next month
    let nextDay = 1;
    while (cells.length % 7 !== 0) {
      cells.push({ date: new Date(year, month + 1, nextDay++), inCurrentMonth: false });
    }

    const weeks: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }

  get dateGrid(): DayCell[][] {
    return this.buildGrid(this.viewYear, this.viewMonth);
  }

  protected getState(cell: DayCell): DateTimeSelectionState {
    if (!cell.inCurrentMonth) return 'excluded';

    const { date } = cell;
    const t = this.today;
    const isToday =
      date.getFullYear() === t.getFullYear() &&
      date.getMonth()    === t.getMonth()    &&
      date.getDate()     === t.getDate();

    if (this.selectedDate) {
      const s = this.selectedDate;
      const isSelected =
        date.getFullYear() === s.getFullYear() &&
        date.getMonth()    === s.getMonth()    &&
        date.getDate()     === s.getDate();
      if (isSelected) return 'selected';
    }

    return isToday ? 'now' : 'default';
  }

  protected prevMonth(): void {
    if (this.viewMonth === 0) { this.viewMonth = 11; this.viewYear--; }
    else this.viewMonth--;
  }

  protected nextMonth(): void {
    if (this.viewMonth === 11) { this.viewMonth = 0; this.viewYear++; }
    else this.viewMonth++;
  }

  // ── DATE-RANGE (two calendars: from + till) ──────────────────────────────
  protected fromView = { year: new Date().getFullYear(), month: new Date().getMonth() };
  protected tillView = {
    year:  new Date().getMonth() === 11 ? new Date().getFullYear() + 1 : new Date().getFullYear(),
    month: (new Date().getMonth() + 1) % 12,
  };
  protected rangeStart: Date | null = null;
  protected rangeEnd:   Date | null = null;

  get fromGrid(): DayCell[][] { return this.buildGrid(this.fromView.year, this.fromView.month); }
  get tillGrid(): DayCell[][] { return this.buildGrid(this.tillView.year, this.tillView.month); }

  get fromMonthName(): string { return new Date(this.fromView.year, this.fromView.month, 1).toLocaleString('default', { month: 'short' }); }
  get tillMonthName(): string { return new Date(this.tillView.year, this.tillView.month, 1).toLocaleString('default', { month: 'short' }); }
  get fromYearStr(): string { return this.fromView.year.toString(); }
  get tillYearStr(): string { return this.tillView.year.toString(); }

  private stepMonth(view: { year: number; month: number }, delta: number): void {
    let m = view.month + delta;
    if (m < 0)  { m = 11; view.year--; }
    if (m > 11) { m = 0;  view.year++; }
    view.month = m;
  }
  protected prevFromMonth(): void { this.stepMonth(this.fromView, -1); }
  protected nextFromMonth(): void { this.stepMonth(this.fromView,  1); }
  protected prevTillMonth(): void { this.stepMonth(this.tillView, -1); }
  protected nextTillMonth(): void { this.stepMonth(this.tillView,  1); }

  private sameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  /** State for a cell in a date-range calendar — endpoints = selected · in-between = selected-range */
  protected getRangeState(cell: DayCell): DateTimeSelectionState {
    if (!cell.inCurrentMonth) return 'excluded';
    const d = cell.date;

    if (this.rangeStart && this.sameDay(d, this.rangeStart)) return 'selected';
    if (this.rangeEnd   && this.sameDay(d, this.rangeEnd))   return 'selected';

    if (this.rangeStart && this.rangeEnd) {
      const t = d.getTime();
      if (t > this.rangeStart.getTime() && t < this.rangeEnd.getTime()) return 'selected-range';
    }

    if (this.sameDay(d, this.today)) return 'now';
    return 'default';
  }

  /** Range selection: 1st click sets start · 2nd sets end (auto-orders) · 3rd restarts */
  protected selectRangeDate(date: Date): void {
    const d = new Date(date);
    if (!this.rangeStart || (this.rangeStart && this.rangeEnd)) {
      this.rangeStart = d;
      this.rangeEnd = null;
    } else {
      if (d.getTime() < this.rangeStart.getTime()) {
        this.rangeEnd = this.rangeStart;
        this.rangeStart = d;
      } else {
        this.rangeEnd = d;
      }
    }
  }

  protected selectDate(date: Date): void {
    this.selectedDate = new Date(date);
  }

  protected goToToday(): void {
    this.viewYear    = this.today.getFullYear();
    this.viewMonth   = this.today.getMonth();
    this.selectedDate = new Date(this.today);
    // year-change type renders its grid from yearSetStart — reset it so today's year is visible
    this.yearSetStart = this.today.getFullYear() - 6;
    // year-change & month-change: highlight the current year / month as selected
    this.selectedYear = this.today.getFullYear();
    this.selectedMonth = { year: this.today.getFullYear(), month: this.today.getMonth() };
    // date-range: reset both calendars to today / today+1 month
    this.fromView = { year: this.today.getFullYear(), month: this.today.getMonth() };
    this.tillView = {
      year:  this.today.getMonth() === 11 ? this.today.getFullYear() + 1 : this.today.getFullYear(),
      month: (this.today.getMonth() + 1) % 12,
    };
    // highlight today as selected (consistent with the other types) — start a fresh range at today
    this.rangeStart = new Date(this.today);
    this.rangeEnd = null;
  }

  protected confirm(): void {
    if (this.type === 'date-range') {
      if (this.rangeStart) this.dateSelected.emit(new Date(this.rangeStart));
      if (this.rangeEnd)   this.dateSelected.emit(new Date(this.rangeEnd));
    } else if (this.selectedDate) {
      this.dateSelected.emit(new Date(this.selectedDate));
    }
    this.closed.emit();
  }

  protected cancel(): void {
    this.closed.emit();
  }

  // ── MONTH / YEAR SELECTOR OVERLAYS ───────────────────────────────────────
  /** Which calendar the overlay targets: the single picker, or date-range's from/till */
  protected overlayTarget: 'single' | 'from' | 'till' = 'single';

  /** Scope selector for locating the targeted calendar's pop-up-header buttons */
  private overlayScope(target: 'single' | 'from' | 'till'): string {
    if (target === 'from') return 'pds-date-picker .pds-date-picker__range-cal--from ';
    if (target === 'till') return 'pds-date-picker .pds-date-picker__range-cal--till ';
    return 'pds-date-picker ';
  }

  /** The month value currently shown by the targeted calendar */
  private targetMonth(): number {
    if (this.overlayTarget === 'from') return this.fromView.month;
    if (this.overlayTarget === 'till') return this.tillView.month;
    return this.viewMonth;
  }

  /** The year value currently shown by the targeted calendar */
  private targetYear(): number {
    if (this.overlayTarget === 'from') return this.fromView.year;
    if (this.overlayTarget === 'till') return this.tillView.year;
    return this.viewYear;
  }

  // ── SCROLL REPOSITION — keep the open month/year overlay stuck under its button ──
  private overlayButton(): HTMLElement | null {
    const secs = document.querySelectorAll(
      `${this.overlayScope(this.overlayTarget)}.pds-pop-up-header__main-row .pds-button--secondary`,
    );
    if (this.monthOverlayVisible) return (secs[0] as HTMLElement) ?? null;            // month = first
    if (this.yearOverlayVisible)  return (secs[secs.length - 1] as HTMLElement) ?? null; // year = last
    return null;
  }

  private readonly repositionOverlay = (): void => {
    const btn = this.overlayButton();
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    if (this.monthOverlayVisible)     { this.monthOverlayTop = r.bottom + 2; this.monthOverlayLeft = r.left; }
    else if (this.yearOverlayVisible) { this.yearOverlayTop  = r.bottom + 2; this.yearOverlayLeft  = r.left; }
    this.cdr.detectChanges();                 // zoneless: reflect the new position
  };

  private addOverlayReposition(): void {
    window.addEventListener('scroll', this.repositionOverlay, true);
    window.addEventListener('resize', this.repositionOverlay);
  }
  private removeOverlayReposition(): void {
    window.removeEventListener('scroll', this.repositionOverlay, true);
    window.removeEventListener('resize', this.repositionOverlay);
  }

  // ── MONTH SELECTOR ──
  /** All 12 months — used as the selector's option list */
  private readonly MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  protected monthOverlayVisible = false;
  protected monthOverlayTop = 0;
  protected monthOverlayLeft = 0;

  get monthOptions(): SelectorOption[] {
    const current = this.targetMonth();
    return this.MONTHS.map((label, idx) => ({ label, checked: idx === current }));
  }

  /** Fixed selector dimensions for the month overlay */
  protected readonly MONTH_SELECTOR_WIDTH = 100;
  protected readonly MONTH_SELECTOR_HEIGHT = 180;

  /** Toggle the month-selector overlay under the targeted calendar's month button (2px gap) */
  protected toggleMonthOverlay(target: 'single' | 'from' | 'till' = 'single'): void {
    if (this.monthOverlayVisible && this.overlayTarget === target) {
      this.closeMonthOverlay();
      return;
    }
    this.yearOverlayVisible = false;
    this.overlayTarget = target;
    // Month button is the FIRST .pds-button--secondary in the targeted pop-up-header.
    const monthBtn = document.querySelector(
      `${this.overlayScope(target)}.pds-pop-up-header__main-row .pds-button--secondary`,
    ) as HTMLElement | null;
    if (!monthBtn) return;
    const rect = monthBtn.getBoundingClientRect();
    this.monthOverlayTop = rect.bottom + 2;   // 2px gap below the button
    this.monthOverlayLeft = rect.left;
    this.monthOverlayVisible = true;
    this.addOverlayReposition();
  }

  protected closeMonthOverlay(): void {
    this.monthOverlayVisible = false;
    this.removeOverlayReposition();
  }

  /** When user picks a month — update the targeted calendar, close overlay */
  protected onMonthOptionSelected(
    e: { index: number; checked: boolean; option: SelectorOption },
  ): void {
    if (this.overlayTarget === 'from')      this.fromView = { ...this.fromView, month: e.index };
    else if (this.overlayTarget === 'till') this.tillView = { ...this.tillView, month: e.index };
    else                                    this.viewMonth = e.index;
    this.closeMonthOverlay();
  }

  // ── YEAR SELECTOR ──
  /** Year range — current year ± 10 (21 years total) */
  private readonly YEAR_RANGE = 10;

  protected yearOverlayVisible = false;
  protected yearOverlayTop = 0;
  protected yearOverlayLeft = 0;

  /** Fixed selector dimensions for the year overlay */
  protected readonly YEAR_SELECTOR_WIDTH = 100;
  protected readonly YEAR_SELECTOR_HEIGHT = 180;

  get yearOptions(): SelectorOption[] {
    const current = this.targetYear();
    const base = this.today.getFullYear();
    const options: SelectorOption[] = [];
    for (let y = base - this.YEAR_RANGE; y <= base + this.YEAR_RANGE; y++) {
      options.push({ label: y.toString(), checked: y === current });
    }
    return options;
  }

  /** Toggle the year-selector overlay under the targeted calendar's year button (2px gap) */
  protected toggleYearOverlay(target: 'single' | 'from' | 'till' = 'single'): void {
    if (this.yearOverlayVisible && this.overlayTarget === target) {
      this.closeYearOverlay();
      return;
    }
    this.monthOverlayVisible = false;
    this.overlayTarget = target;
    // Year button is the LAST .pds-button--secondary in the targeted pop-up-header
    // (date-change & date-range calendars have month+year; month-change has only year).
    const secondaryBtns = document.querySelectorAll(
      `${this.overlayScope(target)}.pds-pop-up-header__main-row .pds-button--secondary`,
    );
    const yearBtn = secondaryBtns[secondaryBtns.length - 1] as HTMLElement | undefined;
    if (!yearBtn) return;
    const rect = yearBtn.getBoundingClientRect();
    this.yearOverlayTop = rect.bottom + 2;    // 2px gap below the button
    this.yearOverlayLeft = rect.left;
    this.yearOverlayVisible = true;
    this.addOverlayReposition();
  }

  protected closeYearOverlay(): void {
    this.yearOverlayVisible = false;
    this.removeOverlayReposition();
  }

  /** When user picks a year — update the targeted calendar, close overlay */
  protected onYearOptionSelected(
    e: { index: number; checked: boolean; option: SelectorOption },
  ): void {
    const y = parseInt(e.option.label, 10);
    if (this.overlayTarget === 'from')      this.fromView = { ...this.fromView, year: y };
    else if (this.overlayTarget === 'till') this.tillView = { ...this.tillView, year: y };
    else                                    this.viewYear = y;
    this.closeYearOverlay();
  }
}
