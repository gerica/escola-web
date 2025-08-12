import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NotificationService } from 'src/app/core/services';
import { ButtonsRowComponent } from 'src/app/shared/components';
import { ModalCardComponent } from "src/app/shared/components/modalcard";
import Contrato from 'src/app/shared/models/contrato';


@Component({
    templateUrl: './modal.html',
    styleUrls: ['./modal.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatDivider,        
        ModalCardComponent,
        ButtonsRowComponent,
        ModalCardComponent,
        MatDatepickerModule
    ],
})
export class AssinarContratoDialogComponent implements OnInit {
    public readonly dialogRef = inject<MatDialogRef<AssinarContratoDialogComponent, any>>(MatDialogRef);
    public readonly data = inject<Contrato>(MAT_DIALOG_DATA);
    private readonly fb = inject(FormBuilder);
    private readonly notification = inject(NotificationService);
    form!: FormGroup;


    ngOnInit(): void {
        this._createForm();
    }

    private _createForm() {
        this.form = this.fb.group({
            dataAssinatura: [new Date(), Validators.required],
        });
    }

    getTitulocabecalho() {
        return `Contrato: ${this.data?.numeroContrato} - ${this.data?.nomeCliente}`;
    }

    onSubmit(): void {
        if (!this.form.valid) {
            this.notification.showError('Informe todos os campos obrigatórios.');
            this.form.markAllAsTouched();
            this.form.markAsDirty();
            return;
        }
        this.dialogRef.close({ dataAssinatura: this.form.get('dataAssinatura')!.value });
    }

    onDismiss(): void {
        this.dialogRef.close();
    }

}
