import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { projects } from '../../data/projects';
import { ProjectTag } from '../../components/project-tag/project-tag';

@Component({
  imports: [RouterLink, ProjectTag],
  selector: 'app-project-detail',
  templateUrl: './project-detail.html',
  styleUrl: './project-detail.css',
})
export class ProjectDetail {
  protected project = projects[0];

  constructor(private readonly route: ActivatedRoute) {
    this.project = projects.find(({ slug }) => slug === this.route.snapshot.paramMap.get('slug')) ?? projects[0];
  }
}
