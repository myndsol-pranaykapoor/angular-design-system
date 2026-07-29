import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'pds-option',
  standalone: true,
  imports: [CommonModule, CheckboxComponent, ProfileAvatarComponent, ButtonComponent],
  templateUrl: './option.component.html',
  styleUrl: './option.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class OptionComponent {
  /** Option label — Body/2 */
  @Input() label = 'Option Text';

  /** 16px supporting icon from /icons/16px/ */
  @Input() icon = 'life-buoy';

  /** Profile-avatar image (size/0, image type) */
  @Input() avatarSrc = '/images/avatar.png';
  @Input() showAvatarBadge = true;

  /** Checkbox checked state */
  @Input() checked = false;

  /** Disabled state */
  @Input() disabled = false;

  /** Force the hover appearance (for previews/showcases) */
  @Input() forceHover = false;

  /** Toggle individual sub-elements (default: all visible) */
  @Input() showCheckbox = true;
  @Input() showAvatar = true;
  @Input() showIcon = true;

  /** Action button (Size/0 tertiary only-icon) — appears on the right when showActionButton is true */
  @Input() actionButtonIcon = 'more-vertical';
  @Input() showActionButton = false;

  @Output() selected = new EventEmitter<boolean>();
  @Output() actionButtonClick = new EventEmitter<void>();

  get checkboxType(): 'checked' | 'cleared' {
    return this.checked ? 'checked' : 'cleared';
  }

  get iconPath(): string {
    return `/icons/16px/${this.icon}.svg`;
  }

  onClick(): void {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.selected.emit(this.checked);
  }

  onActionButtonClick(event: Event): void {
    event.stopPropagation();
    this.actionButtonClick.emit();
  }
}
