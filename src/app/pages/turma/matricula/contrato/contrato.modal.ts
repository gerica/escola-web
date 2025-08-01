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
import { ButtonsRowComponent, InnercardComponent } from 'src/app/shared/components';
import { Matricula, MatriculaDialogResult } from 'src/app/shared/models/matricula';
import { MatriculaDialogData } from '../modal-matricula/matricula.modal';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';
import { ManterContratoComp } from 'src/app/pages/cliente/contrato/modeloContrato/comp';

export interface InscricaoDialogData {
    title: string,
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
        InnercardComponent,
        ButtonsRowComponent,
        ManterContratoComp,
        PrimeiraMaiusculaPipe
    ],
})
export class ContratoDialogComponent implements OnInit {
    public readonly dialogRef = inject<MatDialogRef<ContratoDialogComponent, MatriculaDialogResult>>(MatDialogRef);
    public readonly data = inject<Matricula>(MAT_DIALOG_DATA);
    private readonly fb = inject(FormBuilder);


    form!: FormGroup;
    pageSize = 10;
    page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'nome', direction: 'asc' }));

    ngOnInit(): void {
        this._createForm();
    }

    private _createForm() {
        this.form = this.fb.group({
            cliente: new FormControl(null, [Validators.required]),

        });
    }

    onSubmit(): void {
        this.dialogRef.close({ salvar: false, matricula: undefined });
    }

    onDismiss(): void {
        this.dialogRef.close();
    }

}
