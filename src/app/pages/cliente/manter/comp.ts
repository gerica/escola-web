import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt'; // This provides the locale data
import { Component, inject, LOCALE_ID, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { map, Observable, startWith } from 'rxjs';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Cidade } from 'src/app/shared/models/cidade';
import Cliente from 'src/app/shared/models/cliente';
import { Estado } from 'src/app/shared/models/estado';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { ContatoComp } from '../contato/comp';
import { DependenteComp } from '../depentente/comp';

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
    NgxMaskDirective,
    ContatoComp,
    DependenteComp,

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
  private readonly clienteService = inject(ClienteService);
  private readonly utilService = inject(UtilsService);

  form!: UntypedFormGroup;

  optionsEstados = signal<Estado[]>([]);
  filteredEstadosOptions: Observable<Estado[]>;
  optionsCidades = signal<Cidade[]>([]);
  filteredCidadesOptions!: Observable<Cidade[]>;
  cliente = signal<Cliente | null>(null);

  constructor() {
    this.filteredEstadosOptions = toObservable(this.optionsEstados);
  }

  ngOnInit(): void {
    this.recuperarEstados();
    this.createForm();
    this.initForm();
  }

  private createForm() {
    this.form = new UntypedFormGroup({
      nome: new UntypedFormControl('', [Validators.required]),
      dataNascimento: new UntypedFormControl('', [Validators.required]),
      estado: new UntypedFormControl('', [Validators.required]),
      cidade: new UntypedFormControl('', [Validators.required]),
      docCPF: new UntypedFormControl('', Validators.required),
      docRG: new UntypedFormControl('', [Validators.required]),
      endereco: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
      profissao: new UntypedFormControl(''),
      localTrabalho: new UntypedFormControl(''),
      // telResidencial: new UntypedFormControl(''),
      // telCelular: new UntypedFormControl('',),
    });
  }

  private initForm() {
    const tempEntity = this.route.snapshot.data['entity'] as Cliente;

    // if (tempEntity) {
    //   this.cliente.set(tempEntity);
    //   this.spinner
    //     .showUntilCompleted(this.utilService.recuperarMunicipioPorId(this.cliente()?.cidade.codigo))
    //     .subscribe(
    //       result => {
    //         const estadoEncontrado = this.optionsEstados().find(e => e.sigla === result.uf)
    //         // const cidadeEncontrada = this.optionsCidades().find(c => c.codigo === result.codigo) || result;
    //         this.form.patchValue({
    //           ...this.cliente(),
    //           estado: estadoEncontrado,
    //         }, { emitEvent: true });
    //       });
    // }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    this.spinner.showUntilCompleted(
      this.clienteService.salvar(this.cliente()?.id, this.form.value as Partial<Cliente>)).subscribe({
        next: (result) => {
          this.cliente.set(result);
          this.notification.showSuccess('Operação realizada com sucesso.');
        }
      });
  }

  observarEstado() {
    const controlEstado = this.form.get('estado');
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

  recuperarEstados() {
    // this.spinner
    //   .showUntilCompleted(this.utilService.recuperarEstados())
    //   .subscribe(
    //     result => {
    //       this.optionsEstados.set(result);
    //       this.observarEstado();
    //     });
  }

  recuperarCidades(estado: Estado) {
    // this.spinner
    //   .showUntilCompleted(this.utilService.recuperarMunicipiosPorEstado(estado))
    //   .subscribe(
    //     result => {
    //       this.optionsCidades.set(result);
    //       this.observarCidade();
    //     });
  }

  observarCidade() {
    const controlCidade = this.form.get('cidade');
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
