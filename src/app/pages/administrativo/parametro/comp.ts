import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { CardComponent } from 'src/app/shared/components';
import { ContratoParamManterComp } from './contrato/comp';
import { PixComp } from './pix/comp';


@Component({
  selector: 'app-contrato-manter',
  templateUrl: './comp.html',
  styleUrls: ['../../pages.component.scss'],
  imports: [    
    CardComponent,        
    MatTabsModule,
    MatIconModule,    
    ContratoParamManterComp,
    PixComp, 
  ]
  
})
export class ParametroManterComp {


}
