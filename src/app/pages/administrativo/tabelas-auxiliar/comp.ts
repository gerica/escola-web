import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { CargoManterComp } from './cargo/comp';


@Component({
  selector: 'app-tabelas-auxiliares-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../pages.component.scss'],
  imports: [
    CommonModule,
    InnercardComponent,
    MatTabsModule,
    MatIconModule,
    CargoManterComp
  ],
})
export class AuxiliarManterComp { }
