import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt'; // This provides the locale data
import { Component, inject, LOCALE_ID, OnInit, signal } from '@angular/core';
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
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { debounceDistinctUntilChanged, minTime } from 'src/app/core/rxjs-operators';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Cidade } from 'src/app/shared/models/cidade';
import Cliente from 'src/app/shared/models/cliente';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { ContatoComp } from '../contato/comp';
import { DependenteComp } from '../depentente/comp';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule,
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
  cliente = signal<Cliente | null>(null);

  srvTextSubject = new BehaviorSubject<string>('');
  cidades = signal(emptyPage<Cidade>());
  srvLoading = signal(false);
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'descricao', direction: 'asc' }));

  ngOnInit(): void {
    this._createForm();
    this._initForm();
    this._observarCidades();
  }

  private _createForm() {
    this.form = new UntypedFormGroup({
      nome: new UntypedFormControl('', [Validators.required]),
      dataNascimento: new UntypedFormControl('', [Validators.required]),
      cidade: new UntypedFormControl('', [Validators.required]),
      docCPF: new UntypedFormControl('', Validators.required),
      docRG: new UntypedFormControl('', [Validators.required]),
      endereco: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
      profissao: new UntypedFormControl(''),
      localTrabalho: new UntypedFormControl(''),
    });
  }

  private _initForm() {
    const tempEntity = this.route.snapshot.data['entity'] as Cliente;

    if (tempEntity) {
      this.cliente.set(tempEntity);      
      this.form.patchValue({
        ...this.cliente(),
        // cidade: { descricao: this.cliente()?.cidadeDesc, uf: this.cliente()?.uf, codigoCidade: this.cliente()?.codigoCidade }
      }, { emitEvent: true });
    }
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

  displayFnCidade(cidade: Cidade): string {
    return cidade && `${cidade.descricao} - ${cidade.uf}`;
  }

}
