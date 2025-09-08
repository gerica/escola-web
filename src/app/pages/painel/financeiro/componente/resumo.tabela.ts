import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { NotificationService } from 'src/app/core/services';
import { CardComponent } from 'src/app/shared/components';
import { ContaReceberResumoPorMesDetalhe } from 'src/app/shared/models/conta-receber';
import { ContaReceberService } from 'src/app/shared/services/conta.receber.service';

@Component({
  selector: 'app-financeiro-resumo-tabela',
  templateUrl: './resumo.tabela.html',
  styleUrls: ['./comp.scss'],
  imports: [CommonModule,
    CardComponent,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceiroResumoTabelaComponent implements OnInit {
  private readonly contaReceberService = inject(ContaReceberService);
  private readonly notification = inject(NotificationService);

  resumo = signal(emptyPage<ContaReceberResumoPorMesDetalhe>());
  titulo = signal<string>('');
  loading = signal<boolean>(false);
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'dataPagamento', direction: 'desc' }));
  displayedColumns: string[] = ['contrato', "cliente", 'diasAtraso', 'dataVencimento', 'valorTotal', 'dataPagamento', 'valorPago', 'acoes'];

  private _dataRef: Date = new Date();

  @Input()
  set dataRef(value: Date) {
    this._dataRef = value;
    // Trigger a new data fetch whenever dataRef changes
    this._montaTitulo();
    this.fetchResumoPorMesDetalhe();
  }

  get dataRef(): Date {
    return this._dataRef;
  }

  ngOnInit(): void {
    this._montaTitulo();
    this.fetchResumoPorMesDetalhe()
  }

  sortData(sort: Sort) {
    if (sort.direction === "") {
      this.page().sorts = [];
    } else {
      this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    }
    this.fetchResumoPorMesDetalhe();
  }

  private _montaTitulo() {
    const dataRefValue = this.dataRef;

    if (dataRefValue) {
      // Cria um objeto de data a partir do valor (se ele estiver em um formato de string válido, como 'YYYY-MM-DD').
      const data = new Date(dataRefValue);

      // Usa Intl.DateTimeFormat para obter o nome do mês por extenso em português.
      const mesExtenso = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);

      // Obtém o ano da data.
      const ano = data.getFullYear();

      // Capitaliza a primeira letra do mês.
      const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
      // Retorna a string com o mês e o ano.
      this.titulo.set(`Resumo do mês de ${mesCapitalizado} de ${ano}`);
    } else {
      this.titulo.set('Resumo do mês'); // Retorna um valor padrão caso a data não esteja disponível.
    }
  }

  fetchResumoPorMesDetalhe() {
    this.contaReceberService.fetchResumoPorMesDetalhe(this.dataRef, this.page()).subscribe({
      next: (result) => {
        this.resumo.set(result)
      },
      error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recarregar as contas a receber:', err);
      }

    });
  }
}