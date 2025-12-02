import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.html',
  styleUrls: ['./button.scss'],
})
export class Button {

  @Input() buttonText = '';
  @Input() buttonType: 'primary' | 'secondary' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  @Output() onClick = new EventEmitter<void>();
}
