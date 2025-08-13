import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmDialogComponent } from 'src/app/core/components';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Anexo, AnexoBase64 } from 'src/app/shared/models/anexo';
import Contrato, { ContratoSalvoModal } from 'src/app/shared/models/contrato';
import { AnexoService } from 'src/app/shared/services/anexo.service';
import { InnercardComponent } from "../../../../shared/components/innercard/innercard.component";
import { AssinarContratoDialogComponent } from './modal-assinar-contrato/modal';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { MSG_SUCESS } from 'src/app/shared/common/constants';


@Component({
  selector: 'app-contrato-manter-anexos-contrato',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../../pages.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    InnercardComponent,
    MatTableModule,
    MatTooltipModule

  ],

})
export class AnexosContratoComp implements OnInit {

  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly anexoService = inject(AnexoService);
  private readonly contratoService = inject(ContratoService);
  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly utilService = inject(UtilsService);

  @Input({ required: true }) contrato!: Contrato | null;
  @Input({ required: true }) inModal = false;
  @Output() contratoSalvo = new EventEmitter<any>();

  form!: FormGroup;
  anexos = signal<Anexo[]>([]);
  selectedFile: File | null = null;
  base64Content: string | null = null;
  loading = false;
  displayedColumns: string[] = ['nomeArquivo', 'acoes'];

  ngOnInit() {
    this._createForm();
    if (this.contrato) {
      this.loadAnexos();
    }
  }

  _createForm() {
    this.form = this.fb.group({
      anexo: ['']
    });
  }

  loadAnexos() {
    this.spinner.showUntilCompleted(this.anexoService.getAnexos(this.contrato!.id)).subscribe({
      next: (result) => {
        this.anexos.set(result);
      },
      error: (err) => {
        this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
        console.error('Erro ao recuperar dados:', err);
      }
    });
  }

  // Método atualizado para ler o arquivo como Base64
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        // A string Base64 completa, incluindo o prefixo "data:..."
        this.base64Content = reader.result as string;
        this.onUpload();
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null;
      this.base64Content = null;
    }
  }

  // Método de upload atualizado para enviar a string Base64
  onUpload() {
    if (this.selectedFile && this.base64Content) {
      this.loading = true;
      this.anexoService.uploadAnexo(this.base64Content, this.selectedFile.name, this.contrato!.id).subscribe({
        next: (novoAnexo) => {
          this.loading = false;
          this.selectedFile = null;
          this.anexos.update(values => {
            return [...values, novoAnexo];
          });
          this.notification.showSuccess('Anexo enviado com sucesso!');
        },
        error: (err) => {
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          this.loading = false;
          console.error('Erro ao fazer upload do anexo:', err);
        }
      });
    }
  }

  confirmarExclusao(entity: Anexo) {
    const dialogRef$ = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: `Realizar a exclusão do anexo: ${entity.nomeArquivo}`,
        message: 'Você tem certeza que deseja excluir este anexo?'
      }
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        this.onDelete(entity.id);
      }
    });
  }

  onDelete(anexoId: number) {
    this.spinner.showUntilCompleted(this.anexoService.deleteAnexo(anexoId))
      .subscribe({
        next: () => {
          this.anexos.update(values => {
            return values.filter(anexo => anexo.id !== anexoId);
          });
        },
        error: (err) => {
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          console.error('Erro ao deletar anexo:', err);
          // Adicionar lógica para mostrar erro ao usuário
        }
      });
  }

  baixarAnexo(entity: Anexo) {
    this.spinner.showUntilCompleted(this.anexoService.downloadAnexo(entity.id))
      .subscribe({
        next: (result) => {
          this._baixar(result);
        },
        error: (err) => {
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          console.error('Erro ao baixar anexo:', err);
          // Adicionar lógica para mostrar erro ao usuário
        }
      });
  }

  _baixar(anexo: AnexoBase64) {
    this.loading = false; // Oculta o spinner

    // O tipo do arquivo (MIME type) é necessário para o Blob.
    // Você pode inferir isso do nome do arquivo ou passar do backend.
    const mimeType = this.utilService.getMimeType(anexo.nomeArquivo);
    // const mimeType = "application/pdf";

    // Decodifica a string Base64 e cria um Blob
    const byteCharacters = atob(anexo.conteudoBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    // Cria um link e simula o clique para iniciar o download
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = anexo.nomeArquivo;
    link.click();

    window.URL.revokeObjectURL(link.href); // Libera o objeto URL


    // const blob = new Blob(base64String, { type: response.headers.get('Content-Type')! });
    // const url = window.URL.createObjectURL(blob);
    // const a = document.createElement('a');

    // a.href = url;
    // a.download = response.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || 'download';
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // window.URL.revokeObjectURL(url);

  }

  dialogAssinarContrato() {
    const dialogRef$ = this.dialog.open(AssinarContratoDialogComponent, {
      width: '550px',
      data: this.contrato
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        // this.salvar(result);
        this.spinner.showUntilCompleted(this.contratoService.salvar(this.contrato!.id,
          {
            ...this.contrato,
            dataAssinatura: result.dataAssinatura
          }
        ))
          .subscribe({
            next: _ => {

              this.notification.showSuccess(MSG_SUCESS);
              if (this.inModal) {
                const dadosSalvos: ContratoSalvoModal = {
                  mensagem: MSG_SUCESS,
                  sucesso: true

                };
                this.contratoSalvo.emit(dadosSalvos);
              } else {
                this.router.navigate(['/cliente/contrato']);
              }
            },
            error: (err) => {
              this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
              console.error('Erro ao recuperar dados:', err);
            }
          })
      }
    });
  }

}
