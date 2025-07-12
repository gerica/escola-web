import { Component } from '@angular/core';

@Component({
  selector: 'app-slide-toggle-group',
  template: `
    <div
      fxLayout="row"
      fxLayoutGap="50px"
      fxLayout.lt-md="column"
      fxLayoutGap.lt-md="10px"
    >
      <ng-content />
    </div>
  `,
})
export class SlideToggleGroupComponent {}
