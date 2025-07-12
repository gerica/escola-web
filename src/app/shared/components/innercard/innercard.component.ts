import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-innercard',
  styleUrls: ['./innercard.scss'],
  templateUrl: './innercard.html',
  imports:[CommonModule]
})
export class InnercardComponent {
  @Input() titulo = '';
  @Input() estiloCard: { [key: string]: string } = {};
  @Input() estiloCardTitulo: { [key: string]: string } = {};
  @Input() estiloCardConteudo: { [key: string]: string } = {};
}
