import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { ButtonsRowComponent, InnercardComponent } from 'src/app/shared/components';
import Cliente from 'src/app/shared/models/cliente';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';


@Component({
  selector: 'cliente-detalhe-dialog',
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
export class ClienteDetalheDialog {
  public readonly data: Cliente = inject(MAT_DIALOG_DATA);
}
