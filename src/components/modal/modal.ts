import {Component, Input, inject, computed} from '@angular/core';
import {ModalService} from '../../services/modal-service/modal-service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  standalone: true
})
export class Modal {
  @Input() modalId!: string;
  modalService = inject(ModalService);

  ngOnInit() {
    console.log('Modal initialized with ID:', this.modalId);
  }

  isThisModalOpen = computed(() => {
    const isOpen = this.modalService.currentModalId() === this.modalId;
    console.log('Modal check:', this.modalId, 'isOpen:', isOpen);
    return isOpen;
  });
}
