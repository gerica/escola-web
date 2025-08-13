import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, finalize, switchMap, tap } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { debounceDistinctUntilChanged, minTime } from 'src/app/core/rxjs-operators';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { InnercardComponent } from 'src/app/shared/components';
import { Curso } from 'src/app/shared/models/curso';
import { DiasSemana, DiasSemanaLabelMapping } from 'src/app/shared/models/dias-semana.enum';
import { StatusTurma, StatusTurmaLabelMapping } from 'src/app/shared/models/status-turma.enum';
import { Turma } from 'src/app/shared/models/turma';
import { CursoService } from 'src/app/shared/services/curso.service';
import { DataUtils } from 'src/app/shared/services/data.service';
import { TurmaService } from 'src/app/shared/services/turma.service';
import { MatriculaManterComp } from "../matricula/comp";

@Component({
  selector: 'app-turma-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatTimepickerModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    InnercardComponent,
    MatDatepickerModule,
    MatriculaManterComp,
  ],
  providers: [
    provideNativeDateAdapter(), // necessário adicionar esse provider para o time picker apresentar no formato hh:mm    
  ]
})
export class ManterComp implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly turmaService = inject(TurmaService);
  private readonly cursoSerivce = inject(CursoService);
  private readonly fb = inject(FormBuilder);

  tabIndex = signal<number>(0);
  turma = signal<Turma | null>(null);

  srvTextSubject = new BehaviorSubject<string>('');
  cursos = signal(emptyPage<Curso>());
  srvLoading = signal(false);

  form!: FormGroup;

  ctrlFiltro = new FormControl('', { nonNullable: true });
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'nome', direction: 'asc' }));
  displayedColumns: string[] = ['codigo', 'nome', 'curso', 'anoPeriodo', 'professor', 'status', 'acoes'];

  statusTurma = Object.values(StatusTurma);
  statusTurmaLabelMapping = StatusTurmaLabelMapping;

  diasSemana = Object.values(DiasSemana);
  diasSemanaLabelMapping = DiasSemanaLabelMapping;

  ngOnInit(): void {
    this._createForm();
    this._getDataSnapshot();
    this._initTab();
    this._observarCurso();
    this._observarMudancasParaCalcularDataFim();
  }

  getStatusTurma(status: StatusTurma) {
    return this.statusTurmaLabelMapping[status];
  }

  private _createForm() {
    // Inicialize com Date objects diretamente
    const { horaAntes, horaDepois } = DataUtils.getDataAntesEDepois();

    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      curso: [null, Validators.required], // Use null para objetos de autocomplete
      codigo: [''],
      capacidadeMaxima: ['', Validators.required],
      status: [null, Validators.required], // Use null para select/enum
      anoPeriodo: ['', Validators.required],
      horarioInicio: [horaAntes, Validators.required], // Agora é um Date object
      horarioFim: [horaDepois, Validators.required],   // Agora é um Date object
      diasDaSemana: [null, Validators.required], // Use null para select/multiple
      professor: ['', Validators.required],
      dataInicio: [null, Validators.required],
      dataFim: [{ value: null, disabled: false }, Validators.required],
    });
  }

  private _initTab() {
    this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'];
      if (tabParam !== undefined) {
        // Convert the string parameter to a number
        this.tabIndex.set(+tabParam);
      }
    });
  }

  private _getDataSnapshot() {
    const entity = this.route.snapshot.data['entity'] as Turma;
    if (entity) {
      this.turma.set(entity);
      this._initForm();
    }
  }

  private _initForm() {
    if (this.turma()) {
      this.form.patchValue({
        ...this.turma(),
        // Garante que o time picker receba um objeto Date
        horarioInicio: DataUtils.getDateHoursMinute(this.turma()!.horarioInicio.toString()),
        horarioFim: DataUtils.getDateHoursMinute(this.turma()!.horarioFim.toString())
      }, { emitEvent: true });
    }
  }


  private _observarCurso() {
    this.srvTextSubject.asObservable()
      .pipe(
        debounceDistinctUntilChanged(400),
        tap(() => this.srvLoading.set(true)),
        switchMap((text) => {
          const clientes$ = this.cursoSerivce.buscarCurso(text, this.page());

          return clientes$.pipe(
            minTime(700),
            finalize(() => this.srvLoading.set(false))
          );
        })
      ).subscribe({
        next: (result) => {
          this.cursos.set(result);
        }
      });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    this.spinner.showUntilCompleted(this.turmaService.salvarTurma(this.form.value as Partial<Turma>)).subscribe({
      next: (turma) => {
        this.turma.set(turma);
        this._initForm();
        this.notification.showSuccess('Operação realizada com sucesso.');
      },
      error: (err) => { // <--- Add error handling
        this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
        console.error('Erro ao recuperar dados:', err);
      }
    });
  }

  displayCurso = (item: Curso) => (!!item && `${item.nome}`) || '';

  private _observarMudancasParaCalcularDataFim() {
    const curso$ = this.form.get('curso')!.valueChanges;
    const dataInicio$ = this.form.get('dataInicio')!.valueChanges;

    combineLatest([curso$, dataInicio$]).pipe(
      // Prosseguimos apenas se tivermos um objeto de curso válido e uma data de início
      filter(([curso, dataInicio]) =>
        curso && typeof curso === 'object' && 'id' in curso && dataInicio
      ),
    ).subscribe(([curso, dataInicio]) => {
      this._calcularEAtualizarDataFim(curso as Curso, dataInicio as Date);
    });
  }

  private _calcularEAtualizarDataFim(curso: Curso, dataInicio: Date) {
    if (!curso?.duracaoValor || !curso?.duracaoUnidade || !dataInicio) {
      this.form.get('dataFim')?.patchValue(null, { emitEvent: false });
      return;
    }

    const dataFim = new Date(dataInicio);
    // const valor = curso.duracaoValor;
    const valor = Number(curso.duracaoValor); // Garante que o valor seja numérico
    const unidade = curso.duracaoUnidade.toUpperCase();

    switch (unidade) {
      case 'DIAS':
        dataFim.setDate(dataFim.getDate() + valor);
        break;
      case 'SEMANAS':
        dataFim.setDate(dataFim.getDate() + (valor * 7)); // O operador * já faria a conversão, mas é bom ser explícito.
        break;
      case 'MESES':
        dataFim.setMonth(dataFim.getMonth() + valor);
        break;
      case 'ANOS':
        dataFim.setFullYear(dataFim.getFullYear() + valor);
        break;
    }
    this.form.get('dataFim')?.patchValue(dataFim, { emitEvent: false });
  }

}
