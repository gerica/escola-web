import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { AuthService, LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { CardComponent } from 'src/app/shared/components';
import { ContaReceberResumoPorMesDetalhe } from 'src/app/shared/models/conta-receber';
import { CHAVE_MENSAGEM_WHATSAPP } from 'src/app/shared/models/parametro';
import { Turma } from 'src/app/shared/models/turma';
import { AdministrativoService } from 'src/app/shared/services/admin.service';
import { ContaReceberService } from 'src/app/shared/services/conta.receber.service';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { MatriculaService } from 'src/app/shared/services/matricula.service';

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
    MatTooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinanceiroResumoTabelaComponent implements OnInit {
  private readonly contaReceberService = inject(ContaReceberService);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly matriculaService = inject(MatriculaService);
  private readonly authService = inject(AuthService);
  private readonly admService = inject(AdministrativoService);

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

  abrirWhatsApp(item: ContaReceberResumoPorMesDetalhe): void {
    // this.spinner.showUntilCompleted(this.matriculaService.recuperarPorCodigo(item.contrato.numeroContrato)).subscribe({
    //   next: (result) => {
    //     this._enviarMensagemWhatsApp(result.turma)
    //   },
    //   error: (err) => {
    //     this.notification.showError(err.message);
    //     console.error('Erro ao recarregar as contas a receber:', err);
    //   }
    // });

    this.spinner.loadingOn();
    (this.spinner as any).loadingCount++; // Accessing private property, see note below

    forkJoin({
      resultWhatsapp: this.admService.findByChave(CHAVE_MENSAGEM_WHATSAPP),
      resultMatricula: this.matriculaService.recuperarPorCodigo(item.contrato.numeroContrato),
    }).subscribe({
      next: (results) => {
        console.log(results);
        const { resultWhatsapp, resultMatricula } = results;
        this._enviarMensagemWhatsApp(resultWhatsapp.valor, resultMatricula.turma)
      },
      error: (error) => {
        console.error('Error fetching admin parameters:', error);
      },
      complete: () => {
        (this.spinner as any).loadingCount--;
        if ((this.spinner as any).loadingCount === 0) {
          this.spinner.loadingOff();
        }
      }
    });
  }

  private _enviarMensagemWhatsApp2(textoComunicacao: string, turma: Turma): void {
    const nomeEmpresa = this.authService.loggedUser()?.empresa.nomeFantasia;
    const data = new Date(this._dataRef);

    // Usa Intl.DateTimeFormat para obter o nome do mês por extenso em português.
    const mesExtenso = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);

    // Obtém o ano da data.
    const ano = data.getFullYear();

    // Capitaliza a primeira letra do mês.
    const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);

    const numero = '5561992489493'; // Seu número de telefone
    // A mensagem em si. Você pode usar crases (``) para facilitar a interpolação de variáveis.
    // const mensagem = `Olá. Aqui é a ${nomeEmpresa}\n\nEste é um lembrete sobre o pagamento pendente referente ao mês ${mesCapitalizado}, para a turma ${turma.nome} que ainda não foi registrado em nosso sistema.\nSe o pagamento já foi realizado, por favor, ignore esta notificação.\nAtenciosamente,`;
    // const mensagem = `Olá!    

    // Notamos que o pagamento da mensalidade de ${mesCapitalizado} para a turma ${turma.nome} ainda não foi registrado em nosso sistema.    
    // Se você já realizou o pagamento, por favor, desconsidere esta notificação.    
    // Estamos à disposição para qualquer dúvida.

    // Atenciosamente,

    // ${nomeEmpresa}`
    // Codifica a mensagem para URL, substituindo espaços e caracteres especiais
    const mensagemCodificada = encodeURIComponent(textoComunicacao);
    console.log(mensagemCodificada);

    // const url = `https://wa.me/${numero}?text=${mensagemCodificada}`;

    // // // Abre o link em uma nova aba do navegador
    // window.open(url, '_blank');
    this.notification.showSuccess('Operação realizada com sucesso.');
  }

  private _enviarMensagemWhatsApp(textoComunicacao: string, turma: Turma): void {
    const nomeEmpresa = this.authService.loggedUser()?.empresa.nomeFantasia;
    const data = new Date(this._dataRef);

    const mesExtenso = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);
    const mesCapitalizado = mesExtenso.charAt(0).toUpperCase() + mesExtenso.slice(1);
    const numero = '5561992489493';

    // 1. Limpa o texto: Remove &nbsp; e as quebras de linha que vêm das tags <p>
    let mensagemFormatada = textoComunicacao.replace(/<p>|<\/p>/g, '\n').replace(/&nbsp;/g, ' ');

    // 2. Substitui as tags HTML pelas marcações do WhatsApp
    // Negrito: **
    mensagemFormatada = mensagemFormatada.replace(/<strong>(.*?)<\/strong>/g, '*$1*');
    // Itálico: _
    mensagemFormatada = mensagemFormatada.replace(/<em>(.*?)<\/em>/g, '_$1_');    
    // Tachado: ~
    mensagemFormatada = mensagemFormatada.replace(/<s>|<\/s>/g, '~');

    // 3. Realiza a interpolação das variáveis
    mensagemFormatada = mensagemFormatada
      .replace(/\${mesCapitalizado}/g, mesCapitalizado)
      .replace(/\${turma.nome}/g, turma.nome)
      .replace(/\${nomeEmpresa}/g, nomeEmpresa || '');

    // 4. Limpa espaços e quebras de linha em excesso
    mensagemFormatada = mensagemFormatada.trim();

    // 5. Codifica a mensagem para a URL
    const mensagemCodificada = encodeURIComponent(mensagemFormatada);

    const url = `https://wa.me/${numero}?text=${mensagemCodificada}`;

    window.open(url, '_blank');
    this.notification.showSuccess('Operação realizada com sucesso.');
  }
}