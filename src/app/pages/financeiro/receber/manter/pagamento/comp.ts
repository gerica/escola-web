import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonsRowComponent } from 'src/app/shared/components';
import { ModalCardComponent } from 'src/app/shared/components/modalcard';
import { ContaReceber } from 'src/app/shared/models/conta-receber';
import { StatusContaReceber, StatusContaReceberLabelMapping } from 'src/app/shared/models/status-conta-receber.enum';

// export interface ContaReceberDialogData extends ContaReceber {
//   editar?: boolean; // O '?' indica que é um campo opcional
//   // Adicione outros campos opcionais aqui se precisar no futuro
// }

@Component({
  selector: 'financeiro-conta-receber-pagamento-detalhe-dialog',
  templateUrl: './comp.html',
  styleUrls: ['../../../../entity-detalhe.scss', './comp.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ButtonsRowComponent,
    ModalCardComponent,
    MatDatepickerModule,
  ]
})
export class ContaReceberPagamentoDetalheDialog implements OnInit {
  public readonly data: ContaReceber = inject(MAT_DIALOG_DATA);
  private dialogRef: MatDialogRef<ContaReceberPagamentoDetalheDialog> = inject(MatDialogRef); // Injete MatDialogRef

  ctrlDataPagamento = new FormControl<Date>(new Date(), { nonNullable: true });
  ctrlObservacao = new FormControl('', { nonNullable: true });

  statusContaReceber = Object.values(StatusContaReceber);
  statusContaReceberLabelMapping = StatusContaReceberLabelMapping;


  ngOnInit(): void {
  }

  // --- Novo método para salvar ---
  salvar() {
    const valueToBack = {
      ...this.data,
      valorPago: this.getValorASerPago(),
      dataPagamento: this.ctrlDataPagamento.value,
      observacoes: this.ctrlObservacao.value
    };

    this.dialogRef.close(valueToBack);
  }

  // --- Método para cancelar (opcional) ---
  onDismiss() {
    this.dialogRef.close(); // Fecha o diálogo sem retornar nenhum dado (ou um valor 'undefined')
  }

  getValorASerPago() {
    const valorComDesconto = this.data.valorTotal * (1 - (this.data.desconto / 100));
    // Arredonda para cima para as próximas duas casas decimais (centavos)
    return Math.ceil(valorComDesconto * 100) / 100;
  }
}
