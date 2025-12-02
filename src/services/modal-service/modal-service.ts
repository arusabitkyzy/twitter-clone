import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  isOpen = signal<boolean>(false)

  constructor() {}

  closeModal() {
    return this.isOpen.set(true)
  }

  openModal() {
    return this.isOpen.set(true)
  }
}
