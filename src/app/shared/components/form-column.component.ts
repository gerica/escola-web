import { Component } from '@angular/core';

@Component({
  selector: 'app-form-column',
  template: `
    <div
      fxLayout="column"
      fxLayoutGap="18px"
    >
      <ng-content />
    </div>
  `,
})
export class FormColumnComponent {}
