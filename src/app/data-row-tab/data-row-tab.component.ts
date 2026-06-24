import {
  Component, Input, Output, EventEmitter,
  HostBinding, ViewEncapsulation, ChangeDetectorRef, inject,
} from '@angular/core';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';
import { SwitchComponent } from '../switch/switch.component';
import { RadioComponent } from '../radio/radio.component';
import { CheckboxComponent, CheckboxType } from '../checkbox/checkbox.component';
import { InputAreaComponent } from '../input-area/input-area.component';
import { ChipTagComponent } from '../chip-tag/chip-tag.component';

export type DataRowTabType = 'profile' | 'text' | 'field' | 'actions' | 'chip-tag';

@Component({
  selector: 'pds-data-row-tab',
  standalone: true,
  imports: [ProfileAvatarComponent, SwitchComponent, RadioComponent, CheckboxComponent, InputAreaComponent, ChipTagComponent],
  templateUrl: './data-row-tab.component.html',
  styleUrl: './data-row-tab.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DataRowTabComponent {
  @HostBinding('class') get hostClass(): string {
    return `pds-data-row-tab pds-data-row-tab--${this.type}`;
  }

  private readonly cdr = inject(ChangeDetectorRef);

  @Input() type: DataRowTabType = 'text';

  // ── Profile type ──────────────────────────────────────────────
  @Input() avatarSrc = '';
  @Input() avatarInitials = 'PK';
  @Input() userName = 'Pranay Kapoor';
  @Input() showDropdown = true;

  // ── Text type ─────────────────────────────────────────────────
  @Input() text = 'Text appear like this.';

  // ── Field type ────────────────────────────────────────────────
  @Input() fieldValue = '';
  @Input() fieldPlaceholder = 'Select date';
  @Input() fieldSupportingIcon = 'calendar';

  // ── Actions type — initial values; internal state tracks changes ──
  @Input() set switchOn(v: boolean) { this._switchOn = v; }
  @Input() set radioSelected(v: boolean) { this._radioSelected = v; }
  @Input() set checkboxChecked(v: boolean) { this._checkboxType = v ? 'checked' : 'cleared'; this.cdr.detectChanges(); }
  @Input() showSwitch = true;
  @Input() showRadio = true;
  @Input() showCheckbox = true;
  @Input() showDownload = true;
  @Input() showEdit = true;
  @Input() showView = true;
  @Input() showExternalLink = true;
  @Input() showTrash = true;
  @Input() showMoreActions = true;

  // internal mutable state for interactive controls
  protected _switchOn = false;
  protected _radioSelected = false;
  protected _checkboxType: CheckboxType = 'cleared';

  // ── Chip Tag type ─────────────────────────────────────────────
  @Input() showApproved = true;
  @Input() showReconsidered = true;
  @Input() showRejected = true;

  // ── Outputs ───────────────────────────────────────────────────
  @Output() dropdownClick = new EventEmitter<void>();
  @Output() switchChange = new EventEmitter<boolean>();
  @Output() radioChange = new EventEmitter<void>();
  @Output() checkboxChange = new EventEmitter<CheckboxType>();
  @Output() downloadClick = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<void>();
  @Output() viewClick = new EventEmitter<void>();
  @Output() externalLinkClick = new EventEmitter<void>();
  @Output() trashClick = new EventEmitter<void>();
  @Output() moreActionsClick = new EventEmitter<void>();

  // ── Action handlers — update internal state then emit ─────────
  protected onSwitchToggle(value: boolean): void {
    this._switchOn = value;
    this.switchChange.emit(value);
    this.cdr.detectChanges();
  }

  protected onRadioToggle(): void {
    this._radioSelected = !this._radioSelected;
    this.radioChange.emit();
    this.cdr.detectChanges();
  }

  protected onCheckboxToggle(next: CheckboxType): void {
    this._checkboxType = next;
    this.checkboxChange.emit(next);
    this.cdr.detectChanges();
  }
}
