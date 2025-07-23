import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { emptyPage, firstPageAndSort, PageRequest } from 'src/app/core/models';
import { LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { Usuario } from 'src/app/shared/models/usuario';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { InnercardComponent } from "../../../shared/components/innercard/innercard.component";
import { UsuarioDetalheDialog } from './detalhe';

@Component({
  selector: 'app-cliente-list',
  templateUrl: './comp.html',
  styleUrls: ['./comp.scss', '../../pages.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatTableModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    InnercardComponent,
  ]
})
export class ListComp implements OnInit, OnDestroy {

  // private readonly router = inject(Router);  
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly dialog = inject(MatDialog);

  usuarios = signal(emptyPage<Usuario>());
  ctrlFiltro = new FormControl('', { nonNullable: true });
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'username', direction: 'asc' }));
  displayedColumns: string[] = ['username', 'firstname', 'empresa', 'email', 'acoes'];
  // Subject to emit a signal when the component is destroyed, for RxJS cleanup
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.buscarUsuarios();
    // Set up debouncing for the filter control
    this.ctrlFiltro.valueChanges.pipe(
      debounceTime(500), // Wait for 300ms after the last keystroke
      distinctUntilChanged(), // Only emit when the current value is different from the last
      takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
    ).subscribe(() => {
      this.buscarUsuarios(); // Perform the search after debounce time
    });
  }

  ngOnDestroy(): void {
    // Emit a signal to complete all subscriptions that use takeUntil(this.destroy$)
    this.destroy$.next();
    this.destroy$.complete();
  }

  buscarUsuarios() {
    this.spinner
      .showUntilCompleted(this.usuarioService.buscar(this.ctrlFiltro.value, this.page()))
      .subscribe({
        next: (result) => {
          this.usuarios.set(result);
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError('Erro no backend. ' + err.message);
          console.error('Erro ao recuperar dependentes:', err);
        }
      });
  }

  sortData(sort: Sort) {
    this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    this.spinner
      .showUntilCompleted(this.usuarioService.buscar(this.ctrlFiltro.value, this.page()))
      .subscribe({
        next: (result) => {
          this.usuarios.set(result);
        },
        error: (err) => { // <--- Add error handling
          this.notification.showError('Erro no backend. ' + err.message);
          console.error('Erro ao recuperar dependentes:', err);
        }
      });
  }

  visualizar(entity: Usuario) {
    this.dialog.open(UsuarioDetalheDialog, {
      width: '550px', data: {
        ...entity,
      }
    });
  }
}
