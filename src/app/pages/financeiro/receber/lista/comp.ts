import { Component } from '@angular/core';
import { ContratoListComp } from 'src/app/pages/cliente/contrato/lista/comp';

@Component({
  template: '<app-contratos-list [isModuloFinanceiro]="true"/>',
  imports: [ContratoListComp]
})
export class ListComp { }
