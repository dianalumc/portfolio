import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectTag } from '../project-tag/project-tag';

export interface ProjectCardData { slug: string; title: string; description: string; tags: string[]; }

@Component({
  imports: [RouterLink, ProjectTag],
  selector: 'app-project-card',
  styleUrl: './project-card.css',
  templateUrl: './project-card.html',
})
export class ProjectCard {
  @Input({ required: true }) project!: ProjectCardData;
}
