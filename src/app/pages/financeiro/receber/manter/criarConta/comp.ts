import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonsRowComponent } from 'src/app/shared/components';
import { ModalCardComponent } from 'src/app/shared/components/modalcard';
import Contrato from 'src/app/shared/models/contrato';

export interface ContratoDialogData extends Contrato {
  valorTotalPago: number; // O '?' indica que é um campo opcional
  // Adicione outros campos opcionais aqui se precisar no futuro:
}

@Component({
  selector: 'financeiro-conta-receber-criar-conta-dialog',
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
export class ContaReceberCriarContaDialog implements OnInit {
  public readonly data: ContratoDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef: MatDialogRef<ContaReceberCriarContaDialog> = inject(MatDialogRef); // Injete MatDialogRef
  private readonly fb = inject(FormBuilder);
  form!: FormGroup;

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    const dataVencimentoDefault = new Date();
    dataVencimentoDefault.setDate(dataVencimentoDefault.getDate() + 3);

    this.form = this.fb.group({
      valorTotal: [this.data.valorTotal - this.data.valorTotalPago, Validators.required],
      desconto: [this.data.desconto, Validators.required],
      dataVencimento: [dataVencimentoDefault, Validators.required],
      observacoes: [null],
    });
  }

  // --- Novo método para salvar ---
  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.dialogRef.close(this.form.value);
  }

  // --- Método para cancelar (opcional) ---
  onDismiss() {
    this.dialogRef.close(); // Fecha o diálogo sem retornar nenhum dado (ou um valor 'undefined')
  }
}
