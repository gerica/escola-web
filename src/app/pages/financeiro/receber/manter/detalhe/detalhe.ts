import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonsRowComponent } from 'src/app/shared/components';
import { ModalCardComponent } from 'src/app/shared/components/modalcard';
import { ContaReceber } from 'src/app/shared/models/conta-receber';
import { StatusContaReceber, StatusContaReceberLabelMapping } from 'src/app/shared/models/status-conta-receber.enum';
import { StatusMatricula, StatusMatriculaLabelMapping } from 'src/app/shared/models/status-matricula.enum';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';

export interface ContaReceberDialogData extends ContaReceber {
  editar?: boolean; // O '?' indica que é um campo opcional
  // Adicione outros campos opcionais aqui se precisar no futuro
}

@Component({
  selector: 'empresa-detalhe-dialog',
  templateUrl: './detalhe.html',
  styleUrls: ['../../../../entity-detalhe.scss', './detalhe.scss'],
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
    ModalCardComponent
  ]
})
export class ContaReceberDetalheDialog implements OnInit {
  public readonly data: ContaReceberDialogData = inject(MAT_DIALOG_DATA);
  private dialogRef: MatDialogRef<ContaReceberDetalheDialog> = inject(MatDialogRef); // Injete MatDialogRef

  statusContaReceberCtrl = new FormControl<StatusContaReceber>(StatusContaReceber.ABERTA, { nonNullable: true });
  observacaoCtrl = new FormControl('', { nonNullable: true });

  statusContaReceber = Object.values(StatusContaReceber);
  statusContaReceberLabelMapping = StatusContaReceberLabelMapping;


  ngOnInit(): void {
    // Isso ainda é útil para carregar o status inicial, se houver um.
    if (this.data.status) {
      this.statusContaReceberCtrl.setValue(this.data.status);
    }

    if (this.data.observacoes) {
      this.observacaoCtrl.setValue(this.data.observacoes);
    }
  }

  // --- Novo método para salvar ---
  salvar() {
    const novoStatusSelecionado: StatusContaReceber = this.statusContaReceberCtrl.value;
    const novaObservacao: string = this.observacaoCtrl.value;

    const matriculaAtualizada = {
      ...this.data, // Mantém os outros dados da matrícula
      status: novoStatusSelecionado,
      observacoes: novaObservacao
    };

    // 3. Fechar o diálogo e passar os dados atualizados
    // O componente que abriu o diálogo receberá 'matriculaAtualizada' no 'afterClosed()'
    this.dialogRef.close(matriculaAtualizada);
  }

  // --- Método para cancelar (opcional) ---
  onDismiss() {
    this.dialogRef.close(); // Fecha o diálogo sem retornar nenhum dado (ou um valor 'undefined')
  }
}
