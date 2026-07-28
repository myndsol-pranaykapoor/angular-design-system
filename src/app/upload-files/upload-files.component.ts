import { Component, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { PopupLayoutComponent } from '../popup-layout/popup-layout.component';
import { PopUpHeaderComponent } from '../pop-up-header/pop-up-header.component';
import { PopUpFooterComponent } from '../pop-up-footer/pop-up-footer.component';
import { ChipTagComponent, ChipTagColorScheme } from '../chip-tag/chip-tag.component';
import { DropAreaComponent } from '../drop-area/drop-area.component';
import { ScrollerComponent } from '../scroller/scroller.component';
import { FileRowComponent, FileRowState } from '../file-row/file-row.component';

export interface UploadFile {
  name: string;
  state: FileRowState;
  size?: string;       // success
  progress?: number;   // in-process (0–100)
}

@Component({
  selector: 'pds-upload-files',
  standalone: true,
  imports: [
    PopupLayoutComponent, PopUpHeaderComponent, PopUpFooterComponent,
    ChipTagComponent, DropAreaComponent, ScrollerComponent, FileRowComponent,
  ],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class UploadFilesComponent implements OnDestroy {
  @Input() title = 'Upload Files';
  @Input() subtitle = 'Long subtitle text will display here like this.';
  @Input() downloadSampleLabel = 'Download Sample';

  /** Initial / preset files — cloned into the internal list when the component opens */
  private initialFiles: UploadFile[] = [];
  @Input() set files(value: UploadFile[]) {
    this.initialFiles = value ?? [];
    this.items = this.initialFiles.map(f => ({ ...f }));
  }

  private _visible = false;
  @Input() set visible(v: boolean) {
    this._visible = v;
    if (v) {
      this.items = this.initialFiles.map(f => ({ ...f }));  // fresh state on open
    } else {
      this.clearAllTimers();
    }
  }
  get visible(): boolean { return this._visible; }

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<UploadFile[]>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() downloadSample = new EventEmitter<void>();
  @Output() filesSelected = new EventEmitter<File[]>();

  /** The live list of files shown in the component */
  protected items: UploadFile[] = [];
  private timers = new Map<UploadFile, ReturnType<typeof setInterval>>();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy(): void { this.clearAllTimers(); }

  get isEmpty(): boolean { return this.items.length === 0; }

  get successCount(): number { return this.items.filter(f => f.state === 'success').length; }
  get failedCount(): number  { return this.items.filter(f => f.state === 'failed').length; }
  get pendingCount(): number { return this.items.filter(f => f.state === 'in-process').length; }

  /** Semantic scheme when count > 0, else muted (Grey/1 bg · Grey/5 icon+text+border) */
  scheme(count: number, active: ChipTagColorScheme): ChipTagColorScheme {
    return count === 0 ? 'muted' : active;
  }

  pad(n: number): string { return String(n).padStart(2, '0'); }

  // ── UPLOAD FLOW ──────────────────────────────────────────────────────────
  /** Called when files are picked (click) or dropped onto the drop-area */
  onFilesSelected(files: File[]): void {
    this.filesSelected.emit(files);
    for (const file of files) {
      const item: UploadFile = {
        name: file.name,
        state: 'in-process',
        progress: 0,
        size: this.formatSize(file.size),
      };
      this.items = [...this.items, item];
      this.startUpload(item, file);
    }
  }

  /** Simulate the upload — progress fills, then resolves to success (or failed) */
  private startUpload(item: UploadFile, file: File): void {
    // demo rule: a file whose name contains "fail" simulates an upload failure
    const willFail = /fail/i.test(file.name);
    const timer = setInterval(() => {
      item.progress = Math.min(100, (item.progress ?? 0) + 5);
      if (item.progress >= 100) {
        clearInterval(timer);
        this.timers.delete(item);
        if (willFail) {
          item.state = 'failed';            // upload failed → file not uploaded
        } else {
          item.state = 'success';           // upload complete
          item.progress = 100;
        }
      }
      this.cdr.detectChanges();             // zoneless: reflect progress/state changes
    }, 120);
    this.timers.set(item, timer);
  }

  /** Remove a file (cancel button on its row) */
  removeFile(item: UploadFile): void {
    const t = this.timers.get(item);
    if (t) { clearInterval(t); this.timers.delete(item); }
    this.items = this.items.filter(i => i !== item);
  }

  private clearAllTimers(): void {
    this.timers.forEach(t => clearInterval(t));
    this.timers.clear();
  }

  private formatSize(bytes: number): string {
    if (!bytes) return '0 KB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  }

  // ── FOOTER ───────────────────────────────────────────────────────────────
  onCancel(): void { this.clearAllTimers(); this.cancelled.emit(); this.closed.emit(); }

  onConfirm(): void {
    const uploaded = this.items.filter(i => i.state === 'success');
    this.confirmed.emit(uploaded);
    this.closed.emit();
  }
}
