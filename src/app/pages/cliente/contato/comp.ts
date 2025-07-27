import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/core/components';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import Cliente from 'src/app/shared/models/cliente';
import ClienteContato from 'src/app/shared/models/cliente-contato';
import { ClienteContatoService } from 'src/app/shared/services/cliente.contato.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-cliente-contato',
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
    NgxMaskPipe,
    MatTooltipModule,
    InnercardComponent
  ],
  providers: [
    NgxMaskPipe
  ]
})
export class ContatoComp implements OnInit {

  // private readonly router = inject(Router);  
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly contatoService = inject(ClienteContatoService);
  private readonly dialog = inject(MatDialog);
  private readonly maskPipe = inject(NgxMaskPipe);
  private readonly fb = inject(FormBuilder);

  @Input({ required: true }) cliente!: Cliente | null;
  form!: UntypedFormGroup;
  contatoCliente = signal<ClienteContato | null>(null);
  contatosCliente = signal<ClienteContato[]>([]);


  ngOnInit(): void {
    this.createForm();
    this.recuperarContatos();
  }

  recuperarContatos() {
    if (this.cliente && this.cliente.id) { // Ensure cliente and cliente.id exist
      this.contatoService.recuperarPorIdCliente(this.cliente.id) // Use cliente.id directly
        .subscribe({
          next: (result) => {
            this.contatosCliente.set(result);
          },
          error: (err) => { // <--- Add error handling
            this.notification.showError('Erro ao recuperar contatos.');
            console.error('Erro ao recuperar contatos:', err);
            this.contatosCliente.set([]); // Clear contacts on error
          }
        });
    } else {
      console.warn('Cliente ou Cliente ID não disponível para recuperar contatos.');
      this.contatosCliente.set([]); // Ensure signal is set even if cliente is missing
    }
  }

  private createForm() {
    this.form = this.fb.group({
      numero: new FormControl<string | null>('', { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      return;
    }

    if (!this.cliente || !this.cliente.id) {
      console.error('Cliente ou Cliente ID não disponível para salvar contato.');
      this.notification.showError('Erro: Dados do cliente ausentes.');
      return;
    }

    const clienteId = this.cliente.id; // Store client ID once
    const contatoId = this.contatoCliente()?.id; // Store contact ID once
    const formValue = this.form.value as Partial<ClienteContato>; // Explicitly cast form value

    this.spinner.showUntilCompletedCascate(
      this.contatoService.salvar(clienteId, contatoId, formValue)
    ).pipe(
      switchMap(savedContato => {
        return this.contatoService.recuperarPorIdCliente(clienteId);
      }),
      catchError(err => {
        this.notification.showError('Erro ao salvar contato.');
        console.error('Erro ao salvar contato:', err);
        return EMPTY;
      })
    ).subscribe({
      next: (result) => {
        this.contatosCliente.set(result);
        this.notification.showSuccess('Operação realizada com sucesso.');
      },
    });

    this.limparForm();
  }

  apagar(entity: ClienteContato) {
    const maskedNumero = this.maskPipe.transform(entity.numero, '(00)0000-0000');
    const dialogRef$ = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: 'Apagar contato',
        message: `Confirmar apagar contato: <b>${maskedNumero}</b>!`
      },
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        if (!this.cliente || !this.cliente.id) {
          console.error('Cliente ou Cliente ID não disponível para apagar contato.');
          this.notification.showError('Erro: Dados do cliente ausentes.');
          return;
        }

        this.spinner.showUntilCompletedCascate(
          this.contatoService.apagar(entity.id)
        ).pipe(
          switchMap(_ => this.contatoService.recuperarPorIdCliente(this.cliente!.id)),
          catchError(err => {
            this.notification.showError(err.message);
            console.error('Erro ao executar chamada ao backend:', err);
            return EMPTY; // Return EMPTY to stop the stream on error
          })
        ).subscribe({
          next: (result) => {
            this.contatosCliente.set(result);
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
