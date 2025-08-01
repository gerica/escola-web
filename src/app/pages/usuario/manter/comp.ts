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
import { distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';
import { APP_USER, emptyPage, firstPageAndSort, PageRequest, UserRole } from 'src/app/core/models';
import { debounceDistinctUntilChanged } from 'src/app/core/rxjs-operators';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Empresa } from 'src/app/shared/models/empresa';
import { Usuario } from 'src/app/shared/models/usuario';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";



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
    MatProgressSpinnerModule,
    MatSelectModule,

  ],

})
export class ManterComp implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly empresaService = inject(EmpresaService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  user = signal<Usuario | null>(null); // Signal para o usuário atual (para edição)
  appUser = inject(APP_USER);
  allRoles = signal<string[]>([]);

  // Para o autocomplete de Empresa
  empresaTextSubject = new Subject<string>();
  empresaLoading = signal(false);
  empresas = signal(emptyPage<Empresa>()); // Armazena a lista de empresas
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'nomeFantasia', direction: 'asc' }));
  usuario = signal<Usuario | null>(null); // Use 'any' por enquanto, ou crie uma interface para Empresa

  usuarioEhSuperAdmin = this.appUser()?.roles.includes(UserRole.SUPER_ADMIN);

  ngOnInit(): void {
    this._creatForm();
    this._setupConditionalValidators();
    this._observerEmpresa();
    this._initForm();
    this._recuperarRoles();
  }

  private _creatForm() {
    this.form = this.fb.group({
      id: [null],
      username: ['', Validators.required],
      // password: ['', Validators.required], // Será condicionalmente required
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.email],
      enabled: [true],
      roles: [[], Validators.required], // Array para múltiplas seleções
      empresa: [null] // O valor será um objeto Empresa
    });
  }

  private _setupConditionalValidators() {
    const rolesControl = this.form.get('roles');
    const empresaControl = this.form.get('empresa');

    if (!rolesControl || !empresaControl) {
      return;
    }

    rolesControl.valueChanges.pipe(distinctUntilChanged()).subscribe(roles => {
      if (!roles) {
        return;
      }
      // Empresa é obrigatório se alguma role for selecionada, a menos que a ÚNICA role seja SUPER_ADMIN.
      const isRequired = !(roles.length === 0 || (roles.length === 1 && roles[0] === UserRole.SUPER_ADMIN));

      if (isRequired) {
        empresaControl.setValidators(Validators.required);
      } else {
        empresaControl.clearValidators();
      }
      empresaControl.updateValueAndValidity();
    });
  }

  private _initForm() {
    const tempEntity = this.route.snapshot.data['entity'] as Usuario;

    if (tempEntity) {
      this.usuario.set(tempEntity);
      this.form.patchValue({
        ...this.usuario(),
      }, { emitEvent: true });
    } else if (this.usuarioEhSuperAdmin) {
      this._buscarEmpresas();
    } else {
      this.form.patchValue({
        empresa: this.appUser()?.empresa,
      }, { emitEvent: true });
    }
  }

  private _buscarEmpresas() {
    this.empresaService.buscar("", this.page()).subscribe({
      next: (result) => {
        this.empresas.set(result);
      }
    });
  }

  private _observerEmpresa() {
    // Lógica para o autocomplete de Empresa
    this.empresaTextSubject.pipe(
      debounceDistinctUntilChanged(400),
      tap(() => this.empresaLoading.set(true)),
      switchMap(term => {
        if (term && typeof term === 'string' && term.length >= 2) { // Busca se tiver pelo menos 2 caracteres
          this.empresaLoading.set(true);
          return this.empresaService.buscar(term, this.page());
        } else {
          this.empresas.set(emptyPage<Empresa>());
          return [];
        }
      })
    ).subscribe((data: any) => {
      this.empresas.set(data);
      this.empresaLoading.set(false);
    });
  }

  private _recuperarRoles() {
    this.usuarioService.getRoles().subscribe({
      next: (result) => {
        this.allRoles.set(result);
      }
    });
  }

  // Função para exibir o nome da empresa no autocomplete
  displayFnEmpresa(empresa: Empresa): string {
    return empresa ? empresa.nomeFantasia : '';
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    this.spinner.showUntilCompleted(
      this.usuarioService.salvar(this.form.value as Partial<Usuario>)).subscribe({
        next: (result) => {
          this.usuario.set(result);
          this.notification.showSuccess('Operação realizada com sucesso.');
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError(err.message);
          console.error('Erro ao executar chamada ao backend:', err);
        }
      });

  }

}
