import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { ProfileAvatarComponent } from '../profile-avatar/profile-avatar.component';

@Component({
  selector: 'pds-web-header',
  standalone: true,
  imports: [ButtonComponent, ProfileAvatarComponent],
  templateUrl: './web-header.component.html',
  styleUrl: './web-header.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class WebHeaderComponent {
  /** URL of the logo image (left-aligned, proportionate fit within 100×30px) */
  @Input() logoSrc = '';
  @Input() logoAlt = 'Logo';

  /** Notification bell badge count — badge hidden when 0 */
  @Input() notificationCount = 0;

  /** User profile */
  @Input() userAvatarSrc = '';
  @Input() userName = '';
  @Input() userDesignation = '';

  @Output() notificationClick = new EventEmitter<void>();
  @Output() userMenuClick = new EventEmitter<void>();
}
