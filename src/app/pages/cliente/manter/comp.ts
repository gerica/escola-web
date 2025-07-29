import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { BehaviorSubject, finalize, switchMap, tap } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { debounceDistinctUntilChanged, minTime } from 'src/app/core/rxjs-operators';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Cidade } from 'src/app/shared/models/cidade';
import Cliente from 'src/app/shared/models/cliente';
import { StatusCliente, StatusClienteLabelMapping } from 'src/app/shared/models/status-cliente.enum';
import { ClienteService } from 'src/app/shared/services/cliente.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { ContatoComp } from '../contato/comp';
import { DependenteComp } from '../depentente/comp';

@Component({
  selector: 'app-contrato-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    InnercardComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    NgxMaskDirective,
    MatProgressSpinnerModule,
    MatSelectModule,
    ContatoComp,
    DependenteComp,

  ], 
})
export class ManterComp implements OnInit {
  
  private readonly route = inject(ActivatedRoute);
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly clienteService = inject(ClienteService);
  private readonly utilService = inject(UtilsService);
  private readonly fb = inject(FormBuilder);

  form!: UntypedFormGroup;
  cliente = signal<Cliente | null>(null);

  statusCliente = Object.values(StatusCliente);
  statusClienteLabelMapping = StatusClienteLabelMapping;

  srvTextSubject = new BehaviorSubject<string>('');
  cidades = signal(emptyPage<Cidade>());
  srvLoading = signal(false);
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'descricao', direction: 'asc' }));

  ngOnInit(): void {
    this._createForm();
    this._initForm();
    this._observarCidades();
  }

  private _createForm() {
    this.form = this.fb.group({
      nome: new UntypedFormControl('', [Validators.required]),
      dataNascimento: new UntypedFormControl('', [Validators.required]),
      cidade: new UntypedFormControl('', [Validators.required]),
      docCPF: new UntypedFormControl('', Validators.required),
      docRG: new UntypedFormControl('', [Validators.required]),
      endereco: new UntypedFormControl('', [Validators.required]),
      email: new UntypedFormControl('', [Validators.email, Validators.required]),
      statusCliente: new FormControl<string | null>(StatusCliente.ATIVO, { validators: [Validators.required] }),
      
      profissao: new UntypedFormControl(''),
      localTrabalho: new UntypedFormControl(''),
    });
  }

  private _initForm() {
    const tempEntity = this.route.snapshot.data['entity'] as Cliente;

    if (tempEntity) {
      this.cliente.set(tempEntity);
      this.form.patchValue({
        ...this.cliente(),
        // cidade: { descricao: this.cliente()?.cidadeDesc, uf: this.cliente()?.uf, codigoCidade: this.cliente()?.codigoCidade }
      }, { emitEvent: true });
    }
  }

  private _observarCidades() {
    this.srvTextSubject.asObservable()
      .pipe(
        debounceDistinctUntilChanged(400),
        tap(() => this.srvLoading.set(true)),
        switchMap((text) => {
          return this.utilService.recuperarPorFiltro(text, this.page()).pipe(
            minTime(700),
            finalize(() => this.srvLoading.set(false))
          );
        })
      ).subscribe({
        next: (result) => this.cidades.set(result),
        error: (err) => console.log(err),
      });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    this.spinner.showUntilCompleted(
      this.clienteService.salvar(this.cliente()?.id, this.form.value as Partial<Cliente>)).subscribe({
        next: (result) => {
          this.cliente.set(result);
          this.notification.showSuccess('Operação realizada com sucesso.');
        }
      });
  }

  displayFnCidade(cidade: Cidade): string {
    return cidade && `${cidade.descricao} - ${cidade.uf}`;
  }

}
