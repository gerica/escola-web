import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, catchError, EMPTY, finalize, switchMap, tap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/core/components';
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

@Component({
  selector: 'app-tabela-auxiliar-turma-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../../pages.component.scss'],
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
    PrimeiraMaiusculaPipe,
    InnercardComponent,
  ],
  providers: [
    provideNativeDateAdapter(), // necessário adicionar esse provider para o time picker apresentar no formato hh:mm    
  ]
})
export class TurmaManterComp implements OnInit {

  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly turmaService = inject(TurmaService);
  private readonly cursoSerivce = inject(CursoService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

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
    this._observarCurso();
    this.buscar();
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
    console.log(this.form);
  }

  novo2() {
    const { horaAntes, horaDepois } = DataUtils.getDataAntesEDepois();
    console.log('Valores após getDataAnteEDepois (novo):', horaAntes, horaDepois);

    this.form.reset({
      id: null,
      nome: '',
      curso: null, // Certifique-se de que é null para autocomplete
      codigo: '',
      capacidadeMaxima: '',
      status: null, // Certifique-se de que é null para select
      anoPeriodo: '',
      horarioInicio: horaAntes,
      horarioFim: horaDepois,
      diasDaSemana: null, // Certifique-se de que é null para select multiple
      professor: '',
    });

    console.log('Estado do formulário após reset completo:');
    console.log('  valid:', this.form.valid);
    console.log('  touched:', this.form.touched);
    console.log('  dirty:', this.form.dirty);

    // --- NOVO: Iterar sobre todos os controles e logar seus erros ---
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.invalid) { // Apenas logs se o controle estiver inválido
        console.log(`  Campo '${key}' está INVÁLIDO. Erros:`, control.errors);
        console.log(`  Campo '${key}' - touched:`, control.touched, 'dirty:', control.dirty);
      }
    });
  }

  novo3() {
    const { horaAntes, horaDepois } = DataUtils.getDataAntesEDepois();
    console.log('Valores após getDataAnteEDepois (novo):', horaAntes, horaDepois);

    this.form.reset({
      id: null,
      nome: '',
      curso: null,
      codigo: '',
      capacidadeMaxima: '',
      status: null,
      anoPeriodo: '',
      horarioInicio: horaAntes,
      horarioFim: horaDepois,
      diasDaSemana: null,
      professor: '',
    });

    // --- NOVO: Forçar o estado para untouched e pristine ---
    // Isto deve ser feito APÓS o reset, para garantir que o estado seja o desejado
    this.form.markAsUntouched();
    this.form.markAsPristine();

    // Iterar sobre os controles novamente para garantir
    Object.keys(this.form.controls).forEach(key => {
      this.form.controls[key].markAsUntouched();
      this.form.controls[key].markAsPristine();
    });

    console.log('Estado do formulário após reset e forçar estado:');
    console.log('  valid:', this.form.valid);
    console.log('  touched:', this.form.touched);
    console.log('  dirty:', this.form.dirty);

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.invalid) {
        console.log(`  Campo '${key}' está INVÁLIDO. Erros:`, control.errors);
        console.log(`  Campo '${key}' - touched:`, control.touched, 'dirty:', control.dirty);
      }
    });
  }

  novo() {
    // Ao invés de this.form.reset({...}), você pode recriar o formulário
    this._createForm(); // Isso recria o formulário com seus valores iniciais padrão

    // Os logs agora devem ser colocados APÓS a recriação
    console.log('Estado do formulário após recriação:');
    console.log('  valid:', this.form.valid);
    console.log('  touched:', this.form.touched);
    console.log('  dirty:', this.form.dirty);

    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      if (control?.invalid) {
        console.log(`  Campo '${key}' está INVÁLIDO. Erros:`, control.errors);
        console.log(`  Campo '${key}' - touched:`, control.touched, 'dirty:', control.dirty);
      }
    });
  }

  preEditar(entity: Turma) {
    this.form.patchValue({
      ...entity,
      // Garante que o time picker receba um objeto Date
      horarioInicio: DataUtils.getDateHoursMinute(entity.horarioInicio.toString()),
      horarioFim: DataUtils.getDateHoursMinute(entity.horarioFim.toString())
    }, { emitEvent: true });
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
        this.novo();
      }, error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recuperar dependentes:', err);
      }
    });
  }

  limparEbuscar() {
    this.ctrlFiltro.setValue('');
    this.buscar();
  }

  buscar() {
    this.spinner
      .showUntilCompleted(this.turmaService.buscarTurma(this.ctrlFiltro.value, this.page()))
      .subscribe({
        next: (result) => {
          this.turmas.set(result);
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError(err.message);
          console.error('Erro ao recuperar dependentes:', err);
        }
      });
  }

  sortData(sort: Sort) {
    this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    this.buscar();
  }

  confirmarExclusao(entity: Turma) {
    const dialogRef$ = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: `Realizar a exclusão do turma: ${entity.nome}`,
        message: 'Você tem certeza que deseja excluir este turma?'
      }
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        this.excluir(entity);
      }
    });
  }

  excluir(entity: Turma) {
    this.spinner.showUntilCompletedCascate(
      this.turmaService.removerTurma(entity.id)
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

}
