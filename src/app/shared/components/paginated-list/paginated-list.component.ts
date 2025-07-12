import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { Page } from 'src/app/core/models';
import { InnercardComponent } from '../innercard';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-paginated-list',
  templateUrl: './paginated-list.component.html',
  styleUrls: ['./paginated-list.component.scss'],
  standalone: true,
  imports: [
    InnercardComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatPaginatorModule,
  ]
})
export class PaginatedListComponent<T> implements OnInit, OnDestroy {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) data!: Page<T>;
  @Input({ required: true }) loading!: boolean;
  @Input({ required: true }) itemLabelKey!: string; // Key to display in the list item (e.g., 'nome', 'numero', 'descricao')
  @Input() secondaryItemLabelKey?: string; // Optional secondary key to display
  @Input() pageSizeOptions: number[] = [5, 10, 20, 50];
  @Input() itemClickable: boolean = false;
  @Input() showSearch: boolean = false; // New input to control search visibility
  @Input() searchPlaceholder: string = 'Pesquisar...'; // Optional placeholder for the search input

  @Output() itemClick = new EventEmitter<T>();
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() search = new EventEmitter<string>();

  searchControl = new FormControl('', { nonNullable: true }); // Form control for the search input  
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(600), // Wait 300ms after the last keystroke
        distinctUntilChanged(), // Only emit if the value has changed
        takeUntil(this.destroy$) // Unsubscribe when the component is destroyed
      )
      .subscribe(value => {
        this.search.emit(value);
      });
  }

  clearSearch(): void {
    this.searchControl.patchValue('');
    this.search.emit(''); // Emit an empty string when clearing
  }

  onItemClick(item: T) {
    if (this.itemClickable) {
      this.itemClick.emit(item);
    }
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit(event);
  }

  getItemLabel(item: T): string | undefined {
    const keys = this.itemLabelKey.split('.');
    let value: any = item;
    for (const key of keys) {
      if (value && typeof value === 'object' && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        return undefined; // Or some default value if the path doesn't exist
      }
    }
    return value;
  }

  getSecondaryItemLabel(item: T): string | undefined {
    if (!this.secondaryItemLabelKey) {
      return undefined;
    }
    const keys = this.secondaryItemLabelKey.split('.');
    let value: any = item;
    for (const key of keys) {
      if (value && typeof value === 'object' && value.hasOwnProperty(key)) {
        value = value[key];
      } else {
        return undefined; // Or some default value if the path doesn't exist
      }
    }
    return value;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}