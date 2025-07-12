import { Component } from '@angular/core';

@Component({
  selector: 'app-form-row',
  template: `
    <div
      fxLayout="row"
      fxLayoutGap="25px"
      fxLayout.lt-lg="column"
      fxLayoutGap.lt-lg="25px"
    >
      <ng-content />
    </div>
  `,
})
export class FormRowComponent {}
