import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingProgressService {
  private _isLoading = signal(false);
  isLoading = this._isLoading.asReadonly();

  loadingOn() {
    this._isLoading.set(true);
  }

  loadingOff() {
    this._isLoading.set(false);
  }
}
