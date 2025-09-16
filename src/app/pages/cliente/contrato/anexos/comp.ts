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
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'src/app/core/components';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { MSG_SUCESS } from 'src/app/shared/common/constants';
import { Anexo } from 'src/app/shared/models/anexo';
import Contrato, { ContratoSalvoModal } from 'src/app/shared/models/contrato';
import { AnexoService } from 'src/app/shared/services/anexo.service';
import { ContratoService } from 'src/app/shared/services/contrato.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../../shared/components/innercard/innercard.component";
import { AssinarContratoDialogComponent } from './modal-assinar-contrato/modal';


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
          if (this.anexos().length === 0) {
            this._salvarContrato(null);
          }
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
          this.utilService.downloadFile(result);
        },
        error: (err) => {
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          console.error('Erro ao baixar anexo:', err);
          // Adicionar lógica para mostrar erro ao usuário
        }
      });
  }


  dialogAssinarContrato() {
    const dialogRef$ = this.dialog.open(AssinarContratoDialogComponent, {
      width: '550px',
      data: this.contrato
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        // this.salvar(result);
        this._salvarContrato(result.dataAssinatura);
      }
    });
  }

  private _salvarContrato(dataAssinatura: Date | null) {
    this.spinner.showUntilCompleted(this.contratoService.salvar(this.contrato!.id,
      {
        ...this.contrato,
        dataAssinatura: dataAssinatura
      }
    ))
      .subscribe({
        next: result => {
          this.notification.showSuccess(MSG_SUCESS);
          if (this.inModal) {
            const dadosSalvos: ContratoSalvoModal = {
              mensagem: MSG_SUCESS,
              sucesso: true

            };
            this.contratoSalvo.emit(dadosSalvos);
          } else {
            this._recuperarContrato()
            // this.router.navigate(['/cliente/contrato']);
          }
        },
        error: (err) => {
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          console.error('Erro ao recuperar dados:', err);
        }
      })
  }

  private _recuperarContrato() {
    if (this.contrato) {
      this.spinner.showUntilCompleted(this.contratoService.recuperarPorId(this.contrato.id)).subscribe({
        next: result => {
          this.contrato = result
        },
        error: (err) => {
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          console.error('Erro ao recuperar dados:', err);
        }
      });
    }
  }

}
