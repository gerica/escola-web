import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { debounceDistinctUntilChanged, minTime } from 'src/app/core/rxjs-operators';
import { ButtonsRowComponent, InnercardComponent } from 'src/app/shared/components';
import Cliente from 'src/app/shared/models/cliente';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { ClienteDialogComponent } from './cliente.modal';

export interface InscricaoDialogData {
    title: string,
}

@Component({
    templateUrl: './inscricao.modal.html',
    styleUrls: ['./inscricao.modal.scss'],
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
        ButtonsRowComponent
    ],
})
export class IncricaoDialogComponent implements OnInit {
    public readonly dialogRef = inject<MatDialogRef<IncricaoDialogComponent, boolean>>(MatDialogRef);
    public readonly data = inject<InscricaoDialogData>(MAT_DIALOG_DATA);
    private readonly fb = inject(FormBuilder);
    private readonly clienteService = inject(ClienteService);
    private readonly dialog = inject(MatDialog);

    srvTextSubject = new BehaviorSubject<string>('');
    clientes = signal(emptyPage<Cliente>());
    srvLoading = signal(false);
    form!: FormGroup;
    pageSize = 10;
    page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'nome', direction: 'asc' }));

    ngOnInit(): void {
        this._createForm();
        this._observarClientes()
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

    displayCliente = (item: Cliente) => (!!item && `${item.nome}`) || '';

    private _observarClientes() {
        this.srvTextSubject.asObservable()
            .pipe(
                debounceDistinctUntilChanged(400),
                tap(() => this.srvLoading.set(true)),
                switchMap((text) => {
                    const clientes$ = this.clienteService.buscarAtivos(text, this.page());

                    return clientes$.pipe(
                        minTime(700),
                        finalize(() => this.srvLoading.set(false))
                    );
                })
            ).subscribe({
                next: (result) => {
                    this.clientes.set(result);
                }
            });
    }

    novoClienteModal() {
        const dialogRef$ = this.dialog.open(ClienteDialogComponent, {
            width: '750px',
            // height: '400px',
            data: {
                title: `Realizar cadastro de cliente`,
            }
        });
    }
}
