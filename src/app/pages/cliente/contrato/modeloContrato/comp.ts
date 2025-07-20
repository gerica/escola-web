import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { EditorComponent } from 'src/app/shared/components/editor/editor.component';
import Contrato from 'src/app/shared/models/contrato';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { InnercardComponent } from "../../../../shared/components/innercard/innercard.component";


@Component({
  selector: 'app-contrato-manter-contrato',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../../pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    InnercardComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    EditorComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    provideNgxMask()
  ]
})
export class ManterContratoComp implements OnInit {

  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly contratoService = inject(ContratoService);
  private readonly fb = inject(FormBuilder);

  form!: UntypedFormGroup;
  @Input({ required: true }) contrato!: Contrato | null;

  ngOnInit(): void {
    this._createForm();
    this._initForm(this.contrato?.contratoDoc || '');
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    // Certifique-se de que this.contrato não é nulo antes de prosseguir
    if (!this.contrato) {
      this.notification.showError('Não foi possível carregar os dados do contrato.');
      return;
    }

    // 1. Obtenha o valor atualizado de contratoDoc do formulário
    const updatedContratoDoc = this.form.get('contratoDoc')?.value;

    // 2. Crie um objeto com todos os campos necessários para o backend.
    // Utilize os dados existentes do `this.contrato` e sobrescreva `contratoDoc`.
    const contratoParaSalvar: Partial<Contrato> = {
      ...this.contrato, // Espalha todos os campos existentes do contrato
      contratoDoc: updatedContratoDoc // Sobrescreve apenas o contratoDoc com o valor do formulário
    };

    // 3. Chame o serviço com o objeto completo
    this.spinner.showUntilCompleted(
      this.contratoService.salvar(this.contrato.idContrato, contratoParaSalvar)).subscribe({
        next: (result) => {
          this.notification.showSuccess('Operação realizada com sucesso.');
          // Opcional: Atualize o objeto contrato localmente após o sucesso, se necessário
          // this.contrato = result;
        },
        error: (err) => {
          this.notification.showError('Erro ao salvar contrato: ' + (err.message || 'Erro desconhecido.'));
        }
      });
  }

  carregarContrato() {
    if (!this.contrato?.idContrato) {
      return;
    }
    this.spinner.showUntilCompleted(
      this.contratoService.carregarContrato(this.contrato.idContrato)).subscribe({
        next: (result) => {
          this._initForm(result.contratoDoc);
        },
        error: (err) => {
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
        }
      });
  }

  private _createForm() {
    this.form = this.fb.group({
      contratoDoc: new FormControl('', [Validators.required]),
    });
  }

  private _initForm(value: string) {
    this.form.patchValue({
      contratoDoc: value,
    }, { emitEvent: true });

  }

}
