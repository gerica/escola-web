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
import { ClienteManterComp } from 'src/app/pages/cliente/manter/comp';
import { ButtonsRowComponent, InnercardComponent } from 'src/app/shared/components';
import { ModalCardComponent } from 'src/app/shared/components/modalcard';

export interface InscricaoDialogData {
    title: string,
}

@Component({
    templateUrl: './cliente.modal.html',
    styleUrls: ['./cliente.modal.scss'],
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
        ModalCardComponent,
        ButtonsRowComponent,
        ClienteManterComp
    ],
})
export class ClienteDialogComponent implements OnInit {
    public readonly dialogRef = inject<MatDialogRef<ClienteDialogComponent, boolean>>(MatDialogRef);
    public readonly data = inject<InscricaoDialogData>(MAT_DIALOG_DATA);
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
        this.dialogRef.close(true);
    }

    onDismiss(): void {
        this.dialogRef.close(false);
    }

}
