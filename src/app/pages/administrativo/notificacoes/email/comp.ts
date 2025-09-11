import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { InnercardComponent } from 'src/app/shared/components';
import { EditorComponent } from 'src/app/shared/components/editor/editor.component';
import { CHAVE_MENSAGEM_EMAIL, Parametro } from 'src/app/shared/models/parametro';
import { AdministrativoService } from 'src/app/shared/services/admin.service';

@Component({
  selector: 'app-email-manter',
  templateUrl: './comp.html',
  styleUrls: ['../comp.scss'],
  imports: [
    // CommonModule,    
    // InnercardComponent,    
    // MatButtonModule,
    InnercardComponent,
    MatTabsModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    InnercardComponent,
    EditorComponent,
    MatButtonModule
  ]

})
export class EmailComp implements OnInit {

  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly fb = inject(FormBuilder);
  private readonly admService = inject(AdministrativoService);

  form!: FormGroup;

ngOnInit(): void {
    this._recuperarConfiguracoes();
    this._createForm();
  }

  private _createForm() {
    this.form = this.fb.group({
      valor: new FormControl('', [Validators.required]),
    });
  }

  private _recuperarConfiguracoes() {
    this.spinner.showUntilCompleted(this.admService.findByChave(CHAVE_MENSAGEM_EMAIL)).subscribe({
      next: (result) => {
        this._initFormsModelo(result);
      },
      error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
      }
    });
  }

  private _initFormsModelo(value: Parametro) {
    this.form.patchValue({ ...value });
  }

  submit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }
    this.spinner.showUntilCompleted(
      this.admService.salvarParametro(CHAVE_MENSAGEM_EMAIL, this.form.value as Partial<Parametro>)).subscribe({
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
