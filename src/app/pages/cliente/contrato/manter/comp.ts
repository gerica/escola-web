import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BehaviorSubject, finalize, Observable, switchMap, tap } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { debounceDistinctUntilChanged, minTime } from 'src/app/core/rxjs-operators';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Cidade } from 'src/app/shared/models/cidade';
import Cliente from 'src/app/shared/models/cliente';
import Contrato from 'src/app/shared/models/contrato';
import { Estado } from 'src/app/shared/models/estado';
import { PeriodoPagamento, PeriodoPagamentoLabelMapping } from 'src/app/shared/models/periodos-pagamento.enum';
import { StatusContrato, StatusContratoLabelMapping } from 'src/app/shared/models/status-contrato.enum';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../../shared/components/innercard/innercard.component";
import { ManterContratoComp } from '../modeloContrato/comp';
import { Matricula } from 'src/app/shared/models/matricula';

@Component({
  selector: 'app-contrato-manter',
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
    MatSelectModule,
    MatProgressSpinnerModule,
    ManterContratoComp

  ],
})
export class ContratoManterComp implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly clienteService = inject(ClienteService);
  private readonly contratoService = inject(ContratoService);
  private readonly utilService = inject(UtilsService);
  private readonly fb = inject(FormBuilder);

  form!: UntypedFormGroup;

  @Input({ required: false }) contratoInput!: Contrato | null;
  @Input({ required: false }) matriculaInput!: Matricula | null;

  inModal = signal<boolean>(false);

  optionsEstados = signal<Estado[]>([]);
  filteredEstadosOptions: Observable<Estado[]>;
  optionsCidades = signal<Cidade[]>([]);
  filteredCidadesOptions!: Observable<Cidade[]>;
  contrato = signal<Contrato | null>(null);

  srvTextSubject = new BehaviorSubject<string>('');
  clientes = signal(emptyPage<Cliente>());
  srvLoading = signal(false);

  srvCidadeSubject = new BehaviorSubject<string>('');
  cidades = signal(emptyPage<Cidade>());
  srvCidadeLoading = signal(false);

  statusContrato = Object.values(StatusContrato);
  statusContratoLabelMapping = StatusContratoLabelMapping;
  periodosPagamento = Object.values(PeriodoPagamento);
  periodosPagamentoLabelMapping = PeriodoPagamentoLabelMapping;

  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'nome', direction: 'asc' }));
  pageCidade = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'descricao', direction: 'asc' }));

  constructor() {
    this.filteredEstadosOptions = toObservable(this.optionsEstados);
  }

  ngOnInit(): void {
    this._createForm();
    this._initForm();
    // this._observarClientes();
    this._observarCidades();

  }

  displayCliente = (item: Cliente) => (!!item && `${item.nome}`) || '';

  displayFnCidade(cidade: Cidade): string {
    return cidade && `${cidade.descricao} - ${cidade.uf}`;
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    this.spinner.showUntilCompleted(
      this.contratoService.salvar(this.contrato()?.id, this.form.value as Partial<Contrato>)).subscribe({
        next: _ => {
          this.notification.showSuccess('Operação realizada com sucesso.');
        },
        error: (err) => {
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
        }
      });
  }


  titulocabecalho() {
    if (this.contrato()?.id) {
      return `Contrato: ${this.contrato()?.numeroContrato} - ${this.contrato()?.nomeCliente}`;
    }
    return 'Novo contrato';
  }

  private _createForm() {
    this.form = this.fb.group({
      numeroContrato: new FormControl('', [Validators.required]),
      cliente: new FormControl('', [Validators.required]),
      dataInicio: new FormControl('', [Validators.required]),
      dataFim: new FormControl('', [Validators.required]),
      valorTotal: new FormControl('', [Validators.required]),
      desconto: new FormControl('', [Validators.required]),
      descricao: new FormControl('', []),
      statusContrato: new FormControl('', [Validators.required]),
      termosCondicoes: new FormControl('', [Validators.required]),
      periodoPagamento: new FormControl('', [Validators.required]),
      observacoes: new FormControl('', []),
    });
  }

  private _initForm() {
    const tempEntity = this.route.snapshot.data['entity'] as Contrato;

    if (tempEntity) {
      this.contrato.set(tempEntity);
      this.inModal.set(false);
    } else if (this.contratoInput) {
      this.contrato.set(this.contratoInput);
      this.inModal.set(true);
    }

    if (this.contrato()) {
      this.spinner
        .showUntilCompleted(this.clienteService.recuperarPorId(this.contrato()?.idCliente as number))
        .subscribe(
          result => {
            this.form.patchValue({
              ...this.contrato(),
              cliente: result,
            }, { emitEvent: true });
          });
    }
  }

  private _observarClientes() {
    this.srvTextSubject.asObservable()
      .pipe(
        debounceDistinctUntilChanged(400),
        tap(() => this.srvLoading.set(true)),
        switchMap((text) => {
          const clientes$ = this.clienteService.buscar(text, this.page());

          return clientes$.pipe(
            minTime(700),
            finalize(() => this.srvLoading.set(false))
          );
        })
      ).subscribe({
        next: (result) => {
          this.clientes.set(result);
        }
      });
  }

  private _observarCidades() {
    this.srvTextSubject.asObservable()
      .pipe(
        debounceDistinctUntilChanged(400),
        tap(() => this.srvLoading.set(true)),
        switchMap((text) => {
          const observer$ = this.utilService.recuperarPorFiltro(text, this.pageCidade());

          return observer$.pipe(
            minTime(700),
            finalize(() => this.srvLoading.set(false))
          );
        })
      ).subscribe({
        next: (result) => {
          this.cidades.set(result);
        }
      });
  }

}
