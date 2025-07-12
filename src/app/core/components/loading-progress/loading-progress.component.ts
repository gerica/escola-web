import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingProgressService } from '../../services';

@Component({
  selector: 'app-loading-progress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
  @if(loadingProgress.isLoading()){
    <div class="loader-container" >
      <mat-progress-bar mode="indeterminate" />
    </div>
  }
  `,
  styles: [
    `
      .loader-container {
        position: fixed;
        width: 100%;
        z-index: 99;
      }
    `,
  ],
})
export class LoadingProgressComponent {
  loadingProgress = inject(LoadingProgressService);
}
