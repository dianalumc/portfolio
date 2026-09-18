import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [ButtonModule, RouterLink],
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
  @Input() routerLink: string | any[] | null = null;
  @Output() pressed = new EventEmitter<void>();
}
