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
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, finalize, forkJoin, map, mergeMap, Subject, takeUntil } from 'rxjs';
import { emptyPage, firstPageAndSort, Page, PageRequest } from 'src/app/core/models';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { CardComponent } from 'src/app/shared/components';
import { ActionsComponent } from 'src/app/shared/components/actions/actions.component';
import Contrato from 'src/app/shared/models/contrato';
import { StatusContrato, StatusContratoLabelMapping } from 'src/app/shared/models/status-contrato.enum';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { ContratoDetalheDialog } from './detalhe';
import { ContaReceberService } from 'src/app/shared/services/conta.receber.service';
import { Observable } from '@apollo/client/utilities';

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
    CardComponent,
    MatSelectModule,
    ActionsComponent
  ]
})
export class ContratoListComp implements OnInit, OnDestroy {

  private readonly notification = inject(NotificationService);
  // private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly contratosService = inject(ContratoService);
  private readonly dialog = inject(MatDialog);
  private readonly utilService = inject(UtilsService);
  private readonly contaReceberService = inject(ContaReceberService);

  moduloAdmin = signal<boolean>(true);
  moduloFinanceiro = signal<boolean>(false);

  @Input({ required: false }) isModuloFinanceiro = false;

  contratos = signal(emptyPage<Contrato>());
  ctrlFiltro = new FormControl('', { nonNullable: true });
  ctrlStatusContrato = new FormControl<StatusContrato[]>([StatusContrato.ATIVO], { nonNullable: true });
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'numeroContrato', direction: 'asc' }));
  displayedColumns: string[] = ['numeroContrato', 'cliente', 'dataInicio', 'dataFim', 'valorTotal', 'desconto', 'status', 'acoes'];
  // Subject to emit a signal when the component is destroyed, for RxJS cleanup
  private destroy$ = new Subject<void>();
  statusContrato = Object.values(StatusContrato);
  statusContratoLabelMapping = StatusContratoLabelMapping;

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

    this.ctrlStatusContrato.valueChanges.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.buscarContratos();
    });
  }

  ngOnDestroy(): void {
    // Emit a signal to complete all subscriptions that use takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  buscarContratos2() {
    this.spinner
      .showUntilCompleted(this.contratosService.buscar(this.ctrlFiltro.value, this.ctrlStatusContrato.value, this.page()))
      .subscribe(result => {
        this.contratos.set(result);
      });
  }

  buscarContratos() {
    // this.spinner.show(); // Inicia o spinner
    this.spinner.showUntilCompleted(this.contratosService.buscar(this.ctrlFiltro.value, this.ctrlStatusContrato.value, this.page())).pipe(
      // 1. Recebe a resposta paginada do backend
      mergeMap(pageResult => {
        // 2. Extrai a lista de contratos da resposta
        const contratos = pageResult.content;

        // 3. Se não houver contratos, retorne a página vazia para evitar erros
        if (contratos.length === 0) {
          return Observable.of(pageResult);
        }

        // 4. Mapeia cada contrato para uma nova chamada de API (ex: para contas a receber)
        const calls = contratos.map(contrato =>
          this.contaReceberService.buscar(contrato.id).pipe(
            // 5. Usa 'map' para combinar os dados originais do contrato com o resultado da nova chamada
            map(resultConta => {
              return {
                ...contrato, // Mantém todos os dados do contrato original
                contaCriada: resultConta.length > 0
              } as Contrato;
            })
          )
        );

        // 6. Usa 'forkJoin' para esperar que todas as chamadas de contas a receber terminem
        return forkJoin(calls).pipe(
          // 7. Mapeia o resultado do 'forkJoin' de volta para um objeto Page
          map(enriquecidos => ({
            ...pageResult, // Mantém os metadados da página original
            content: enriquecidos // Substitui a lista de contratos pela nova lista enriquecida
          }))
        );
      }),
    ).subscribe({
      next: pageFinal => {
        this.contratos.set(pageFinal as Page<Contrato>);
        // Você pode querer armazenar o objeto Page completo em um sinal separado para a paginação
        // this.pageContratos.set(pageFinal);
      },
      error: err => {
        // Lidar com o erro
        console.error('Erro ao buscar e enriquecer contratos', err);
      }
    });
  }

  sortData(sort: Sort) {
    if (sort.direction === "") {
      this.page().sorts = [];
    } else {
      this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    }
    this.buscarContratos();
  }

  visualizar(entity: Contrato) {
    this.dialog.open(ContratoDetalheDialog, { width: '550px', data: entity });
  }

  getStatus(status: StatusContrato) {
    return StatusContratoLabelMapping[status];
  }

  download(type: string) {
    this.spinner.showUntilCompleted(this.contratosService.downloadFile(type, this.ctrlFiltro.value))
      .subscribe({
        next: (result) => {
          this.utilService.downloadFile(result);
        },
        error: (err) => {
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          console.error('Erro ao baixar anexo:', err);
        }
      }
      );
  }

  contaReceberCriada(entity: Contrato): boolean {
    // this.contaReceberService.buscar(entity.id).subscribe({
    //   next: (result) => {
    //     return result.length > 0;
    //   },
    //   error: (err) => {
    //     this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
    //     console.error('Erro ao baixar anexo:', err);
    //   }
    // });
    return false;
  }

}
