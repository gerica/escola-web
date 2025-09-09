import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { EditorComponent } from 'src/app/shared/components/editor/editor.component';
import { Cidade } from 'src/app/shared/models/cidade';
import { CHAVE_CONTRATO_MODELO_PADRAO, Parametro } from 'src/app/shared/models/parametro';
import { AdministrativoService } from 'src/app/shared/services/admin.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../../shared/components/innercard/innercard.component";


@Component({
  selector: 'app-contrato-param-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../../pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    InnercardComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    // MatDivider,
    // MatProgressSpinner,
    EditorComponent
  ]

})
export class ContratoParamManterComp implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly admService = inject(AdministrativoService);
  private readonly utilService = inject(UtilsService);

  formModeloContrato!: FormGroup;

  // parametroModeloContrato = signal<Parametro | null>(null);

  srvTextSubject = new BehaviorSubject<string>('');
  cidades = signal(emptyPage<Cidade>());
  srvLoading = signal(false);
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'descricao', direction: 'asc' }));


  ngOnInit(): void {
    this._recuperarConfiguracoes();
    this._createForm();
  }

  private _createForm() {
    this.formModeloContrato = new UntypedFormGroup({
      valor: new UntypedFormControl('', [Validators.required]),
    });
  }

  private _recuperarConfiguracoes() {
    this.spinner.showUntilCompleted(this.admService.findByChave(CHAVE_CONTRATO_MODELO_PADRAO)).subscribe({
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

  private _initFormsModelo(value: Parametro) {
    this.formModeloContrato.patchValue({ ...value });
  }

  onSubmitModeloConrato() {
    if (!this.formModeloContrato.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.formModeloContrato.markAllAsTouched();
      this.formModeloContrato.markAsDirty();
      return;
    }
    this.spinner.showUntilCompleted(
      this.admService.salvarParametro(CHAVE_CONTRATO_MODELO_PADRAO, this.formModeloContrato.value as Partial<Parametro>)).subscribe({
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
