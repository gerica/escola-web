import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  styleUrls: ['./card.component.scss'],
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
  @Input() titulo = '';

  ngOnInit() {
    return;
  }
}
