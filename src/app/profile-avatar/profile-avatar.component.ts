import { Component, Input, ViewEncapsulation } from '@angular/core';
import { AlertBadgeComponent } from '../alert-badge/alert-badge.component';

export type AvatarType = 'icon' | 'credentials' | 'image';
export type AvatarSize = 0 | 1 | 2;

@Component({
  selector: 'pds-profile-avatar',
  standalone: true,
  imports: [AlertBadgeComponent],
  templateUrl: './profile-avatar.component.html',
  styleUrl: './profile-avatar.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ProfileAvatarComponent {
  @Input() type: AvatarType = 'credentials';
  @Input() size: AvatarSize = 1;
  /** Background colour — any colour per user context. Ignored for image type. */
  @Input() color = '#00ad61';       // Primary/3 default
  /** Icon name from /icons/{size}px/ (icon type only) */
  @Input() icon = 'user';
  /** 1–2 letter initials (credentials type only) */
  @Input() initials = 'PK';
  /** Image URL (image type only) */
  @Input() imageSrc = '';
  @Input() showBadge = true;

  get hostClasses(): string[] {
    return [
      'pds-profile-avatar',
      `pds-profile-avatar--size-${this.size}`,
      `pds-profile-avatar--${this.type}`,
    ];
  }

  get iconFolder(): string {
    const px: Record<AvatarSize, string> = { 0: '12', 1: '16', 2: '20' };
    return `/icons/${px[this.size]}px`;
  }

  get resolvedInitials(): string {
    return this.initials.slice(0, 2).toUpperCase();
  }
}
