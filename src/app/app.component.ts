import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingSpinnerComponent } from "./core/components/loading-spinner/loading-spinner.component";
import { LoadingProgressComponent } from "./core/components/loading-progress/loading-progress.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterOutlet, LoadingSpinnerComponent, LoadingProgressComponent],

})
export class AppComponent {
  title = 'escola-web';
}
