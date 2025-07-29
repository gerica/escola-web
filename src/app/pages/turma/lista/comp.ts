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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/core/components';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { AuthService, LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { InnercardComponent } from 'src/app/shared/components';
import { StatusTurma, StatusTurmaLabelMapping } from 'src/app/shared/models/status-turma.enum';
import { Turma } from 'src/app/shared/models/turma';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';
import { DataUtils } from 'src/app/shared/services/data.service';
import { TurmaService } from 'src/app/shared/services/turma.service';

@Component({
  selector: 'app-tabela-auxiliar-turma-manter',
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
    MatTooltipModule,
    PrimeiraMaiusculaPipe,
    InnercardComponent,
  ],
  providers: [
    provideNativeDateAdapter(), // necessário adicionar esse provider para o time picker apresentar no formato hh:mm    
  ]
})
export class ListComp implements OnInit {

  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly turmaService = inject(TurmaService);
  authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);

  form!: FormGroup;
  turmas = signal(emptyPage<Turma>());

  ctrlFiltro = new FormControl('', { nonNullable: true });
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'nome', direction: 'asc' }));
  displayedColumns: string[] = ['codigo', 'nome', 'curso', 'anoPeriodo', 'professor', 'status', 'acoes'];

  statusTurmaLabelMapping = StatusTurmaLabelMapping;

  ngOnInit(): void {
    this._createForm();
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
  }

  novo() {
    const { horaAntes, horaDepois } = DataUtils.getDataAntesEDepois();    
    this.form.patchValue({ horarioInicio: horaAntes, horarioFim: horaDepois }, { emitEvent: true });
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

}
