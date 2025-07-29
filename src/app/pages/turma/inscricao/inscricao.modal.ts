import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BehaviorSubject, finalize, map, switchMap, tap } from 'rxjs';
import { emptyPage, firstPageAndSort, Page, PageRequest } from 'src/app/core/models';
import { debounceDistinctUntilChanged, minTime } from 'src/app/core/rxjs-operators';
import { ButtonsRowComponent, InnercardComponent } from 'src/app/shared/components';
import Cliente from 'src/app/shared/models/cliente';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { ClienteDialogComponent } from './cliente.modal';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export interface InscricaoDialogData {
    title: string,
}

export interface AutocompleteItem {
    id: number;
    type: 'CLIENT' | 'DEPENDENT';
    name: string;
    parentId?: number; // If it's a dependent, store the client's ID
    originalClient?: any; // You might want to pass the whole client object if needed
    originalDependent?: any; // Or the whole dependent object
    displayHtml: SafeHtml; // The pre-formatted HTML for display
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
    private readonly sanitizer = inject(DomSanitizer);

    srvTextSubject = new BehaviorSubject<string>('');
    itemsToDisplay = signal(emptyPage<AutocompleteItem>());

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
            aluno: new FormControl(null, [Validators.required]),

        });
    }

    onSubmit(): void {
        console.log(this.form.value);
        // this.dialogRef.close(true);
    }

    onDismiss(): void {
        this.dialogRef.close(false);
    }

    /**
    * Formats the display of a Cliente object in the mat-autocomplete.
    * If the client has dependents, their names will be listed nested under the client's name.
    */
    displayItem = (item: AutocompleteItem | null): string => {
        return (!!item && `${item.name}`) || ''; // When selected, just show the name in the input
    };

    private _observarClientes() {
        this.srvTextSubject.asObservable()
            .pipe(
                debounceDistinctUntilChanged(400),
                tap(() => this.srvLoading.set(true)),
                switchMap((text) => {
                    // Call your service to get the Cliente data
                    const clientsObservable = this.clienteService.buscarAtivosComDependentes(text, this.page());

                    return clientsObservable.pipe(
                        // Transform the Cliente data into a flat list of AutocompleteItems
                        map((pageOfClients: Page<Cliente>) => {
                            const items: AutocompleteItem[] = [];
                            pageOfClients.content.forEach(client => {
                                // Add the client itself as an AutocompleteItem
                                items.push({
                                    id: client.id,
                                    type: 'CLIENT',
                                    name: client.nome,
                                    originalClient: client, // Keep a reference to the original client object
                                    // Sanitize the HTML here
                                    displayHtml: this.sanitizer.bypassSecurityTrustHtml(`<strong>${client.nome}</strong>`)
                                });

                                // Add each dependent as an AutocompleteItem, associated with the client
                                if (client.dependentes && client.dependentes.length > 0) {
                                    client.dependentes.forEach(dependent => {
                                        items.push({
                                            id: dependent.id,
                                            type: 'DEPENDENT',
                                            name: dependent.nome,
                                            parentId: client.id,
                                            originalDependent: dependent, // Keep a reference to the original dependent object
                                            displayHtml: this.sanitizer.bypassSecurityTrustHtml(`<span style="padding-left: 20px;">&mdash; ${dependent.nome} (${dependent.parentescoDescricao})</span>`)
                                        });
                                    });
                                }
                            });

                            // Create a new Page object for AutocompleteItem
                            return {
                                ...pageOfClients, // Copy pagination info
                                content: items    // Set the transformed content
                            } as Page<AutocompleteItem>;
                        }),
                        minTime(700),
                        finalize(() => this.srvLoading.set(false))
                    );
                })
            ).subscribe({
                next: (result) => {
                    this.itemsToDisplay.set(result); // Update the signal with the new items
                }
            });
    }

    novoAlunoModal() {
        const dialogRef$ = this.dialog.open(ClienteDialogComponent, {
            width: '750px',
            // height: '400px',
            data: {
                title: `Realizar cadastro de aluno`,
            }
        });
    }

    // Method to handle selection from the autocomplete
    onItemSelected(event: MatAutocompleteSelectedEvent): void {
        const selectedItem: AutocompleteItem = event.option.value;
        if (selectedItem.type === 'CLIENT') {
            // Do something with the selected client
        } else if (selectedItem.type === 'DEPENDENT') {
            // Do something with the selected dependent
        }
        // You can also emit an event or update a form control based on the selection
    }
}
