import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
  imports:[CommonModule]
})
export class CardComponent {
  @Input() titulo = '';
  @Input() estiloCard: { [key: string]: string } = {};
  @Input() estiloCardTitulo: { [key: string]: string } = {};
  @Input() estiloCardConteudo: { [key: string]: string } = {};

}
