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
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/core/components';
import { emptyPage, firstPageAndSort, PageRequest, User } from 'src/app/core/models';
import { AuthService, LoadingSpinnerService, NotificationService } from 'src/app/core/services';
import { KEY_SUPER_ADMIN_TOKEN, KEY_SUPER_ADMIN_USER } from 'src/app/shared/common/constants';
import { ActionsComponent } from 'src/app/shared/components/actions/actions.component';
import { Usuario } from 'src/app/shared/models/usuario';
import { PrimeiraMaiusculaPipe } from 'src/app/shared/pipe/primeira-maiuscula.pipe';
import { UsuarioService } from 'src/app/shared/services/usuario.service';
import { UtilsService } from 'src/app/shared/services/utils.service';
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
    PrimeiraMaiusculaPipe,
    ActionsComponent
  ]
})
export class ListComp implements OnInit, OnDestroy {

  // private readonly router = inject(Router);  
  private readonly notification = inject(NotificationService);
  private readonly spinner = inject(LoadingSpinnerService);
  private readonly usuarioService = inject(UsuarioService);
  private readonly authService = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly utilService = inject(UtilsService);  

  usuarios = signal(emptyPage<Usuario>());
  ctrlFiltro = new FormControl('', { nonNullable: true });
  pageSize = 10;
  page = signal<PageRequest>(firstPageAndSort(this.pageSize, { property: 'username', direction: 'asc' }));
  displayedColumns: string[] = ['username', 'firstname', 'empresa', 'roles', 'email', 'acoes'];
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
          this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
          console.error('Erro ao recuperar dados:', err);
        }
      });
  }

  sortData(sort: Sort) {
    if (sort.direction === "") {
      this.page().sorts = [];
    } else {
      this.page().sorts = [{ property: sort.active, direction: sort.direction }];
    }
    this.buscarUsuarios();
  }

  visualizar(entity: Usuario) {
    this.dialog.open(UsuarioDetalheDialog, {
      width: '550px', data: {
        ...entity,
      }
    });
  }

  impersonate(user: User): void {
    const dialogRef$ = this.dialog.open(ConfirmDialogComponent, {
      width: '550px',
      data: {
        title: `Realizar Impersonação como ${user.username}`,
        message: 'Você tem certeza que deseja acessar como este usuário?'
      },
    });

    dialogRef$.afterClosed().subscribe(result => {
      if (result) {
        this.spinner
          .showUntilCompleted(this.authService.impersonate(user.id))
          .subscribe({
            next: () => {
              this.notification.showSuccess('Sessão de suporte inicializado com sucesso!');
              this.authService.carregarMenu();
              // this.applyImpersonationTheme();
              this.router.navigate(['/']); // Redireciona para a página principal (editor)
            },
            error: (err) => {
              this.notification.showError(err.message);
              localStorage.removeItem(KEY_SUPER_ADMIN_TOKEN);
              localStorage.removeItem(KEY_SUPER_ADMIN_USER);
              console.error('Falha na impersonação:', err);
            },
          });
      }
    });
  }


  // Function to pass to the child component
  download(type: string) {
     this.spinner.showUntilCompleted(this.usuarioService.downloadFile(type, this.ctrlFiltro.value))
       .subscribe({
         next: (result) => {
           this.utilService.downloadFile(result);
         },
         error: (err) => {
           this.notification.showError('Erro: ' + (err.message || 'Erro desconhecido.'));
           console.error('Erro ao baixar anexo:', err);
         }
       }
       );
   }
 
  

}
