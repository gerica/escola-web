import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActionsDownloadComponent } from 'src/app/core/components/sheet/action-download.component';

@Component({
  selector: 'app-buttons-actions',
  templateUrl: './actions.component.html',
  imports: [MatIconModule, MatButtonModule]
})
export class ActionsComponent {
  private readonly bottomSheet = inject(MatBottomSheet);

  @Input({ required: false }) showBtnDownload = true;
  @Output() clickDonwload = new EventEmitter<any>();

  // openBottomSheet() {
  //   this.clickDonwload.emit();
  // }
  openBottomSheet() {
    this.bottomSheet.open(ActionsDownloadComponent, {
      data: {
        callParentFunction: this.emitDonwlod.bind(this), // Pass the function reference
      },
    });
  }

  emitDonwlod(type: string) {
    this.clickDonwload.emit(type);
  }
}
