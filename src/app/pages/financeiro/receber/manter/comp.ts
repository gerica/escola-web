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
import { MSG_SUCESS } from 'src/app/shared/common/constants';
import { InnercardComponent } from 'src/app/shared/components';
import { ContaReceber } from 'src/app/shared/models/conta-receber';
import Contrato from 'src/app/shared/models/contrato';
import { Matricula } from 'src/app/shared/models/matricula';
import { StatusContaReceber, StatusContaReceberLabelMapping } from 'src/app/shared/models/status-conta-receber.enum';
import { StatusMatricula, StatusMatriculaLabelMapping } from 'src/app/shared/models/status-matricula.enum';
import { Turma } from 'src/app/shared/models/turma';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';
import { ContaReceberService } from 'src/app/shared/services/conta.receber.service';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { MatriculaService } from 'src/app/shared/services/matricula.service';
import { ContaReceberDetalheDialog } from './detalhe/detalhe';

@Component({
  selector: 'app-conta-receber-manter',
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
    MatTooltipModule,
    InnercardComponent
  ],
})
export class ContaReceberManterComp implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly contaReceberService = inject(ContaReceberService);
  private readonly dialog = inject(MatDialog);

  contrato = signal<Contrato | null>(null);
  contasReceber = signal<ContaReceber[]>([]);

  displayedColumns: string[] = ['dataVencimento', 'valorTotal', 'desconto', 'valorPago', 'dataPagamento', 'status', 'acoes'];


  statusContaReceber = Object.values(StatusContaReceber);
  statusContaReceberLabelMapping = StatusContaReceberLabelMapping;

  ngOnInit(): void {
    this._initForm();
  }

  private _initForm() {
    const tempEntity = this.route.snapshot.data['entity'] as Contrato;

    if (tempEntity) {
      this.contrato.set(tempEntity);
      this.buscar();
    }

  }

  criarContas() {
    if (this.contrato()) {
      // this.spinner.showUntilCompleted(this.contaReceberService.criar(this.contrato()!.id)).subscribe({
      //   next: _ => this.notification.showSuccess(MSG_SUCESS),
      //   error: (err) => this.notification.showError('Erro ao salvar contrato: ' + (err.message || 'Erro desconhecido.')),
      //   complete: () => this.buscar()
      // })

      this.spinner.showUntilCompletedCascate(
        this.contaReceberService.criar(this.contrato()!.id)
      ).pipe(
        switchMap(_ => {
          return this.contaReceberService.buscar(this.contrato()!.id);
        }),
        catchError(err => {
          this.notification.showError(err.message);
          console.error('Erro ao executar chamada ao backend:', err);
          return EMPTY;
        })
      ).subscribe({
        next: (result) => {
          this.contasReceber.set(result);
          this.notification.showSuccess(MSG_SUCESS);
        }, error: (err) => {
          this.notification.showError(err.message);
          console.error('Erro ao recuperar dados:', err);
        }
      });
    }
  }

  getStatus(status: StatusContaReceber) {
    return this.statusContaReceberLabelMapping[status];
  }

  salvar(value: Partial<ContaReceber>) {

    this.spinner.showUntilCompletedCascate(
      this.contaReceberService.salvar(value, this.contrato()!.id)
    ).pipe(
      switchMap(_ => {
        return this.contaReceberService.buscar(this.contrato()!.id);
      }),
      catchError(err => {
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
        return EMPTY;
      })
    ).subscribe({
      next: (result) => {
        this.contasReceber.set(result);
        this.notification.showSuccess('Operação realizada com sucesso.');
      }, error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recuperar dependentes:', err);
      }
    });
  }

  sortData(sort: Sort) {
    const data = this.contasReceber();

    if (!sort.active || sort.direction === '') {
      this.buscar();
      return;
    }

    const sortedData = [...data].sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      let valA: any;
      let valB: any;

      switch (sort.active) {
        case 'dataVencimento':
          valA = a.dataVencimento ? new Date(a.dataVencimento).getTime() : null;
          valB = b.dataVencimento ? new Date(b.dataVencimento).getTime() : null;
          break;
        case 'valorTotal':
          valA = a.valorTotal;
          valB = b.valorTotal;
          break;
        case 'desconto':
          valA = a.desconto;
          valB = b.desconto;
          break;
        case 'valorPago':
          valA = a.valorPago;
          valB = b.valorPago;
          break;
        case 'dataPagamento':
          valA = a.dataPagamento ? new Date(a.dataPagamento).getTime() : null;
          valB = b.dataPagamento ? new Date(b.dataPagamento).getTime() : null;
          break;
        case 'status':
          valA = a.status;
          valB = b.status;
          break;
        default:
          return 0;
      }

      return this.compare(valA, valB, isAsc);
    });

    this.contasReceber.set(sortedData);
  }

  buscar() {
    this.spinner
      .showUntilCompleted(this.contaReceberService.buscar(this.contrato()!.id))
      .subscribe({
        next: (result) => {
          this.contasReceber.set(result);
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          console.error('Erro ao recuperar dados:', err);
        }
      });
  }

  visualizar(entity: ContaReceber) {
    this.dialog.open(ContaReceberDetalheDialog, {
      width: '550px',
      data: {
        ...entity,
      }
    });
  }

  alterar(entity: ContaReceber) {
    const dialogRef$ = this.dialog.open(ContaReceberDetalheDialog, {
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


  confirmarExclusao(entity: ContaReceber) {
    const dialogRef$ = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: `Realizar a exclusão da conta`,
        message: 'Você tem certeza que deseja excluir esta conta?'
      }
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        this.excluir(entity);
      }
    });
  }

  excluir(entity: ContaReceber) {
    this.spinner.showUntilCompletedCascate(
      this.contaReceberService.remover(entity.id)
    ).pipe(
      switchMap(_ => {
        return this.contaReceberService.buscar(this.contrato()!.id);
      }),
      catchError(err => {
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
        return EMPTY;
      })
    ).subscribe({
      next: (result) => {
        this.contasReceber.set(result);
        this.notification.showSuccess('Operação realizada com sucesso.');
      }, error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recuperar dependentes:', err);
      }
    });
  }

  private compare(a: any, b: any, isAsc: boolean): number {
    let comparison = 0;
    // nulls/undefined go to the end
    if (a === null || a === undefined) {
      comparison = (b === null || b === undefined) ? 0 : 1;
    } else if (b === null || b === undefined) {
      comparison = -1;
    } else if (a > b) {
      comparison = 1;
    } else if (a < b) {
      comparison = -1;
    }
    return comparison * (isAsc ? 1 : -1);
  }

}
