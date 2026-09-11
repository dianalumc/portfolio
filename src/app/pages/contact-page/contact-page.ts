import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AppButton } from '../../components/app-button/app-button';

@Component({
  imports: [FormsModule, RouterLink, AppButton],
  selector: 'app-contact-page',
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage {
  protected sent = false;
  protected submit() { this.sent = true; }
}
