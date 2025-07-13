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
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { LoadingSpinnerService } from 'src/app/core/services';
import Cliente from 'src/app/shared/models/cliente';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { ClienteDetalheDialog } from './detalhe';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

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
  // private readonly notification = inject(NotificationService);
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
    this.dialog.open(ClienteDetalheDialog, { width: '550px', data: entity });
  }

}
