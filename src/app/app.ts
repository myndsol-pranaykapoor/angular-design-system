import { Component, signal } from '@angular/core';
import { AlertBadgeComponent } from './alert-badge/alert-badge.component';
import { ButtonComponent, ButtonSize } from './button/button.component';
import { ChipTagComponent, ChipTagSize } from './chip-tag/chip-tag.component';
import { CardHeaderComponent } from './card-header/card-header.component';
import { CardFooterComponent } from './card-footer/card-footer.component';
import { ToastComponent, ToastType } from './toast/toast.component';
import { SwitchComponent, SwitchSize } from './switch/switch.component';
import { RadioComponent, RadioSize } from './radio/radio.component';
import { CheckboxComponent, CheckboxType, CheckboxSize } from './checkbox/checkbox.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { ScrollerComponent } from './scroller/scroller.component';
import { PopupLayoutComponent } from './popup-layout/popup-layout.component';
import { ProfileAvatarComponent } from './profile-avatar/profile-avatar.component';
import { WebHeaderComponent } from './web-header/web-header.component';
import { SemanticPopupComponent } from './semantic-popup/semantic-popup.component';
import { SearchComponent } from './search/search.component';
import { CommandBarComponent } from './command-bar/command-bar.component';
import { SideMenuItemComponent } from './side-menu-item/side-menu-item.component';
import { SideMenuItemsCollectionComponent, CollectionItem } from './side-menu-items-collection/side-menu-items-collection.component';
import { SideMenuComponent, SideMenuEntry } from './side-menu/side-menu.component';
import { WebFooterComponent } from './web-footer/web-footer.component';
import { OptionComponent } from './option/option.component';
import { SelectorComponent, SelectorOption } from './selector/selector.component';
import { DateTimeSelectionStateComponent, DateTimeSelectionState } from './date-time-selection-state/date-time-selection-state.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { UploadFilesComponent, UploadFile } from './upload-files/upload-files.component';
import { LabelContainerComponent } from './label-container/label-container.component';
import { InputAreaComponent } from './input-area/input-area.component';
import { InputFieldComponent, InputFieldState } from './input-field/input-field.component';
import { ToolTipComponent } from './tool-tip/tool-tip.component';
import { FilterSectionComponent, FilterOption, FilterInputRow } from './filter-section/filter-section.component';
import { FilterDrawerComponent, FilterDrawerSection } from './filter-drawer/filter-drawer.component';

@Component({
  selector: 'app-root',
  imports: [AlertBadgeComponent, ButtonComponent, ChipTagComponent, CardHeaderComponent, CardFooterComponent, ToastComponent, SwitchComponent, RadioComponent, CheckboxComponent, ProgressBarComponent, ScrollerComponent, PopupLayoutComponent, ProfileAvatarComponent, WebHeaderComponent, SemanticPopupComponent, SearchComponent, CommandBarComponent, SideMenuItemComponent, SideMenuItemsCollectionComponent, SideMenuComponent, WebFooterComponent, OptionComponent, SelectorComponent, DateTimeSelectionStateComponent, DatePickerComponent, TimePickerComponent, UploadFilesComponent, LabelContainerComponent, InputAreaComponent, InputFieldComponent, ToolTipComponent, FilterSectionComponent, FilterDrawerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly sizes: ButtonSize[] = [0, 1, 2, 3];
  protected readonly scrollerItems = Array.from({ length: 14 }, (_, i) => `List item ${i + 1}`);
  protected readonly chipSizes: ChipTagSize[] = [0, 1];
  protected readonly switchSizes: SwitchSize[] = [0, 1, 2];
  // [size-index][0 = left switch, 1 = right switch]
  protected switchStates = [
    [false, true],
    [false, true],
    [false, true],
  ];

  protected readonly radioSizes: RadioSize[] = [0, 1, 2];
  // [size-index][0 = left radio, 1 = right radio]
  protected radioStates = [
    [false, true],
    [false, true],
    [false, true],
  ];

  protected toggleRadio(sizeIndex: number, radioIndex: number): void {
    this.radioStates[sizeIndex][radioIndex] = !this.radioStates[sizeIndex][radioIndex];
  }

  protected readonly checkboxSizes: CheckboxSize[] = [0, 1, 2];
  // [size-index][0 = left, 1 = right] — cycle: cleared → checked → indeterminate
  protected checkboxStates: CheckboxType[][] = [
    ['cleared', 'checked'],
    ['cleared', 'checked'],
    ['cleared', 'checked'],
  ];

  protected onCheckboxChanged(sizeIndex: number, cbIndex: number, next: CheckboxType): void {
    this.checkboxStates[sizeIndex][cbIndex] = next;
  }

  protected toggleSwitch(sizeIndex: number, swIndex: number, value: boolean): void {
    this.switchStates[sizeIndex][swIndex] = value;
  }

  protected demoProgress = signal(0);
  private demoTimer: ReturnType<typeof setInterval> | null = null;

  protected startProgressDemo(): void {
    if (this.demoTimer) clearInterval(this.demoTimer);
    this.demoProgress.set(0);
    this.demoTimer = setInterval(() => {
      this.demoProgress.update(v => v + 1);
      if (this.demoProgress() >= 100) {
        clearInterval(this.demoTimer!);
        this.demoTimer = null;
        setTimeout(() => this.demoProgress.set(0), 600);
      }
    }, 30);
  }

  protected popupVisible = false;
  protected openPopup(): void { this.popupVisible = true; }
  protected closePopup(): void { this.popupVisible = false; }

  protected successPopupOpen = signal(false);
  protected warningPopupOpen = signal(false);
  protected errorPopupOpen  = signal(false);

  protected toastVisible = false;
  protected toastType: ToastType = 'success';
  protected toastMessage = '';

  protected showToast(type: ToastType, message: string): void {
    this.toastType = type;
    this.toastMessage = message;
    this.toastVisible = true;
  }

  protected onToastDismissed(): void {
    this.toastVisible = false;
  }

  protected onSearch(query: string): void {
    console.log('Search query:', query);
  }

  protected onSearchCleared(): void {
    console.log('Search cleared');
  }

  /** Search suggestions — each label maps 1:1 to a section title rendered in <main> */
  protected searchSuggestions: string[] = [
    'Alert Badge',
    'Button',
    'Chip Tag',
    'Card Header',
    'Card Footer',
    'Toast',
    'Switch',
    'Radio',
    'Checkbox',
    'Progress Bar',
    'Scroller',
    'Pop-up Layout',
    'Semantic Pop-ups',
    'Profile Avatar',
    'Side Menu Item',
    'Side Menu Items Collection',
    'Search',
    'Option',
    'Selector',
    'Web Footer',
    'Date-Time Selection States',
    'Date Picker',
    'Time Picker',
    'Upload Files',
    'Input Field',
    'Tool Tip',
    'Filter Section',
    'Filter Drawer',
  ];

  /** Filter Drawer demo */
  protected filterDrawerOpen = false;
  protected filterDrawerSections: FilterDrawerSection[] = [
    {
      type: 'multi-selection',
      title: 'Fruits',
      options: [
        { label: 'Apple', checked: true },
        { label: 'Banana', checked: true },
        { label: 'Cherry', checked: false },
        { label: 'Dragon Fruit', checked: false },
        { label: 'Elderberry', checked: false },
        { label: 'Fig', checked: false },
        { label: 'Grapefruit', checked: false },
        { label: 'Honeydew', checked: false },
        { label: 'Kiwi', checked: false },
        { label: 'Lemon', checked: false },
      ],
    },
    {
      type: 'multi-selection',
      title: 'Colours',
      options: [
        { label: 'Red', checked: false },
        { label: 'Orange', checked: false },
        { label: 'Yellow', checked: false },
        { label: 'Green', checked: false },
        { label: 'Blue', checked: false },
        { label: 'Indigo', checked: false },
        { label: 'Violet', checked: false },
      ],
    },
    {
      type: 'input',
      title: 'Details',
      inputRows: [
        [
          { type: 'field', label: 'Label', placeholder: 'Input Value' },
          { type: 'attachment', label: 'Label' },
        ],
        [{ type: 'text-area', label: 'Label', placeholder: 'Place holder' }],
      ],
    },
    {
      type: 'input',
      title: 'Notes',
      inputRows: [[{ type: 'text-area', label: 'Label', placeholder: 'Place holder' }]],
    },
    {
      type: 'multi-selection',
      title: 'Sizes',
      options: [
        { label: 'Extra Small', checked: false },
        { label: 'Small', checked: false },
        { label: 'Medium', checked: false },
        { label: 'Large', checked: false },
        { label: 'Extra Large', checked: false },
      ],
    },
    {
      type: 'multi-selection',
      title: 'Brands',
      options: [
        { label: 'Acme', checked: false },
        { label: 'Globex', checked: false },
        { label: 'Initech', checked: false },
        { label: 'Umbrella', checked: false },
        { label: 'Stark', checked: false },
        { label: 'Wayne', checked: false },
      ],
    },
    {
      type: 'input',
      title: 'Price Range',
      inputRows: [
        [
          { type: 'field', label: 'Min', placeholder: '0' },
          { type: 'field', label: 'Max', placeholder: '1000' },
        ],
      ],
    },
    {
      type: 'multi-selection',
      title: 'Ratings',
      options: [
        { label: '5 Stars', checked: false },
        { label: '4 Stars & up', checked: false },
        { label: '3 Stars & up', checked: false },
        { label: '2 Stars & up', checked: false },
        { label: '1 Star & up', checked: false },
      ],
    },
    {
      type: 'input',
      title: 'Tags',
      inputRows: [[{ type: 'text-area', label: 'Label', placeholder: 'Comma separated tags' }]],
    },
    {
      type: 'multi-selection',
      title: 'Availability',
      options: [
        { label: 'In Stock', checked: false },
        { label: 'Out of Stock', checked: false },
        { label: 'Pre-order', checked: false },
        { label: 'Backorder', checked: false },
      ],
    },
    {
      type: 'multi-selection',
      title: 'Materials',
      options: [
        { label: 'Cotton', checked: false },
        { label: 'Polyester', checked: false },
        { label: 'Wool', checked: false },
        { label: 'Leather', checked: false },
        { label: 'Denim', checked: false },
        { label: 'Silk', checked: false },
      ],
    },
    {
      type: 'multi-selection',
      title: 'Categories',
      options: [
        { label: 'Electronics', checked: false },
        { label: 'Apparel', checked: false },
        { label: 'Home & Garden', checked: false },
        { label: 'Sports', checked: false },
        { label: 'Toys', checked: false },
        { label: 'Books', checked: false },
        { label: 'Beauty', checked: false },
      ],
    },
    {
      type: 'input',
      title: 'Date Range',
      inputRows: [
        [
          { type: 'field', label: 'From', placeholder: 'DD/MM/YYYY' },
          { type: 'field', label: 'To', placeholder: 'DD/MM/YYYY' },
        ],
      ],
    },
    {
      type: 'multi-selection',
      title: 'Shipping',
      options: [
        { label: 'Free Shipping', checked: false },
        { label: 'Express', checked: false },
        { label: 'Same Day', checked: false },
        { label: 'International', checked: false },
      ],
    },
    {
      type: 'multi-selection',
      title: 'Condition',
      options: [
        { label: 'New', checked: false },
        { label: 'Refurbished', checked: false },
        { label: 'Used - Like New', checked: false },
        { label: 'Used - Good', checked: false },
      ],
    },
    {
      type: 'input',
      title: 'Seller Notes',
      inputRows: [[{ type: 'text-area', label: 'Label', placeholder: 'Place holder' }]],
    },
    {
      type: 'multi-selection',
      title: 'Discounts',
      options: [
        { label: '10% off or more', checked: false },
        { label: '25% off or more', checked: false },
        { label: '50% off or more', checked: false },
        { label: 'Clearance', checked: false },
      ],
    },
  ];

  /** Total active filters — checked options + filled input fields across every section */
  protected get filterSelectionCount(): number {
    return this.filterDrawerSections.reduce((sum, section) => {
      if (section.type === 'multi-selection') {
        return sum + (section.options?.filter((o) => o.checked).length ?? 0);
      }
      return sum + (section.inputRows?.reduce(
        (rowSum, row) => rowSum + row.filter((f) => !!f.value).length, 0) ?? 0);
    }, 0);
  }

  /** Filter Section demo data */
  protected filterOptions: FilterOption[] = [
    { label: 'Apple', checked: true },
    { label: 'Banana', checked: true },
    { label: 'Cherry', checked: false },
    { label: 'Dragon Fruit', checked: false },
    { label: 'Elderberry', checked: false },
    { label: 'Fig', checked: false },
    { label: 'Grapefruit', checked: false },
    { label: 'Honeydew', checked: false },
    { label: 'Kiwi', checked: false },
    { label: 'Lemon', checked: false },
  ];

  protected filterInputRows: FilterInputRow[] = [
    [
      { type: 'field', label: 'Label', placeholder: 'Input Value' },
      { type: 'attachment', label: 'Label' },
    ],
    [
      { type: 'field', label: 'Label', placeholder: 'Input Value' },
      { type: 'attachment', label: 'Label' },
    ],
    [
      { type: 'text-area', label: 'Label', placeholder: 'Place holder' },
    ],
  ];

  /** Pre-filled rows for the collapsed demo (shows the count chip) */
  protected filterInputRowsFilled: FilterInputRow[] = [
    [
      { type: 'field', label: 'Label', value: 'Input Value' },
      { type: 'attachment', label: 'Label', value: 'Attached File' },
    ],
    [
      { type: 'field', label: 'Label', value: 'Input Value' },
      { type: 'attachment', label: 'Label', value: 'Attached File' },
    ],
    [
      { type: 'text-area', label: 'Label', placeholder: 'Place holder' },
    ],
  ];

  /** When user picks a suggestion, smooth-scroll the page to that section */
  protected onSearchSelected(value: string): void {
    const slug = value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const id = `sec-${slug}`;
    const el = document.getElementById(id);
    if (!el) {
      console.warn('No section found for', value, '→ id:', id);
      return;
    }
    // 84px = web-header (42) + command-bar (42); add 12px breathing room
    const offset = 84 + 12;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  protected onCommandBarBack(): void {
    console.log('Navigate back');
  }

  // ── SIDE MENU ITEMS COLLECTION DEMO ──────────────────────────────────────
  protected smicExpandedId = 'home';
  protected smicSelectedId = '';

  protected smicCollections: { id: string; title: string; icon: string; items: CollectionItem[] }[] = [
    {
      id: 'home',
      title: 'Home',
      icon: 'home',
      items: [
        {
          id: 'dashboard', title: 'Dashboard', children: [
            { id: 'overview',   title: 'Overview' },
            { id: 'analytics',  title: 'Analytics' },
            { id: 'reports',    title: 'Reports' },
          ]
        },
        {
          id: 'settings', title: 'Settings', children: [
            { id: 'general',       title: 'General' },
            { id: 'security',      title: 'Security' },
            { id: 'notifications', title: 'Notifications' },
          ]
        },
        { id: 'users', title: 'Users' },
      ]
    },
    {
      id: 'profile',
      title: 'Profile',
      icon: 'user',
      items: [
        {
          id: 'account', title: 'Account', children: [
            { id: 'personal', title: 'Personal Info' },
            { id: 'billing',  title: 'Billing' },
          ]
        },
        { id: 'logout', title: 'Logout' },
      ]
    },
  ];

  protected onSmicExpandToggle(id: string): void {
    this.smicExpandedId = this.smicExpandedId === id ? '' : id;
  }

  protected onSmicItemSelected(id: string): void {
    this.smicSelectedId = id;
  }

  // ── SIDE MENU DEMO ────────────────────────────────────────────────────────
  protected sideMenuEntries: SideMenuEntry[] = [
    {
      id: 'home', title: 'Home', icon: 'home', type: 'collection',
      items: [
        {
          id: 'dashboard', title: 'Dashboard', children: [
            { id: 'overview', title: 'Overview' },
            { id: 'analytics', title: 'Analytics' },
            { id: 'reports', title: 'Reports' },
          ]
        },
        {
          id: 'settings', title: 'Settings', children: [
            { id: 'general', title: 'General' },
            { id: 'security', title: 'Security' },
          ]
        },
        { id: 'users', title: 'Users' },
      ]
    },
    { id: 'profile', title: 'Profile', icon: 'user', type: 'item' },
    {
      id: 'reports', title: 'Reports', icon: 'file', type: 'collection',
      items: [
        { id: 'monthly', title: 'Monthly' },
        { id: 'annual', title: 'Annual' },
        { id: 'quarterly', title: 'Quarterly' },
        { id: 'custom-reports', title: 'Custom Reports' },
      ]
    },
    {
      id: 'projects', title: 'Projects', icon: 'briefcase', type: 'collection',
      items: [
        {
          id: 'active', title: 'Active Projects', children: [
            { id: 'project-a', title: 'Project Alpha' },
            { id: 'project-b', title: 'Project Beta' },
            { id: 'project-c', title: 'Project Gamma' },
          ]
        },
        {
          id: 'archived', title: 'Archived', children: [
            { id: 'archived-1', title: '2024 Projects' },
            { id: 'archived-2', title: '2023 Projects' },
          ]
        },
        { id: 'create-project', title: 'Create New' },
      ]
    },
    {
      id: 'team', title: 'Team', icon: 'users', type: 'collection',
      items: [
        { id: 'members', title: 'Members' },
        { id: 'roles', title: 'Roles & Permissions' },
        { id: 'invitations', title: 'Invitations' },
        { id: 'activity', title: 'Activity Log' },
      ]
    },
    { id: 'messages', title: 'Messages', icon: 'message-circle', type: 'item' },
    { id: 'notifications', title: 'Notifications', icon: 'bell', type: 'item' },
    { id: 'calendar', title: 'Calendar', icon: 'calendar', type: 'item' },
    {
      id: 'analytics', title: 'Analytics', icon: 'bar-chart-2', type: 'collection',
      items: [
        {
          id: 'sales-analytics', title: 'Sales', children: [
            { id: 'revenue', title: 'Revenue' },
            { id: 'conversion', title: 'Conversion' },
            { id: 'funnel', title: 'Funnel' },
          ]
        },
        {
          id: 'traffic-analytics', title: 'Traffic', children: [
            { id: 'sources', title: 'Sources' },
            { id: 'pages', title: 'Top Pages' },
          ]
        },
        { id: 'real-time', title: 'Real-time' },
      ]
    },
    {
      id: 'finance', title: 'Finance', icon: 'money', type: 'collection',
      items: [
        { id: 'invoices', title: 'Invoices' },
        { id: 'payments', title: 'Payments' },
        { id: 'expenses', title: 'Expenses' },
        { id: 'tax', title: 'Tax Reports' },
      ]
    },
    {
      id: 'inventory', title: 'Inventory', icon: 'package', type: 'collection',
      items: [
        { id: 'products', title: 'Products' },
        { id: 'stock', title: 'Stock Levels' },
        { id: 'suppliers', title: 'Suppliers' },
      ]
    },
    { id: 'orders', title: 'Orders', icon: 'shopping-cart', type: 'item' },
    { id: 'customers', title: 'Customers', icon: 'user-check', type: 'item' },
    {
      id: 'integrations', title: 'Integrations', icon: 'link', type: 'collection',
      items: [
        { id: 'api', title: 'API Keys' },
        { id: 'webhooks', title: 'Webhooks' },
        { id: 'third-party', title: 'Third-party Apps' },
      ]
    },
    {
      id: 'settings-menu', title: 'Settings', icon: 'settings', type: 'collection',
      items: [
        {
          id: 'account-settings', title: 'Account', children: [
            { id: 'profile-settings', title: 'Profile' },
            { id: 'password', title: 'Password' },
            { id: 'two-factor', title: 'Two-Factor Auth' },
          ]
        },
        {
          id: 'workspace', title: 'Workspace', children: [
            { id: 'general-ws', title: 'General' },
            { id: 'branding', title: 'Branding' },
            { id: 'preferences', title: 'Preferences' },
          ]
        },
        { id: 'billing', title: 'Billing' },
        { id: 'data-export', title: 'Data Export' },
      ]
    },
    { id: 'help', title: 'Help & Support', icon: 'help-circle', type: 'item' },
    { id: 'feedback', title: 'Feedback', icon: 'message-square', type: 'item' },
    { id: 'logout', title: 'Logout', icon: 'log-out', type: 'item' },
  ];

  // ── DATE-TIME SELECTION STATES DEMO ──────────────────────────────────────
  protected readonly dtStates: { state: DateTimeSelectionState; label: string }[] = [
    { state: 'default',              label: 'Default' },
    { state: 'default-hover',        label: 'Default Hover' },
    { state: 'now',                  label: 'Now' },
    { state: 'now-hover',            label: 'Now Hover' },
    { state: 'selected-range',       label: 'Sel. Range' },
    { state: 'selected-range-hover', label: 'Sel. Range Hover' },
    { state: 'selected',             label: 'Selected' },
    { state: 'excluded',             label: 'Excluded' },
  ];

  // ── DATE PICKER DEMO ─────────────────────────────────────────────────────
  protected datePickerVisible = signal(false);
  protected yearPickerVisible = signal(false);
  protected monthPickerVisible = signal(false);
  protected rangePickerVisible = signal(false);
  protected time12Visible = signal(false);
  protected time24Visible = signal(false);
  protected selectedTimeStr = signal('');
  protected selectedDateStr = signal('');

  protected onTimeSelected(value: string): void {
    this.selectedTimeStr.set(value);
  }

  /** Demo validator — drives input-field state from the entered value */
  protected validateInput = (v: string): { state: InputFieldState; message?: string } | null => {
    if (!v) return null;
    const s = v.toLowerCase();
    if (s.includes('error') || v.length < 3) return { state: 'error', message: 'Incorrect value entered' };
    if (s.includes('warn')) return { state: 'warning', message: 'This value may cause an error later' };
    return { state: 'accepted', message: 'Looks good!' };
  };

  protected uploadFilesVisible = signal(false);
  protected uploadEmptyVisible = signal(false);
  protected sampleUploadFiles: UploadFile[] = [
    { name: 'file.long.name.pdf', state: 'success', size: '500 MB' },
    { name: 'file.long.name.pdf', state: 'failed' },
    { name: 'file.long.name.pdf', state: 'in-process', progress: 50 },
    { name: 'file.long.name.pdf', state: 'in-process', progress: 35 },
    { name: 'file.long.name.pdf', state: 'in-process', progress: 70 },
    { name: 'file.long.name.pdf', state: 'in-process', progress: 20 },
    { name: 'file.long.name.pdf', state: 'in-process', progress: 60 },
    { name: 'file.long.name.pdf', state: 'in-process', progress: 45 },
    { name: 'file.long.name.pdf', state: 'in-process', progress: 80 },
  ];

  protected onDateSelected(date: Date): void {
    this.selectedDateStr.set(date.toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' }));
  }

  // ── SELECTOR DEMO ─────────────────────────────────────────────────────────
  // ≤ 6 options — no scroller
  protected selectorFew: SelectorOption[] = [
    { label: 'Option One' },
    { label: 'Option Two', checked: true },
    { label: 'Option Three' },
    { label: 'Option Four', disabled: true },
    { label: 'Option Five' },
    { label: 'Option Six' },
  ];

  // > 6 options — scroller appears
  protected selectorMany: SelectorOption[] = Array.from({ length: 12 }, (_, i) => ({
    label: `Option ${i + 1}`,
    checked: i === 1,
    disabled: i === 3,
  }));
}
