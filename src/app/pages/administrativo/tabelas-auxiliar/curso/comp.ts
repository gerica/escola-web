import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { InnercardComponent } from 'src/app/shared/components';
import { Cargo } from 'src/app/shared/models/cargo';
import { Curso } from 'src/app/shared/models/curso';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';
import { AdministrativoService } from 'src/app/shared/services/admin.service';


@Component({
  selector: 'app-tabela-auxiliar-curso-manter',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../../pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatTableModule,
    MatPaginatorModule,
    PrimeiraMaiusculaPipe,
    MatSortModule,
    InnercardComponent,
  ],
})
export class CursoManterComp implements OnInit {

  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly admService = inject(AdministrativoService);
  private readonly fb = inject(FormBuilder);

  form!: FormGroup;
  cursos = signal(emptyPage<Curso>());

  ctrlFiltro = new FormControl('', { nonNullable: true });
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'nome', direction: 'asc' }));
  displayedColumns: string[] = ['nome', 'descricao','duracao','categoria','valorMensalidade', 'ativo', 'acoes'];


  ngOnInit(): void {
    this._createForm();
    this.buscar();
  }

  private _createForm() {
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.required],
      descricao: [''],
      duracao: ['', Validators.required],
      categoria: ['', Validators.required],
      valorMensalidade: ['', Validators.required],
      ativo: [true],
    });
  }

  novo() {
    this.form.reset();
    this.form.patchValue({ ativo: true }, { emitEvent: true });
  }

  preEditar(entity: Cargo) {
    this.form.patchValue({ ...entity }, { emitEvent: true });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.notification.showError('Informe todos os campos obrigatórios.');
      this.form.markAllAsTouched();
      this.form.markAsDirty();
      return;
    }

    this.spinner.showUntilCompletedCascate(
      this.admService.salvarCurso(this.form.value as Partial<Cargo>)
    ).pipe(
      switchMap(_ => {
        return this.admService.buscarCurso(this.ctrlFiltro.value, this.page());
      }),
      catchError(err => {
        this.notification.showError(err.message);
        console.error('Erro ao executar chamada ao backend:', err);
        return EMPTY;
      })
    ).subscribe({
      next: (result) => {
        this.cursos.set(result);
        this.notification.showSuccess('Operação realizada com sucesso.');
      }, error: (err) => {
        this.notification.showError(err.message);
        console.error('Erro ao recuperar dependentes:', err);
      }
    });

    this.novo();
  }


  buscar() {
    this.spinner
      .showUntilCompleted(this.admService.buscarCurso(this.ctrlFiltro.value, this.page()))
      .subscribe({
        next: (result) => {
          this.cursos.set(result);
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError(err.message);
          console.error('Erro ao recuperar dependentes:', err);
        }
      });
  }

  sortData(sort: Sort) {
    this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    this.buscar();
  }

}
