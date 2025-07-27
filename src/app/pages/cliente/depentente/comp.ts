import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/core/components';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import Cliente from 'src/app/shared/models/cliente';
import ClienteDependente from 'src/app/shared/models/cliente-dependente';
import { TipoParentesco, TipoParentescoLabelMapping } from 'src/app/shared/models/tipo-parentesco.enum';
import { TipoSexo, TipoSexoLabelMapping } from 'src/app/shared/models/tipo-sexo.enum';
import { ClienteDependenteService } from 'src/app/shared/services/cliente.dependente.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";

@Component({
  selector: 'app-cliente-dependente',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgxMaskDirective,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    NgxMaskPipe,
    MatTooltipModule,
    MatDatepickerModule,
    InnercardComponent
  ],
  providers: [
    NgxMaskPipe
  ]
})
export class DependenteComp implements OnInit {

  // private readonly router = inject(Router);  
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly dependenteService = inject(ClienteDependenteService);
  private readonly dialog = inject(MatDialog);
  private readonly maskPipe = inject(NgxMaskPipe);
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) cliente!: Cliente | null;
  form!: UntypedFormGroup;
  dependenteCliente = signal<ClienteDependente | null>(null);
  dependentesCliente = signal<ClienteDependente[]>([]);

  tiposSexo = Object.values(TipoSexo);
  tipoSexoLabelMapping = TipoSexoLabelMapping;

  tiposParentesco = Object.values(TipoParentesco);
  tipoParentescoLabelMapping = TipoParentescoLabelMapping;
  

  ngOnInit(): void {
    this._createForm();
    this.recuperarDependentes();
  }

  recuperarDependentes() {
    if (this.cliente && this.cliente.id) { // Ensure cliente and cliente.id exist
      this.dependenteService.recuperarPorIdCliente(this.cliente.id) // Use cliente.id directly
        .subscribe({
          next: (result) => {
            this.dependentesCliente.set(result);
          },
          error: (err) => { // <--- Add error handling
            this.notification.showError('Erro ao recuperar dependentes.');
            console.error('Erro ao recuperar dependentes:', err);
            this.dependentesCliente.set([]); // Clear contacts on error
          }
        });
    } else {
      console.warn('Cliente ou Cliente ID não disponível para recuperar dependentes.');
      this.dependentesCliente.set([]); // Ensure signal is set even if cliente is missing
    }
  }

  private _createForm() {
    this.form = this.fb.group({
      nome: new FormControl<string | null>('', { validators: [Validators.required] }),
      sexo: new FormControl<string | null>('', { validators: [Validators.required] }),
      docCPF: new FormControl<string | null>('', { validators: [Validators.required] }),
      parentesco: new FormControl<string | null>('', { validators: [Validators.required] }),
      dataNascimento: new FormControl<string | null>('', { validators: [Validators.required] }),      
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      return;
    }

    if (!this.cliente || !this.cliente.id) {
      console.error('Cliente ou Cliente ID não disponível para salvar dependente.');
      this.notification.showError('Erro: Dados do cliente ausentes.');
      return;
    }

    const clienteId = this.cliente.id; // Store client ID once
    const dependenteId = this.dependenteCliente()?.id; // Store contact ID once
    const formValue = this.form.value as Partial<ClienteDependente>; // Explicitly cast form value

    this.spinner.showUntilCompletedCascate(
      this.dependenteService.salvar(clienteId, dependenteId, formValue)
    ).pipe(
      switchMap(saved => {
        return this.dependenteService.recuperarPorIdCliente(clienteId);
      }),
      catchError(err => {
        this.notification.showError('Erro ao salvar dependente.');
        console.error('Erro ao salvar dependente:', err);
        return EMPTY;
      })
    ).subscribe({
      next: (result) => {
        this.dependentesCliente.set(result);
        this.notification.showSuccess('Operação realizada com sucesso.');
      },
    });

    this.limparForm();
  }

  apagar(entity: ClienteDependente) {    
    const dialogRef$ = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: 'Apagar dependente',
        message: `Confirmar apagar dependente:<b> ${entity.nome}</b>!`
      },
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        if (!this.cliente || !this.cliente.id) {
          console.error('Cliente ou Cliente ID não disponível para apagar dependente.');
          this.notification.showError('Erro: Dados do cliente ausentes.');
          return;
        }

        this.spinner.showUntilCompletedCascate(
          this.dependenteService.apagar(entity.id)
        ).pipe(
          switchMap(_ => this.dependenteService.recuperarPorIdCliente(this.cliente!.id)),
          catchError(err => {
            this.notification.showError('Erro ao apagar dependente.');
            console.error('Erro ao apagar dependente:', err);
            return EMPTY; // Return EMPTY to stop the stream on error
          })
        ).subscribe({
          next: (result) => {
            this.dependentesCliente.set(result);
            this.notification.showSuccess('Operação realizada com sucesso.');
          },
        });
      }
    });
  }


  private limparForm() {
    this.form.reset(''); // Reset all controls to empty string
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }
}
