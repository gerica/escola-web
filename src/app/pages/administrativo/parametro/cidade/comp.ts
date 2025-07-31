import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, finalize, forkJoin, switchMap, tap } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { debounceDistinctUntilChanged, minTime } from 'src/app/core/rxjs-operators';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { EditorComponent } from 'src/app/shared/components/editor/editor.component';
import { Cidade } from 'src/app/shared/models/cidade';
import { CHAVE_CONTRATO_CIDADE_PADRAO, CHAVE_CONTRATO_MODELO_PADRAO, Parametro } from 'src/app/shared/models/parametro';
import { AdministrativoService } from 'src/app/shared/services/admin.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../../shared/components/innercard/innercard.component";


@Component({
  selector: 'app-cidade-param-manter',
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
    MatDivider,
    MatProgressSpinner,
    EditorComponent
  ]
  
})
export class CidadeParamManterComp implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly admService = inject(AdministrativoService);
  private readonly utilService = inject(UtilsService);

  formCidadePadrao!: UntypedFormGroup;
  formModeloContrato!: UntypedFormGroup;
  parametroCidadePadrao = signal<Parametro | null>(null);
  parametroModeloContrato = signal<Parametro | null>(null);

  srvTextSubject = new BehaviorSubject<string>('');
  cidades = signal(emptyPage<Cidade>());
  srvLoading = signal(false);
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'descricao', direction: 'asc' }));


  ngOnInit(): void {
    this._recuperarConfiguracoes();
    this._createForm();
    this._observarCidades();
  }

  private _createForm() {
    this.formCidadePadrao = new UntypedFormGroup({
      cidade: new UntypedFormControl('', [Validators.required]),
    });

    this.formModeloContrato = new UntypedFormGroup({
      modeloContrato: new UntypedFormControl('', [Validators.required]),
    });
  }

  private _recuperarConfiguracoes() {
    this.spinner.loadingOn();
    (this.spinner as any).loadingCount++; // Accessing private property, see note below

    forkJoin({
      cidadePadrao: this.admService.findByChave(CHAVE_CONTRATO_CIDADE_PADRAO),
      modeloContrato: this.admService.findByChave(CHAVE_CONTRATO_MODELO_PADRAO),
    }).subscribe({
      next: (results) => {
        const { cidadePadrao, modeloContrato } = results;
        this.parametroCidadePadrao.set(cidadePadrao);
        this.parametroModeloContrato.set(modeloContrato);
        this._initFormsModelo();
        this._initFormCidadePadrao();
      },
      error: (error) => {
        console.error('Error fetching admin parameters:', error);
      },
      complete: () => {
        (this.spinner as any).loadingCount--;
        if ((this.spinner as any).loadingCount === 0) {
          this.spinner.loadingOff();
        }
      }
    });
  }

  private _initFormCidadePadrao(): void {
    const codigoMunicipio = this.parametroCidadePadrao()?.codigoMunicipio;
    if (codigoMunicipio) {
      this.utilService.recuperarPorCodigo(codigoMunicipio).subscribe({
        next: (result) => {
          this.formCidadePadrao.patchValue({ cidade: result });
        }
      });
    }
  }

  private _initFormsModelo() {
    this.formModeloContrato.patchValue({ ...this.parametroModeloContrato() });
  }

  private _observarCidades() {
    this.srvTextSubject.asObservable()
      .pipe(
        debounceDistinctUntilChanged(400),
        tap(() => this.srvLoading.set(true)),
        switchMap((text) => {
          return this.utilService.recuperarPorFiltro(text, this.page()).pipe(
            minTime(700),
            finalize(() => this.srvLoading.set(false))
          );
        })
      ).subscribe({
        next: (result) => this.cidades.set(result),
        error: (err) => console.log(err),
      });
  }

  onSubmitCidade() {
    if (!this.formCidadePadrao.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.formCidadePadrao.markAllAsTouched();
      this.formCidadePadrao.markAsDirty();
      return;
    }

    this.spinner.showUntilCompleted(
      this.admService.salvarCidadePadrao(this.formCidadePadrao.value as Partial<Parametro>)).subscribe({
        next: (result) => {
          this.parametroCidadePadrao.set(result);
          this.notification.showSuccess('Operação realizada com sucesso.');
        }
      });
  }

  onSubmitModeloConrato() {
    if (!this.formCidadePadrao.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.formCidadePadrao.markAllAsTouched();
      this.formCidadePadrao.markAsDirty();
      return;
    }
    this.spinner.showUntilCompleted(
      this.admService.salvarModeloContrato(this.formModeloContrato.value as Partial<Parametro>)).subscribe({
        next: (result) => {
          this.parametroCidadePadrao.set(result);
          this.notification.showSuccess('Operação realizada com sucesso.');
        }
      });
  }

  displayFnCidade(cidade: Cidade): string {
    return cidade && `${cidade.descricao} - ${cidade.uf}`;
  }

}
