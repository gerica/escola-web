import { Component } from '@angular/core';

@Component({
  selector: 'app-field-container',
  template: `
    <div
      fxLayout="column"
      fxLayoutGap="0.2rem"
    >
      <ng-content />
    </div>
  `,
})
export class FieldContainerComponent {}
