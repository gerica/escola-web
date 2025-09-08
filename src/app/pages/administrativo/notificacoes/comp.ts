import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { CardComponent } from 'src/app/shared/components';
import { WhatsAppComp } from './whatsapp/comp';
import { EmailComp } from './email/comp';

@Component({
  selector: 'app-nofificacao-manter',
  templateUrl: './comp.html',
  styleUrls: ['../../pages.component.scss'],
  imports: [
    // CommonModule,    
    // InnercardComponent,    
    // MatButtonModule,
    CardComponent,
    MatTabsModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    WhatsAppComp,
    EmailComp,
  ]

})
export class NotificacaoManterComp implements OnInit {

  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    this.form = this.fb.group({
      notificacaoAutomatica: [false],
    });
  }

}
