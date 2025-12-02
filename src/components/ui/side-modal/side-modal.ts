import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UserProfile} from '../../../models/User';

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
  @Input() isOpen = false
  @Input() currentUser: UserProfile | null = null;
  @Input() modalOptions: ModalOption[] = []
  @Output() isOpenChange = new EventEmitter<boolean>();

  close() {
    this.isOpen = false
    this.isOpenChange.emit(this.isOpen);
  }
}
