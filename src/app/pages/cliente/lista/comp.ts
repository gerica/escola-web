import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { emptyPage, firstPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import Cliente from 'src/app/shared/models/cliente';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { ClienteDetalheDialog } from './detalhe';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { StatusCliente, StatusClienteLabelMapping } from 'src/app/shared/models/status-cliente.enum';
import { ConfirmDialogComponent } from 'src/app/core/components';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    InnercardComponent
  ]
})
export class ListComp implements OnInit, OnDestroy {

  // private readonly router = inject(Router);  
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly clienteService = inject(ClienteService);
  private readonly dialog = inject(MatDialog);

  clientes = signal(emptyPage<Cliente>());
  ctrlFiltro = new FormControl('', { nonNullable: true });
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'nome', direction: 'asc' }));
  displayedColumns: string[] = ['nome', 'dataNascimento', 'docCPF', 'email', 'acoes'];
  // Subject to emit a signal when the component is destroyed, for RxJS cleanup
  private destroy$ = new Subject<void>();
  statusClienteLabelMapping = StatusClienteLabelMapping;

  ngOnInit(): void {
    this.buscarClientes();
    // Set up debouncing for the filter control
    this.ctrlFiltro.valueChanges.pipe(
      debounceTime(500), // Wait for 300ms after the last keystroke
      distinctUntilChanged(), // Only emit when the current value is different from the last
      takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
    ).subscribe(() => {
      this.buscarClientes(); // Perform the search after debounce time
    });
  }

  ngOnDestroy(): void {
    // Emit a signal to complete all subscriptions that use takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  buscarClientes() {

    this.spinner
      .showUntilCompleted(this.clienteService.buscar(this.ctrlFiltro.value, this.page()))
      .subscribe(result => {
        this.clientes.set(result);
      });
  }

  sortData(sort: Sort) {
    this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    this.spinner
      .showUntilCompleted(this.clienteService.buscar(this.ctrlFiltro.value, this.page()))
      .subscribe(result => {
        this.clientes.set(result);
      });
  }

  visualizar(entity: Cliente) {
    this.dialog.open(ClienteDetalheDialog, {
      width: '550px', data: {
        ...entity,
        cidade: {
          descricao: entity.cidadeDesc,
          uf: entity.uf,
          codigoCidade: entity.codigoCidade
        }
      }
    });
  }

  // Novo método para obter a classe CSS da linha
  getIconePorStatus(status: StatusCliente): string {
    switch (status) {
      case StatusCliente.ATIVO:
        return 'status-ativo';
      case StatusCliente.INATIVO:
        return 'status-inativo';
      case StatusCliente.BLOQUEADO:
        return 'block';
      case StatusCliente.PENDENTE_APROVACAO:
        return 'status-pendente';
      default:
        return ''; // Retorna vazio se não houver um status correspondente
    }
  }

  getStatusClienteDesc(status: StatusCliente) {
    return this.statusClienteLabelMapping[status];
  }

  isStatusAtivo(status: StatusCliente): boolean {
    return status === StatusCliente.ATIVO;
  }

  isStatusInativo(status: StatusCliente): boolean {
    return status === StatusCliente.INATIVO;
  }

  isStatusBloqueado(status: StatusCliente): boolean {
    return status === StatusCliente.BLOQUEADO;
  }

  isStatusPendente(status: StatusCliente): boolean {
    return status === StatusCliente.PENDENTE_APROVACAO;
  }

  confirmarExclusao(entity: Cliente) {
    const dialogRef$ = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: `Realizar a exclusão do cliente: ${entity.nome}`,
        message: 'Você tem certeza que deseja excluir este cliente?'
      }
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        this.excluir(entity);
      }
    });
  }

  excluir(entity: Cliente) {
    this.spinner.showUntilCompletedCascate(
      this.clienteService.remover(entity.id)
    ).pipe(
      switchMap(_ => {
        return this.clienteService.buscar(this.ctrlFiltro.value, this.page());
      }),
      catchError(err => {
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
        return EMPTY;
      })
    ).subscribe({
      next: (result) => {
        this.clientes.set(result);
        this.notification.showSuccess('Operação realizada com sucesso.');
      }, error: (err) => {
        this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
        console.error('Erro ao recuperar dados:', err);
      }
    });
  }

}
