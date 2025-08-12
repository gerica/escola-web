import { Injectable, signal } from '@angular/core';

import { minTime } from '../rxjs-operators';
import { Observable, of } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingSpinnerService {
  isLoading = signal(false);
  private loadingCount = 0;

  showUntilCompleted<T>(obs$: Observable<T>, loadingOffAuto = true): Observable<T> {
    return of(null).pipe(
      tap(() => this.loadingOn()),
      switchMap(() => obs$.pipe(minTime(0))),
      finalize(() => {
        if (loadingOffAuto) {
          this.loadingOff();
        }
      }),
    );
  }

  showUntilCompletedCascate<T>(obs$: Observable<T>): Observable<T> {
    this.loadingOn();
    this.loadingCount++;

    return obs$.pipe(
      finalize(() => {
        this.loadingCount--;
        if (this.loadingCount === 0) {
          this.loadingOff();
        }
      })
    );
  }

  loadingOn() {
    this.isLoading.set(true);
  }

  loadingOff() {
    this.isLoading.set(false);
  }
}
