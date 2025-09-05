import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroupDirective, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { CustomDateAdapter, MAT_CUSTOM_DATE_FORMATS } from 'src/app/shared/components/adapter/custom/custom-date.adapter';
import Cliente from 'src/app/shared/models/cliente';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { ContaReceberService } from 'src/app/shared/services/conta.receber.service';
import { ContaReceberResumoPorMes } from 'src/app/shared/models/conta-receber';
import { CardComponent } from "src/app/shared/components";
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-painel-financeiro',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    // MatCardModule,
    // MatIconModule,
    // MatTooltipModule,
    // MatSelectModule,
    InnercardComponent,
    CardComponent,
    NgChartsModule,

  ],
  providers: [
    { provide: DateAdapter, useClass: CustomDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_CUSTOM_DATE_FORMATS },
  ]
})
export class PainelFinanceiroComp implements OnInit {

  // private readonly router = inject(Router);  
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly dialog = inject(MatDialog);
  private readonly contaReceberService = inject(ContaReceberService);
  private readonly fb = inject(FormBuilder);

  @ViewChild(FormGroupDirective)
  private formDir!: FormGroupDirective;

  @Input({ required: true }) cliente!: Cliente | null;
  form!: UntypedFormGroup;

  resumo = signal<ContaReceberResumoPorMes | null>(null);

  ngOnInit(): void {
    this._createForm();
    this._fetchResumoPorMes();
  }

  titulocabecalho(): string {
    const dataRefValue = this.form.get('dataRef')?.value;

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
      return `Resumo do mês de ${mesCapitalizado} de ${ano}`;
    }

    return 'Resumo do mês'; // Retorna um valor padrão caso a data não esteja disponível.
  }

  private _createForm() {
    this.form = this.fb.group({
      dataRef: new FormControl<Date>(new Date(), { validators: [Validators.required] }),
    });
  }

  private limparForm() {
    this.formDir.resetForm();
  }

  // Método que será chamado quando o mês for selecionado
  // O parâmetro 'normalizedMonthAndYear' é o mês e o ano que o usuário clicou
  public selecionarMes(normalizedMonthAndYear: Date): void {
    // Define o valor do FormControl com o mês e o ano selecionados        
    this.form.get('dataRef')?.setValue(normalizedMonthAndYear);
    this._fetchResumoPorMes();
  }

  private _fetchResumoPorMes() {
    const dataRef = this.form.get('dataRef')?.value;    
    this.spinner.showUntilCompleted(this.contaReceberService.fetchResumoPorMes(dataRef)).subscribe({
      next: (result) => {
        this.resumo.set(result)
        this.notification.showSuccess('Operação realizada com sucesso.');
      },
      error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recarregar as contas a receber:', err);
      }

    });
  }

  // Método que será chamado quando o usuário fechar o date picker
  public fecharPicker(picker: any): void {
    picker.close();
  }
}
