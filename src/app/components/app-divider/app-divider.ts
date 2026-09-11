import { Component } from '@angular/core';

@Component({
  selector: 'app-divider',
  templateUrl: './app-divider.html',
  styleUrl: './app-divider.css',
})
export class AppDivider {
  protected readonly dots = Array.from({ length: 17 });
}
