import {Component, inject} from '@angular/core';

import {Router} from '@angular/router';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
})
export class Modal {
  private router = inject(Router);

  close() {
    return this.router.navigate([{ outlets: { modal: null } }]);
  }
}
