import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { InnercardComponent } from 'src/app/shared/components';
import { EditorComponent } from 'src/app/shared/components/editor/editor.component';

@Component({
  selector: 'app-email-manter',
  templateUrl: './comp.html',
  styleUrls: ['../comp.scss'],
  imports: [
    // CommonModule,    
    // InnercardComponent,    
    // MatButtonModule,
    InnercardComponent,
    MatTabsModule,
    MatIconModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    InnercardComponent,
    EditorComponent,
    MatButtonModule
  ]

})
export class EmailComp implements OnInit {

  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;

  ngOnInit(): void {
    this._createForm();
  }

  private _createForm() {
    this.form = this.fb.group({
      textoNofificacao: new FormControl('', [Validators.required]),
    });
  }

  submit() {
    console.log('aqui');
  }

}
