import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { firstPageAndSort, PageRequest } from 'src/app/core/models';
import { ContratoManterComp } from 'src/app/pages/cliente/contrato/manter/comp';
import { ManterContratoComp } from 'src/app/pages/cliente/contrato/modeloContrato/comp';
import { ButtonsRowComponent, CardComponent, InnercardComponent } from 'src/app/shared/components';
import { ModalCardComponent } from 'src/app/shared/components/modalcard/modalcard.component';
import Contrato from 'src/app/shared/models/contrato';
import { Matricula } from 'src/app/shared/models/matricula';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';

export interface ContratoDialogInput {
    matricula: Matricula,
    contrato: Contrato;
}

export interface ContratoDialogResult {
    salvar: boolean;
    contrato: Contrato | undefined;
}

@Component({
    templateUrl: './contrato.modal.html',
    styleUrls: ['./contrato.modal.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatDivider,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        ButtonsRowComponent,
        ContratoManterComp,
        ModalCardComponent,
    ],
})
export class ContratoDialogComponent {
    public readonly dialogRef = inject<MatDialogRef<ContratoDialogComponent, ContratoDialogResult>>(MatDialogRef);
    public readonly data = inject<ContratoDialogInput>(MAT_DIALOG_DATA);

    onDismiss(): void {
        this.dialogRef.close();
    }
}
