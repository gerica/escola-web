import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonsRowComponent, InnercardComponent } from 'src/app/shared/components';
import { ModalCardComponent } from 'src/app/shared/components/modalcard';

export class ConfirmDialogModel {
  constructor(
    public title: string,
    public message: string,
  ) { }
}

@Component({
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDivider,
    CommonModule,
    ModalCardComponent,
    ButtonsRowComponent
  ],
})
export class ConfirmDialogComponent implements OnInit {
  public readonly dialogRef = inject<MatDialogRef<ConfirmDialogComponent, boolean>>(MatDialogRef);
  public readonly data = inject<ConfirmDialogModel>(MAT_DIALOG_DATA);
  public readonly sanitizer = inject(DomSanitizer);

  safeMessageHtml: SafeHtml = "";

  ngOnInit(): void {
    if (this.data.message) {
      this.safeMessageHtml = this.sanitizer.bypassSecurityTrustHtml(this.data.message);
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
