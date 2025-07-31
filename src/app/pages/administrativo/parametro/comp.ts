import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { InnercardComponent } from 'src/app/shared/components';
import { ContratoParamManterComp } from './contrato/comp';


@Component({
  selector: 'app-contrato-manter',
  templateUrl: './comp.html',
  styleUrls: ['../../pages.component.scss'],
  imports: [
    // CommonModule,    
    InnercardComponent,    
    // MatButtonModule,
    MatTabsModule,
    MatIconModule,    
    ContratoParamManterComp
  ]
  
})
export class ParametroManterComp {


}
