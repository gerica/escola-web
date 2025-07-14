import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt'; // This provides the locale data
import { Component, inject, LOCALE_ID, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { provideNgxMask } from 'ngx-mask';
import { forkJoin, map, Observable, startWith } from 'rxjs';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { EditorComponent } from 'src/app/shared/components/editor/editor.component';
import { Cidade } from 'src/app/shared/models/cidade';
import { Estado } from 'src/app/shared/models/estado';
import { CHAVE_CONTRATO_CIDADE_PADRAO, CHAVE_CONTRATO_MODELO_PADRAO, Parametro } from 'src/app/shared/models/parametro';
import { AdministrativoService } from 'src/app/shared/services/admin.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";

// Register the locale data for pt-BR
registerLocaleData(localePt, 'pt-BR');

// Define your custom date formats for display and parsing
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY', // How the date is parsed from the input
  },
  display: {
    dateInput: 'DD/MM/YYYY', // How the date is displayed in the input
    monthYearLabel: 'MMM YYYY', // e.g., "Jul 2025"
    dateA11yLabel: 'LL', // for accessibility
    monthYearA11yLabel: 'MMMM YYYY', // for accessibility
  },
};

@Component({
  selector: 'app-contrato-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../pages.component.scss'],
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
    EditorComponent
  ],
  providers: [
    provideNativeDateAdapter(),
    provideNgxMask(),
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Set Angular's global locale
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }, // Set Material Datepicker's locale
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }, // Apply custom date formats
  ]
})
export class ManterComp implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly admService = inject(AdministrativoService);
  private readonly utilService = inject(UtilsService);

  formCidadePadrao!: UntypedFormGroup;
  formModeloContrato!: UntypedFormGroup;

  optionsEstados = signal<Estado[]>([]);
  filteredEstadosOptions: Observable<Estado[]>;
  optionsCidades = signal<Cidade[]>([]);
  filteredCidadesOptions!: Observable<Cidade[]>;
  parametroCidadePadrao = signal<Parametro | null>(null);
  parametroModeloContrato = signal<Parametro | null>(null);

  constructor() {
    this.filteredEstadosOptions = toObservable(this.optionsEstados);
  }

  ngOnInit(): void {
    this.recuperarConfiguracoes();
    this.recuperarEstados();
    this.createForm();
    // this.initForm();
  }

  private createForm() {
    this.formCidadePadrao = new UntypedFormGroup({
      estado: new UntypedFormControl('', [Validators.required]),
      cidade: new UntypedFormControl('', [Validators.required]),
    });

    this.formModeloContrato = new UntypedFormGroup({
      modeloContrato: new UntypedFormControl('', [Validators.required]),
    });
  }

  private initForms() {
    // iniciar form da cidade padrão
    this.spinner
      .showUntilCompleted(this.utilService.recuperarMunicipioPorId(this.parametroCidadePadrao()?.codigoMunicipio))
      .subscribe(
        result => {
          const estadoEncontrado = this.optionsEstados().find(e => e.sigla === result.uf)
          const cidadeEncontrada = this.optionsCidades().find(c => c.codigo === result.codigo) || result;
          this.formCidadePadrao.patchValue({
            ...this.parametroCidadePadrao(),
            estado: estadoEncontrado,
            cidade: cidadeEncontrada
          }, { emitEvent: true });
        });

    // iniciar form do modelo de contrato
    this.formModeloContrato.patchValue({ ...this.parametroModeloContrato() });
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

  observarEstado() {
    const controlEstado = this.formCidadePadrao.get('estado');
    if (controlEstado) {
      this.filteredEstadosOptions = controlEstado.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.descricao;
          return name ? this._filterEstado(name as string) : this.optionsEstados().slice();
        }),
      );
    }
  }

  private _filterEstado(name: string): Estado[] {
    const filterValue = name.toLowerCase();

    return this.optionsEstados().filter(option => option.descricao.toLowerCase().includes(filterValue));
  }

  private _filterCidade(name: string): Cidade[] {
    const filterValue = name.toLowerCase();

    return this.optionsCidades().filter(option => option.descricao.toLowerCase().includes(filterValue));
  }

  onEstadoChange(estado: Estado) {
    if (estado) {
      this.recuperarCidades(estado);
    }
  }

  recuperarConfiguracoes() {
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
        this.initForms();
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

  recuperarEstados() {
    this.spinner
      .showUntilCompleted(this.utilService.recuperarEstados())
      .subscribe(
        result => {
          this.optionsEstados.set(result);
          this.observarEstado();
        });
  }

  recuperarCidades(estado: Estado) {
    this.spinner
      .showUntilCompleted(this.utilService.recuperarMunicipiosPorEstado(estado))
      .subscribe(
        result => {
          this.optionsCidades.set(result);
          this.observarCidade();
        });
  }

  observarCidade() {
    const controlCidade = this.formCidadePadrao.get('cidade');
    if (controlCidade) {
      this.filteredCidadesOptions = controlCidade.valueChanges.pipe(
        startWith(''),
        map(value => {
          const name = typeof value === 'string' ? value : value?.descricao;
          return name ? this._filterCidade(name as string) : this.optionsCidades().slice();
        }),
      );
    }
  }

  displayFnEstado(estado: Estado): string {
    return estado && estado.descricao;
  }

  displayFnCidade(cidade: Cidade): string {
    return cidade && cidade.descricao;
  }

}
