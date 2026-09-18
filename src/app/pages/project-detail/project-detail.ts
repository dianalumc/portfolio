import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { projects } from '../../data/projects';
import { AppButton } from '../../components/app-button/app-button';
import { ProjectTag } from '../../components/project-tag/project-tag';
import { AppFooter } from '../../components/app-footer/app-footer';

@Component({
  imports: [RouterLink, AppButton, ProjectTag, AppFooter],
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
