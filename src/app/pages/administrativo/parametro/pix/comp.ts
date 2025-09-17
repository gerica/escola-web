import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Cidade } from 'src/app/shared/models/cidade';
import { CHAVE_CONTRATO_MODELO_PADRAO, CHAVE_PIX, Parametro } from 'src/app/shared/models/parametro';
import { AdministrativoService } from 'src/app/shared/services/admin.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../../shared/components/innercard/innercard.component";


@Component({
  selector: 'app-pix-comp',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../../pages.component.scss'],
  imports: [
    // CommonModule,
    // RouterModule,
    InnercardComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ]

})
export class PixComp implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly admService = inject(AdministrativoService);
  private readonly utilService = inject(UtilsService);

  form!: FormGroup;

  ngOnInit(): void {
    this._recuperarConfiguracoes();
    this._createForm();
  }

  private _createForm() {
    this.form = new UntypedFormGroup({
      chavePix: new UntypedFormControl('', [Validators.required]),
      nomeRecebedor: new UntypedFormControl('', [Validators.required]),
      cidadeRecebedor: new UntypedFormControl('', [Validators.required]),
    });
  }

  private _recuperarConfiguracoes() {
    this.spinner.showUntilCompleted(this.admService.findByChave(CHAVE_PIX)).subscribe({
      next: (result) => {
        // this.parametroModeloContrato.set(result);
        this._initFormsModelo(result);
      },
      error: (err) => { // <--- Add error handling
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
      }
    });
  }

  private _initFormsModelo(parametro: Parametro) {
    const { valor } = parametro;
    this.form.patchValue({ ...JSON.parse(valor) });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    const payload = {
      valor: this.form.value as Partial<Parametro>
    }
    
    this.spinner.showUntilCompleted(
      this.admService.salvarParametro(CHAVE_PIX, payload as Partial<Parametro>)).subscribe({
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
