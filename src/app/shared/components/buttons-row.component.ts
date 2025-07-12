import { Component } from '@angular/core';

@Component({
  selector: 'app-buttons-row',
  styles: [
    `
      .app-buttons-row__conteudo {
        margin-top: 0.5rem;
      }
    `,
  ],
  template: `
    <div
      fxLayout="row"
      fxLayoutGap="10px"
      fxLayout.lt-sm="column"
      fxLayoutGap.lt-sm="10px"
      class="app-buttons-row__conteudo"
    >
      <ng-content />
    </div>
  `,
})
export class ButtonsRowComponent {}
