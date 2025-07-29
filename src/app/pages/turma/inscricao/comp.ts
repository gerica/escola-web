import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { debounceDistinctUntilChanged, minTime } from 'src/app/core/rxjs-operators';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { InnercardComponent } from 'src/app/shared/components';
import { Curso } from 'src/app/shared/models/curso';
import { DiasSemana, DiasSemanaLabelMapping } from 'src/app/shared/models/dias-semana.enum';
import { StatusTurma, StatusTurmaLabelMapping } from 'src/app/shared/models/status-turma.enum';
import { Turma } from 'src/app/shared/models/turma';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';
import { CursoService } from 'src/app/shared/services/curso.service';
import { DataUtils } from 'src/app/shared/services/data.service';
import { TurmaService } from 'src/app/shared/services/turma.service';
import { IncricaoDialogComponent } from './inscricao.modal';

@Component({
  selector: 'app-turma-inscricao-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../pages.component.scss'],
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
    PrimeiraMaiusculaPipe
  ],
})
export class InscricaoManterComp implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly turmaService = inject(TurmaService);
  private readonly cursoSerivce = inject(CursoService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  @Input({ required: true }) turma!: Turma | null;

  matriculas = signal(emptyPage<Turma>());

  srvTextSubject = new BehaviorSubject<string>('');
  cursos = signal(emptyPage<Curso>());
  srvLoading = signal(false);

  form!: FormGroup;
  turmas = signal(emptyPage<Turma>());

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
    this._initForm();
    this._observarCurso();
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
      codigo: ['', Validators.required],
      capacidadeMaxima: ['', Validators.required],
      status: [null, Validators.required], // Use null para select/enum
      anoPeriodo: ['', Validators.required],
      horarioInicio: [horaAntes, Validators.required], // Agora é um Date object
      horarioFim: [horaDepois, Validators.required],   // Agora é um Date object
      diasDaSemana: [null, Validators.required], // Use null para select/multiple
      professor: ['', Validators.required],
    });
  }

  private _initForm() {
    const entity = this.route.snapshot.data['entity'] as Turma;
    if (entity) {
      this.turma = entity;
      this.form.patchValue({
        ...entity,
        // Garante que o time picker receba um objeto Date
        horarioInicio: DataUtils.getDateHoursMinute(entity.horarioInicio.toString()),
        horarioFim: DataUtils.getDateHoursMinute(entity.horarioFim.toString())
      }, { emitEvent: true });
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    this.spinner.showUntilCompletedCascate(
      this.turmaService.salvarTurma(this.form.value as Partial<Turma>)
    ).pipe(
      switchMap(_ => {
        return this.turmaService.buscarTurma(this.ctrlFiltro.value, this.page());
      }),
      catchError(err => {
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
        return EMPTY;
      })
    ).subscribe({
      next: (result) => {
        this.turmas.set(result);
        this.notification.showSuccess('Operação realizada com sucesso.');
      }, error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recuperar dependentes:', err);
      }
    });
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

  displayCurso = (item: Curso) => (!!item && `${item.nome}`) || '';

  sortData(sort: Sort) {
    this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    this.buscar();
  }

  buscar() {

  }

  abrirModalInscricao() {
    const dialogRef$ = this.dialog.open(IncricaoDialogComponent, {
      width: '750px',
      // height: '400px',
      data: {
        title: `Realizar inscrição na turma: ${this.turma?.nome}`,        
      }
    });
  }

}
