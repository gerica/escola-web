import { Location } from '@angular/common';
import { Directive, HostListener, inject } from '@angular/core';

@Directive({
  selector: '[appBackButton]',
})
export class BackButtonDirective {
  private location = inject(Location);

  @HostListener('click') onClick(): void {
    this.location.back();
  }
}
