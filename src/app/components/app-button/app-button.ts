import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ButtonModule],
  selector: 'app-button',
  templateUrl: './app-button.html',
  styleUrl: './app-button.css',
})
export class AppButton {
  @Input() label = '';
  @Input() icon = '';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
  @Input() variant = 'solid-button';
  @Output() pressed = new EventEmitter<void>();
}
