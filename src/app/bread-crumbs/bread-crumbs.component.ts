import {
  Component, Input, Output, EventEmitter, ElementRef, ChangeDetectorRef,
  OnDestroy, HostBinding, ViewEncapsulation,
} from '@angular/core';
import { CrumbComponent } from '../crumb/crumb.component';
import { SelectorComponent, SelectorOption } from '../selector/selector.component';

export interface BreadCrumbStage {
  label: string;
  icon?: string;
}

interface DisplayCrumb {
  kind: 'label' | 'more-options';
  label?: string;
  icon?: string;
  stageIndex?: number;
  collapsed?: { option: SelectorOption; index: number }[];
}

@Component({
  selector: 'pds-bread-crumbs',
  standalone: true,
  imports: [CrumbComponent, SelectorComponent],
  templateUrl: './bread-crumbs.component.html',
  styleUrl: './bread-crumbs.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class BreadCrumbsComponent implements OnDestroy {
  /** Ordered page stages (root → current). Max 4 are shown; more collapse into a more-options crumb. */
  @Input() stages: BreadCrumbStage[] = [];

  /** Emits the stage index the user navigated to (via a crumb or the more-options selector) */
  @Output() stageSelect = new EventEmitter<number>();

  @HostBinding('class') readonly hostClass = 'pds-bread-crumbs';

  protected moreOpen = false;
  protected overlayTop = 0;
  protected overlayLeft = 0;
  protected collapsedOptions: SelectorOption[] = [];
  private collapsedIndices: number[] = [];

  constructor(private host: ElementRef<HTMLElement>, private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void {
    this.removeReposition();
  }

  get chevronUrl(): string {
    return 'url(/icons/16px/chevron-right.svg)';
  }

  /** Max 4 crumbs. ≤4 stages → all label. >4 → first · more-options (middle) · last two. */
  get displayCrumbs(): DisplayCrumb[] {
    const n = this.stages.length;
    if (n <= 4) {
      return this.stages.map((s, i) => ({ kind: 'label', label: s.label, icon: s.icon, stageIndex: i }));
    }
    const collapsed: { option: SelectorOption; index: number }[] = [];
    for (let i = 1; i <= n - 3; i++) {
      collapsed.push({ option: { label: this.stages[i].label, icon: this.stages[i].icon || 'life-buoy' }, index: i });
    }
    return [
      { kind: 'label', label: this.stages[0].label, icon: this.stages[0].icon, stageIndex: 0 },
      { kind: 'more-options', collapsed },
      { kind: 'label', label: this.stages[n - 2].label, icon: this.stages[n - 2].icon, stageIndex: n - 2 },
      { kind: 'label', label: this.stages[n - 1].label, icon: this.stages[n - 1].icon, stageIndex: n - 1 },
    ];
  }

  onStageClick(index?: number): void {
    if (index != null) this.stageSelect.emit(index);
  }

  toggleMoreOptions(crumb: DisplayCrumb): void {
    if (this.moreOpen) { this.closeMore(); return; }
    this.collapsedOptions = crumb.collapsed!.map((c) => c.option);
    this.collapsedIndices = crumb.collapsed!.map((c) => c.index);
    this.moreOpen = true;
    this.positionOverlay();
    this.addReposition();
  }

  onCollapsedSelected(e: { index: number }): void {
    this.stageSelect.emit(this.collapsedIndices[e.index]);
    this.closeMore();
  }

  closeMore(): void {
    this.moreOpen = false;
    this.removeReposition();
  }

  /** Anchor the selector 2px under the more-options crumb */
  private positionOverlay(): void {
    const el = this.host.nativeElement.querySelector<HTMLElement>('pds-crumb.pds-crumb--more-options');
    if (!el) return;
    const r = el.getBoundingClientRect();
    this.overlayTop = r.bottom + 2;
    this.overlayLeft = r.left;
  }

  private readonly reposition = (): void => {
    if (!this.moreOpen) return;
    this.positionOverlay();
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
}
