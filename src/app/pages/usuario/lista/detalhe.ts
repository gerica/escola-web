import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ButtonsRowComponent, InnercardComponent } from 'src/app/shared/components';
import { StatusClienteLabelMapping } from 'src/app/shared/models/status-cliente.enum';
import { Usuario } from 'src/app/shared/models/usuario';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';


@Component({
  selector: 'usuario-detalhe-dialog',
  templateUrl: './detalhe.html',
  styleUrl: '../../entity-detalhe.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatDialogModule,
    PrimeiraMaiusculaPipe,
    ButtonsRowComponent,
    InnercardComponent
  ]
})
export class UsuarioDetalheDialog {
  public readonly data: Usuario = inject(MAT_DIALOG_DATA);
  statusClienteLabelMapping = StatusClienteLabelMapping;
}
