import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modalcard',
  styleUrls: ['./modalcard.scss'],
  templateUrl: './modalcard.html',
  imports:[CommonModule]
})
export class ModalCardComponent {
  @Input() titulo = '';
  @Input() estiloCard: { [key: string]: string } = {};
  @Input() estiloCardTitulo: { [key: string]: string } = {};
  @Input() estiloCardConteudo: { [key: string]: string } = {};

   @Output() fechar = new EventEmitter<void>(); // Este evento será emitido quando o botão for clicado

}
