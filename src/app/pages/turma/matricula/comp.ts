import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
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
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/core/components';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { InnercardComponent } from 'src/app/shared/components';
import Contrato from 'src/app/shared/models/contrato';
import { Matricula } from 'src/app/shared/models/matricula';
import { StatusMatricula, StatusMatriculaLabelMapping } from 'src/app/shared/models/status-matricula.enum';
import { Turma } from 'src/app/shared/models/turma';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { MatriculaService } from 'src/app/shared/services/matricula.service';
import { ContratoDialogComponent } from './contrato/contrato.modal';
import { MatriculaDetalheDialog } from './detalhe/detalhe';
import { MatriculaDialogComponent } from './modal-matricula/matricula.modal';

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
    MatTooltipModule,
    InnercardComponent,
    PrimeiraMaiusculaPipe
  ],
})
export class MatriculaManterComp implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly matriculaService = inject(MatriculaService);
  private readonly contratoService = inject(ContratoService);

  private readonly dialog = inject(MatDialog);

  @Input({ required: true }) turma!: Turma | null;

  matriculas = signal(emptyPage<Matricula>());

  // ctrlFiltro = new FormControl('', { nonNullable: true });
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'codigo', direction: 'asc' }));
  displayedColumns: string[] = ['codigo', 'nome', 'status', 'acoes'];

  statusAberto = StatusMatricula.ABERTA;
  statusMatricula = Object.values(StatusMatricula);
  statusMatriculaLabelMapping = StatusMatriculaLabelMapping;

  ngOnInit(): void {
    this._initForm();
  }

  private _initForm() {
    const entity = this.route.snapshot.data['entity'] as Turma;
    if (entity) {
      this.turma = entity;
      this.buscar();
    }
  }

  getStatus(status: StatusMatricula) {
    return this.statusMatriculaLabelMapping[status];
  }

  salvar(value: Partial<Matricula>) {
    value.turma = this.turma!;
    this.spinner.showUntilCompletedCascate(
      this.matriculaService.salvar(value)
    ).pipe(
      switchMap(_ => {
        return this.matriculaService.buscar(this.turma!.id, this.page());
      }),
      catchError(err => {
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
        return EMPTY;
      })
    ).subscribe({
      next: (result) => {
        this.matriculas.set(result);
        this.notification.showSuccess('Operação realizada com sucesso.');
      }, error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recuperar dependentes:', err);
      }
    });
  }

  sortData(sort: Sort) {
    this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    this.buscar();
  }

  buscar() {
    this.spinner
      .showUntilCompleted(this.matriculaService.buscar(this.turma!.id, this.page()))
      .subscribe({
        next: (result) => {
          this.matriculas.set(result);
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError(err.message);
          console.error('Erro ao recuperar dependentes:', err);
        }
      });
  }

  abrirModalInscricao() {
    const dialogRef$ = this.dialog.open(MatriculaDialogComponent, {
      width: '750px',
      // height: '400px',
      data: {
        title: `Realizar inscrição na turma: ${this.turma?.nome}`,
      }
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result && result.salvar) {
        this.salvar(result.matricula);
      }
    });
  }

  visualizar(entity: Matricula) {
    this.dialog.open(MatriculaDetalheDialog, {
      width: '550px',
      data: {
        ...entity,
      }
    });
  }

  alterar(entity: Matricula) {
    const dialogRef$ = this.dialog.open(MatriculaDetalheDialog, {
      width: '550px',
      data: {
        ...entity,
        editar: true
      }
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) { // Se 'result' não for undefined (ou seja, o botão Salvar foi clicado)
        this.salvar(result);
      }
    });
  }

  abrirContrato(entity: Matricula) {
    this.spinner.showUntilCompleted(this.contratoService.recuperarPorIdMatricula(entity.id))
      .subscribe({
        next: (result) => {
          this.showModalContrato(entity, result);
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError(err.message);
          console.error('Erro ao recuperar dependentes:', err);
        }
      });
  }

  showModalContrato(matricula: Matricula, contrato: Contrato) {
    this.dialog.open(ContratoDialogComponent, {
      width: '80vw',
      data: {
        matricula,
        contrato
      }
    });
  }

  confirmarExclusao(entity: Matricula) {
    const dialogRef$ = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: `Realizar a exclusão da matricula: ${entity.codigo}`,
        message: 'Você tem certeza que deseja excluir esta matricula?'
      }
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        this.excluir(entity);
      }
    });
  }

  excluir(entity: Matricula) {
    this.spinner.showUntilCompletedCascate(
      this.matriculaService.remover(entity.id)
    ).pipe(
      switchMap(_ => {
        return this.matriculaService.buscar(this.turma!.id, this.page());
      }),
      catchError(err => {
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
        return EMPTY;
      })
    ).subscribe({
      next: (result) => {
        this.matriculas.set(result);
        this.notification.showSuccess('Operação realizada com sucesso.');
      }, error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recuperar dependentes:', err);
      }
    });
  }

}
