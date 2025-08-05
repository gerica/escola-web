import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ButtonsRowComponent, InnercardComponent } from 'src/app/shared/components';
import Contrato from 'src/app/shared/models/contrato';
import { PeriodoPagamentoLabelMapping } from 'src/app/shared/models/periodos-pagamento.enum';
import { StatusContratoLabelMapping } from 'src/app/shared/models/status-contrato.enum';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';


@Component({
  selector: 'conta-receber-detalhe-dialog',
  templateUrl: './detalhe.html',
  styleUrl: '../../../entity-detalhe.scss',
  standalone: true,
  imports: [
    CommonModule,    
    MatButtonModule,
    MatDividerModule,    
    MatDialogModule,
    PrimeiraMaiusculaPipe,
    ButtonsRowComponent,
    InnercardComponent
  ]
})
export class ContratoContasReceberDetalheDialog {
  public readonly data: Contrato = inject(MAT_DIALOG_DATA);
  statusContratoLabelMapping = StatusContratoLabelMapping;
  periodosPagamentoLabelMapping = PeriodoPagamentoLabelMapping;
}
