import {Component, input, output, model, signal} from '@angular/core';

export interface ModalOption {
  label: string;
  icon: string;
  action: (event: Event) => void;
}

@Component({
  selector: 'app-side-modal',
  imports: [],
  templateUrl: './side-modal.html',
  styleUrl: './side-modal.scss',
})
export class SideModal {
  isOpen = signal<boolean>(false);

  modalOptions = input<ModalOption[]>([]);
  onClose = output<void>();

  toggleModal() {
    this.isOpen.update(value => !value);
  }

  close() {
    this.isOpen.set(false);
    this.onClose.emit();
  }

  onModalClick(event: Event) {
    event.stopPropagation();
  }
}
