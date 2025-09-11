import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChartOptions } from 'chart.js';
import { BaseChartDirective, provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { NotificationService } from 'src/app/core/services';
import { InnercardComponent } from 'src/app/shared/components';
import { ContaReceberResumoPorMes } from 'src/app/shared/models/conta-receber';
import { ContaReceberService } from 'src/app/shared/services/conta.receber.service';

@Component({
  selector: 'app-financeiro-resumo-grafico',
  templateUrl: './resumo.grafico.html',
  styleUrls: ['./comp.scss'],
  imports: [CommonModule, BaseChartDirective, MatProgressSpinnerModule, InnercardComponent],
  providers: [provideCharts(withDefaultRegisterables())],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceiroResumoGraficoComponent implements OnInit {
  private readonly contaReceberService = inject(ContaReceberService);
  private readonly notification = inject(NotificationService);

  resumo = signal<ContaReceberResumoPorMes | null>(null);
  titulo = signal<string>('');
  loading = signal<boolean>(false);

  private _dataRef: Date = new Date();

  @Input()
  set dataRef(value: Date) {
    this._dataRef = value;
    // Trigger a new data fetch whenever dataRef changes
    this._montaTitulo();
    this._fetchResumoPorMes();
  }

  get dataRef(): Date {
    return this._dataRef;
  }

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
  };
  public pieChartLabels = ['Total Recebido', 'Total em Aberto'];

  public chartDatasets = computed(() => {
    return [
      {
        data: [this.resumo()?.totalRecebido, this.resumo()?.totalEmAberto],
        backgroundColor: ['#4CAF50', '#F44336']
      }
    ];
  });

  ngOnInit(): void {
    this._montaTitulo();
    this._fetchResumoPorMes()
  }

  public hasDataForChart(): boolean {
    const totalRecebido = this.resumo()?.totalRecebido ?? 0;
    const totalEmAberto = this.resumo()?.totalEmAberto ?? 0;

    return totalRecebido > 0 || totalEmAberto > 0;
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

  private _fetchResumoPorMes() {
    this.loading.set(true);
    this.contaReceberService.fetchResumoPorMes(this.dataRef).subscribe({
      next: (result) => {
        this.resumo.set(result)
      },
      error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recarregar as contas a receber:', err);
      },
      complete: () => this.loading.set(false)
    });
  }
}