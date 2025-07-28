import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { APP_USER, UserRole } from 'src/app/core/models';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Empresa } from 'src/app/shared/models/empresa';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { ListComp } from '../empresa-usuario/comp';


@Component({
  selector: 'app-contrato-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    InnercardComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    NgxMaskDirective,
    MatProgressSpinnerModule,
    MatSelectModule,
    ListComp

  ],
  
})
export class EmpresaManterComp implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly empresaService = inject(EmpresaService);
  private readonly utilService = inject(UtilsService);
  private readonly fb = inject(FormBuilder);

  appUser = inject(APP_USER);
  usuarioEhSuperAdmin = this.appUser()?.roles.includes(UserRole.SUPER_ADMIN) || false;

  form!: FormGroup;
  empresa = signal<Empresa | null>(null); // Use 'any' por enquanto, ou crie uma interface para Empresa



  ngOnInit(): void {
    this._createForm();
    this._initForm();
  }

  private _createForm() {
    this.form = this.fb.group({
      id: [null], // ID não é exibido, mas pode ser usado para edição
      nomeFantasia: ['', Validators.required],
      razaoSocial: ['', Validators.required],
      // cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)]], // Exemplo de regex para CNPJ formatado
      // cnpj: ['', [Validators.required, Validators.pattern(/^\d{14}$/)]], // Exemplo de regex para CNPJ formatado
      cnpj: ['', [Validators.required]], // Exemplo de regex para CNPJ formatado
      inscricaoEstadual: [''],
      telefone: [''],
      email: ['', [Validators.required, Validators.email]],
      endereco: ['', Validators.required],
      logoUrl: ['', Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i)], // Exemplo de regex para URL
      ativo: [true],
      // dataCadastro e dataAtualizacao são gerenciados pelo backend
    });
  }

  private _initForm() {
    const tempEntity = this.route.snapshot.data['entity'] as Empresa;

    if (tempEntity) {
      this.empresa.set(tempEntity);
      this.form.patchValue({
        ...this.empresa(),
      }, { emitEvent: true });
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    this.spinner.showUntilCompleted(
      this.empresaService.salvar(this.form.value as Partial<Empresa>)).subscribe({
        next: (result) => {
          this.empresa.set(result);
          this.notification.showSuccess('Operação realizada com sucesso.');
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError(err.message);
          console.error('Erro ao recuperar dependentes:', err);
        }
      });
  }


}
