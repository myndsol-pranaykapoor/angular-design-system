import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'pds-drop-area',
  standalone: true,
  templateUrl: './drop-area.component.html',
  styleUrl: './drop-area.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class DropAreaComponent {
  /** Force the hover state for showcase/static display (real :hover also works) */
  @Input() forceHover = false;

  /** Main direction line — "CLICK HERE" is rendered as the styled link span */
  @Input() mainPrefix = 'Drag and drop or ';
  @Input() linkLabel = 'CLICK HERE';
  @Input() mainSuffix = ' to upload files';

  /** Sub direction line */
  @Input() subText = 'Acceptable file - PDF, PNG, JPG & < 01mb.';

  /** Accepted file types for the system file dialog */
  @Input() accept = '.pdf,.png,.jpg,.jpeg';
  /** Allow selecting multiple files */
  @Input() multiple = true;

  /** Emits the files the user picks from the system dialog */
  @Output() filesSelected = new EventEmitter<File[]>();

  @ViewChild('fileInput') private fileInput!: ElementRef<HTMLInputElement>;

  /** True while a file is being dragged over — drives the hover visual state */
  protected dragging = false;
  /** Counter to handle dragenter/dragleave bubbling through child elements */
  private dragDepth = 0;

  /** Open the system file picker (triggered by the CLICK HERE text) */
  openFileDialog(event: Event): void {
    event.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  onFilesChosen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.filesSelected.emit(Array.from(input.files));
    }
    input.value = '';   // reset so the same file can be re-selected
  }

  // ── DRAG & DROP ──────────────────────────────────────────────────────────
  onDragEnter(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth++;
    this.dragging = true;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();   // required so the drop event fires
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth--;
    if (this.dragDepth <= 0) {
      this.dragDepth = 0;
      this.dragging = false;
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragDepth = 0;
    this.dragging = false;
    const files = event.dataTransfer?.files;
    if (files && files.length) {
      this.filesSelected.emit(Array.from(files));
    }
  }
}
