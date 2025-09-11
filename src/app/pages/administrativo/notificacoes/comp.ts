import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { CardComponent, InnercardComponent } from 'src/app/shared/components';
import { WhatsAppComp } from './whatsapp/comp';
import { EmailComp } from './email/comp';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { AdministrativoService } from 'src/app/shared/services/admin.service';
import { CHAVE_MENSAGEM_AUTOMATICA, Parametro } from 'src/app/shared/models/parametro';

@Component({
  selector: 'app-nofificacao-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss'],
  imports: [
    // CommonModule,
    InnercardComponent,
    MatButtonModule,
    CardComponent,
    MatTabsModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    WhatsAppComp,
    EmailComp,
  ]

})
export class NotificacaoManterComp implements OnInit {

  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly fb = inject(FormBuilder);
  private readonly admService = inject(AdministrativoService);

  form!: FormGroup;

  ngOnInit(): void {
    this._createForm();
    this._recuperarConfiguracoes();
  }

  private _createForm() {
    this.form = this.fb.group({
      notificacaoAutomatica: [false],
      qtdDiasAtraso: ['', Validators.required],
    });
  }

  private _initForm(param: Parametro) {
    const { valor } = param    
    this.form.patchValue({ ...(valor as Object) });
  }

  private _recuperarConfiguracoes() {
    this.spinner.showUntilCompleted(this.admService.findByChave(CHAVE_MENSAGEM_AUTOMATICA)).subscribe({
      next: (result) => {
        this._initForm({ ...result, valor: JSON.parse(result.valor) });
      },
      error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
      }
    });
  }

  submit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }
    const body: Partial<Parametro> = {
      valor: JSON.stringify(this.form.value)
    };

    this.spinner.showUntilCompleted(
      // this.form.value as Partial<Parametro>
      this.admService.salvarParametro(CHAVE_MENSAGEM_AUTOMATICA, body)).subscribe({
        next: _ => {
          this.notification.showSuccess('Operação realizada com sucesso.');
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError(err.message);
          console.error('Erro ao executar chamada ao backend:', err);
        }
      });
  }

}
