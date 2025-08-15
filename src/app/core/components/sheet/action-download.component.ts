import { Component, inject } from "@angular/core";
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { MatListModule } from "@angular/material/list";

@Component({
    selector: 'bottom-sheet-overview-example-sheet',
    template: `
  <mat-nav-list>
    <a mat-list-item (click)="openLink($event, 'PDF')">
      <span matListItemTitle>Download</span>
      <span matLine>Baixar arquivo em PDF</span>
    </a>
    <a mat-list-item (click)="openLink($event, 'ODS')">
      <span matListItemTitle>Download</span>
      <span matLine>Baixar arquivo em ODS</span>
    </a>
  </mat-nav-list>

  `,
    standalone: true,
    imports: [MatListModule],
})
export class ActionsDownloadComponent {
    public readonly data: any = inject(MAT_BOTTOM_SHEET_DATA);
    private _bottomSheetRef = inject<MatBottomSheetRef<ActionsDownloadComponent>>(MatBottomSheetRef);

    openLink(event: MouseEvent, type: string): void {
        this._bottomSheetRef.dismiss();
        if (this.data.callParentFunction) {
            this.data.callParentFunction(type); // Call the passed function
        }
        event.preventDefault();
    }
}