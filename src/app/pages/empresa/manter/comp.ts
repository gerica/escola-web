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
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { APP_USER, UserRole } from 'src/app/core/models';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Empresa } from 'src/app/shared/models/empresa';
import { EmpresaService } from 'src/app/shared/services/empresa.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { ListComp } from '../empresa-usuario/comp';
import { MSG_SUCESS } from 'src/app/shared/common/constants';


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
  private readonly sanitizer = inject(DomSanitizer);
  private readonly fb = inject(FormBuilder);

  appUser = inject(APP_USER);
  usuarioEhSuperAdmin = this.appUser()?.roles.includes(UserRole.SUPER_ADMIN) || false;

  form!: FormGroup;
  empresa = signal<Empresa | null>(null); // Use 'any' por enquanto, ou crie uma interface para Empresa

  // Propriedades para lidar com a imagem
  logoPreviewUrl = signal<SafeUrl | null>(null);
  base64Logo = signal<string>("");
  logoMimeType = signal<string>("");

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

      // Se a empresa já tiver uma logo, exibe a pré-visualização
      if (this.empresa()?.logo) {
        const base64WithPrefix = `data:${this.empresa()!.logo.mimeType};base64,${this.empresa()!.logo.conteudoBase64}`;
        this.logoPreviewUrl.set(this.sanitizer.bypassSecurityTrustUrl(base64WithPrefix));
        this.logoMimeType.set(this.empresa()!.logo.mimeType);
        this.base64Logo.set(this.empresa()!.logo.conteudoBase64);
      }
    }
  }

  // --- Nova função para manipular a seleção de arquivo ---
  // --- Nova função para manipular a seleção de arquivo ---
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      const reader = new FileReader();

      // Armazena o MIME type do arquivo
      this.logoMimeType.set(file.type);

      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1000; // Define o tamanho máximo de um lado (em pixels) para o redimensionamento

          let width = image.width;
          let height = image.height;

          // Redimensiona a imagem se for maior que o limite
          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(image, 0, 0, width, height);

          // Converte para Base64 com qualidade JPEG de 80% (ajustável)
          // Usa o MIME type original do arquivo
          const dataUrl = canvas.toDataURL(this.logoMimeType(), 0.8);

          // Atualiza a pré-visualização usando o DomSanitizer
          this.logoPreviewUrl.set(this.sanitizer.bypassSecurityTrustUrl(dataUrl));

          // Armazena a string Base64 para envio
          this.base64Logo.set(dataUrl);
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    // Cria o objeto para salvar, adicionando a string Base64 da logo
    const empresaParaSalvar = {
      ...this.form.value as Partial<Empresa>,
      logo: {
        conteudoBase64: this.base64Logo(),
        mimeType: this.logoMimeType()
      }
    } as Partial<Empresa>;


    this.spinner.showUntilCompleted(
      this.empresaService.salvar(empresaParaSalvar)).subscribe({
        next: _ => {
          // this.empresa.set(result);
          this.notification.showSuccess(MSG_SUCESS);
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          console.error('Erro ao recuperar dados:', err);
        }
      });
  }


}
