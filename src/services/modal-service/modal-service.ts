import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  currentModalId = signal<string | null>(null);

  closeModal(modalId?: string) {
    // Only close if this is the currently open modal
    if (!modalId || this.currentModalId() === modalId) {
      this.currentModalId.set(null);
    }
  }

  toggleModal($event: any, modalId: string) {
    $event.stopPropagation();
    console.log('Toggling modal:', modalId);
    console.log('Current modal before:', this.currentModalId());

    if (this.currentModalId() === modalId) {
      this.currentModalId.set(null);
    } else {
      this.currentModalId.set(modalId);
    }

    console.log('Current modal after:', this.currentModalId());
  }
}
