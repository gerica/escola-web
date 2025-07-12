import { Component } from '@angular/core';

@Component({
  template: `
    <div style="display: flex; justify-content: center; align-items: center; flex-direction: column; height: 100%;">
      <div>
        <h1>404 - Página não encontrada</h1>
      </div>
      <div style="font-size: 12px;">
        <span>404</span>
        <p>A página não foi encontrada</p>
        <a routerLink="home">Ir para a página inicial</a>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
