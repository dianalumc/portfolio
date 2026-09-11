import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-tag',
  templateUrl: './project-tag.html',
  styleUrl: './project-tag.css',
})
export class ProjectTag {
  @Input({ required: true }) label = '';
}
