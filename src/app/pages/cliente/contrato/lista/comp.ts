import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { LoadingSpinnerService } from 'src/app/core/services';
import Contrato from 'src/app/shared/models/contrato';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { InnercardComponent } from "../../../../shared/components/innercard/innercard.component";
import { ContratoDetalheDialog } from './detalhe';

@Component({
  selector: 'app-contratos-list',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../../pages.component.scss'],
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
    InnercardComponent,
  ]
})
export class ContratoListComp implements OnInit, OnDestroy {

  // private readonly router = inject(Router);  
  // private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly contratosService = inject(ContratoService);
  private readonly dialog = inject(MatDialog);

  moduloAdmin = signal<boolean>(true);
  moduloFinanceiro = signal<boolean>(false);

  @Input({ required: false }) isModuloFinanceiro = false;


  contratos = signal(emptyPage<Contrato>());
  ctrlFiltro = new FormControl('', { nonNullable: true });
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'numeroContrato', direction: 'asc' }));
  displayedColumns: string[] = ['numeroContrato', 'cliente', 'dataInicio', 'dataFim', 'valorTotal', 'acoes'];
  // Subject to emit a signal when the component is destroyed, for RxJS cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (this.isModuloFinanceiro) {
      this.moduloFinanceiro.set(true);
      this.moduloAdmin.set(false);
    }
    this.buscarContratos();
    // Set up debouncing for the filter control
    this.ctrlFiltro.valueChanges.pipe(
      debounceTime(500), // Wait for 300ms after the last keystroke
      distinctUntilChanged(), // Only emit when the current value is different from the last
      takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
    ).subscribe(() => {
      this.buscarContratos(); // Perform the search after debounce time
    });
  }

  ngOnDestroy(): void {
    // Emit a signal to complete all subscriptions that use takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  buscarContratos() {
    this.spinner
      .showUntilCompleted(this.contratosService.buscar(this.ctrlFiltro.value, this.page()))
      .subscribe(result => {
        this.contratos.set(result);
      });
  }

  sortData(sort: Sort) {
    this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    this.spinner
      .showUntilCompleted(this.contratosService.buscar(this.ctrlFiltro.value, this.page()))
      .subscribe(result => {
        // this.contratos.set(result);
      });
  }

  visualizar(entity: Contrato) {
    this.dialog.open(ContratoDetalheDialog, { width: '550px', data: entity });
  }

}
